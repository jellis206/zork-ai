import {
  Component,
  DestroyRef,
  signal,
  AfterViewChecked,
  ElementRef,
  viewChild,
  effect,
  Signal,
  computed
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ZorkService } from '../../services/zork.service';
import { ZorkMessage } from '@zork-ai/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, combineLatest, finalize, of, switchMap, tap } from 'rxjs';
import { RetroThinkingLoaderComponent } from '../retro-loader/retro_thinking_loader.component';
import { GameOverComponent } from '../game-over/game_over.component';

const MESSAGE_LENGTH_THRESHOLD = 150;
const SUMMARY_LENGTH = 100;

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [ReactiveFormsModule, RetroThinkingLoaderComponent, GameOverComponent],
  template: `
    @if (gameStatus() !== 'playing') {
    <app-game-over [gameState]="gameOver()" />
    }@else{
    <div
      class="min-h-screen bg-gray-900 text-white grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-4 p-4"
    >
      <!-- Game Terminal -->
      <div class="bg-gray-800 rounded-lg shadow-lg flex flex-col">
        <!-- Messages Area -->
        <div #messagesContainer class="flex-1 overflow-y-auto p-4 space-y-2">
          @for (message of messages(); track $index) {
          <div class="message-container" [class.justify-end]="message.player_decision">
            <div
              class="max-w-3/4 rounded-lg px-4 py-2"
              [class]="
                message.player_decision ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
              "
            >
              <span class="font-bold">
                {{ message.player_decision ? '>' : 'ZorkBot:' }}
              </span>
              <span class="ml-2">
                {{ message.reply || message.player_decision }}
              </span>
            </div>
          </div>
          }
          <app-retro-thinking-loader [show]="isProcessing()" />
        </div>

        <!-- Input Area -->
        <div class="border-t border-gray-700 p-4 flex items-center space-x-2">
          <span class="text-green-500 font-mono">&gt;</span>
          <input
            #commandInput
            type="text"
            [formControl]="command"
            (keyup.enter)="submitCommand()"
            class="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            [class.opacity-50]="isProcessing()"
            placeholder="{{ isProcessing() ? 'Waiting for response...' : 'Enter your command...' }}"
          />
        </div>
      </div>

      <!-- Side Panel -->
      <div class="bg-gray-800 rounded-lg shadow-lg p-4 space-y-6">
        <!-- Health Bar -->
        <div class="space-y-2">
          <h3 class="text-xl font-bold">Health</h3>
          <div class="flex flex-wrap">
            @for (heart of hearts(); track $index) {
            <img [src]="getHeartImage(heart)" class="w-6 h-6" alt="health" />
            }
          </div>
        </div>

        <!-- Inventory -->
        <div class="space-y-2">
          <div class="flex items-center gap-2">
            <img src="backpack.webp" alt="Inventory backpack" class="w-6 h-6" />
            <h3 class="text-xl font-bold">Inventory</h3>
          </div>
          <div class="space-y-2">
            @for (item of gameState().items; track $index) {
            <div class="bg-gray-700 rounded-lg px-3 py-2 text-sm">
              {{ item }}
            </div>
            } @if (!gameState().items.length) {
            <div class="text-gray-500 italic">No items in inventory</div>
            }
          </div>
        </div>
      </div>
    </div>
    }
  `,
  styles: [
    `
      .game-screen {
        display: grid;
        grid-template-columns: 1fr 300px;
        height: 100vh;
        gap: 1rem;
        padding: 1rem;
      }
      .messages {
        height: calc(100vh - 100px);
        overflow-y: auto;
        padding: 1rem;
      }
      .message {
        margin-bottom: 0.5rem;
        &.player {
          color: #4caf50;
        }
      }
    `
  ]
})
export class GameComponent implements AfterViewChecked {
  messagesContainer = viewChild<ElementRef>('messagesContainer');
  commandInput = viewChild<ElementRef>('commandInput');

  private readonly THREAD_ID_KEY = 'zork_thread_id';
  private threadId = signal<string>(localStorage.getItem(this.THREAD_ID_KEY) ?? '');
  private readonly queryParams: Signal<Params | undefined>;

  messages = signal<ZorkMessage[]>([]);
  isProcessing = signal(false);
  isLoading = signal(false);
  command = new FormControl('', { nonNullable: true });

  // Compute gameState based on threadId and other state
  gameState = computed(() => ({
    threadId: this.threadId(),
    health: this.health(),
    items: this.items(),
    situation: this.currentSituation()
  }));
  gameStatus = signal<'playing' | 'death' | 'victory' | 'tie'>('playing');
  gameOver: Signal<'death' | 'victory' | 'tie'> = computed(() => {
    const status = this.gameStatus();
    if (status === 'playing') {
      throw new Error('Should not call getNonPlayingState when status is playing');
    }
    return status;
  });

  // Break down state into smaller pieces
  private health = signal<number>(100);
  private items = signal<string[]>([]);

  // Compute hearts based on health
  hearts = computed(() => {
    const health = this.health();
    const hearts: ('full' | 'half' | 'empty')[] = [];

    for (let i = 0; i < 10; i++) {
      const threshold = (i + 1) * 10;
      if (health >= threshold) {
        hearts.push('full');
      } else if (health >= threshold - 5) {
        hearts.push('half');
      } else {
        hearts.push('empty');
      }
    }

    return hearts;
  });

  // Compute current situation
  private currentSituation = computed(() => {
    const messages = this.messages();
    if (!messages.length) return '';

    const msg = messages[messages.length - 1];
    const situation =
      msg?.situation || msg?.context || msg?.reply || msg?.player_decision || 'zork';
    return this.shouldSummarize(situation) ? this.summarize(situation) : situation;
  });

  private isInitialized = signal(false);

  constructor(
    private zorkService: ZorkService,
    private route: ActivatedRoute,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    this.queryParams = toSignal(this.route.queryParams);
    this.fetchGameHistory()();

    // Effect for localStorage sync
    effect(() => {
      const currentThreadId = this.threadId();
      if (currentThreadId) {
        localStorage.setItem(this.THREAD_ID_KEY, currentThreadId);
      } else {
        localStorage.removeItem(this.THREAD_ID_KEY);
      }
    });

    // Effect for command input state
    effect(() => {
      if (this.isProcessing()) {
        this.command.disable();
      } else {
        this.command.enable();
      }
    });

    effect(() => {
      const urlThreadId = this.queryParams()?.['threadId'];
      if (urlThreadId) {
        this.threadId.set(urlThreadId);
      }
    });

    // Set initialized after first real data
    effect(() => {
      if (this.threadId() && this.messages().length > 0) {
        this.isInitialized.set(true);
      }
    });

    effect(() => {
      if (this.isInitialized() && (!this.threadId() || !this.messages().length)) {
        this.router.navigate(['/']);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (!this.messagesContainer()) return;
      const element = this.messagesContainer()?.nativeElement;
      element.scrollTop = element?.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  submitCommand() {
    if (this.isProcessing() || !this.command.value) return;

    this.isProcessing.set(true);
    const decision = this.command.value;
    this.command.setValue('');

    this.zorkService
      .processAction(this.gameState(), decision)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.updateGameState(response);
          this.isProcessing.set(false);
        },
        error: (error) => {
          console.error('Failed to process command:', error);
          this.isProcessing.set(false);
          // Add error handling UI here
        }
      });
  }

  private fetchGameHistory(): Signal<ZorkMessage[] | null> {
    return toSignal(
      combineLatest([toObservable(this.threadId)]).pipe(
        switchMap(([threadId]) => {
          this.isLoading.set(true);
          return this.zorkService.getGameHistory(threadId);
        }),
        tap((history) => this.messages.set(history ?? [])),
        finalize(() => this.isLoading.set(false)),
        catchError(() => {
          this.router.navigate(['/']);
          return of([]);
        })
      ),
      { initialValue: null }
    );
  }

  private updateGameState(messages: ZorkMessage[]) {
    this.messages.update((current) => [...current, ...messages]);

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.items) {
      this.items.set(lastMessage.items);
    }

    const damage = messages.reduce((sum, msg) => sum + (msg.damage || 0), 0);
    const newHealth = Math.max(0, this.health() - damage);
    this.health.set(newHealth);

    if (newHealth <= 0) {
      this.gameStatus.set('death');
    } /*else if (victory) {
      this.gameStatus.set('victory');
    } else if (tie) {
      this.gameStatus.set('tie');
    }*/
  }

  private shouldSummarize(message: string | undefined): boolean {
    if (!message) return false;
    return message.length > MESSAGE_LENGTH_THRESHOLD;
  }

  private summarize(message: string): string {
    // Keep important gameplay elements
    if (
      message.includes('You died') ||
      message.includes('Game Over') ||
      message.includes('You won')
    ) {
      return message;
    }

    // Split message into sentences
    const sentences = message.split(/(?<=[.!?])\s+/);

    // Always keep the first sentence
    let summary = sentences[0];

    // If there are item acquisitions or status changes, include those
    const importantPhrases = sentences.filter(
      (s) =>
        s.includes('You found') ||
        s.includes('You received') ||
        s.includes('Your health') ||
        s.includes('You took') ||
        s.includes('You lost')
    );

    if (importantPhrases.length > 0) {
      summary += ' ' + importantPhrases.join(' ');
    }

    if (summary.length > SUMMARY_LENGTH) {
      summary = summary.substring(0, SUMMARY_LENGTH).trim() + '...';
    }

    return summary;
  }

  getHeartImage(type: 'full' | 'half' | 'empty'): string {
    switch (type) {
      case 'full':
        return 'heart.webp';
      case 'half':
        return 'heart-half.webp';
      case 'empty':
        return 'heart-empty.webp';
    }
  }
}
