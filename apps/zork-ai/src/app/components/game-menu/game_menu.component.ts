import { Component, effect, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CARD_DATA, CardData } from '@zork-ai/core';
import { ZorkService } from '../../services/zork.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-game-menu',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-8">
      <h1 class="text-4xl font-bold text-center mb-12">Welcome to Zork-AI</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        @for (card of cards; track card.id) {
        <button
          (click)="startGame(card.theme)"
          (keyup.enter)="startGame(card.theme)"
          [disabled]="isLoading()"
          class="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transform-gpu transition-all duration-300 hover:scale-[1.03] hover:shadow-xl text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          role="button"
          [attr.aria-label]="'Start ' + card.title + ' game'"
        >
          <div class="relative overflow-hidden">
            <img
              [src]="card.src"
              [alt]="card.title"
              class="w-full h-48 object-cover transform-gpu transition-transform duration-300 group-hover:scale-[1.04]"
              style="image-rendering: -webkit-optimize-contrast; backface-visibility: hidden;"
            />
          </div>
          <div class="p-4">
            <h2 class="text-xl font-bold mb-2">{{ card.title }}</h2>
            <p class="text-gray-400">{{ card.description }}</p>
          </div>
        </button>
        }
      </div>
      <div class="mt-8 max-w-xl mx-auto relative">
        <input
          type="text"
          [formControl]="customTheme"
          placeholder="... Or choose your own adventure"
          maxlength="200"
          class="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2 transform-gpu transition-all duration-300 hover:scale-[1.03] hover:shadow-xl focus:scale-[1.02] focus:shadow-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          (keyup.enter)="startGame(customTheme.value)"
        />
        @if (isLoading()) {
        <div class="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
          <div class="retro-loader text-center font-mono">
            <pre class="text-green-500 text-left animate-pulse mb-4">{{
              loaderFrames[currentFrame]
            }}</pre>
            <div class="typewriter-text text-left text-green-500">
              > LOADING YOUR ADVENTURE...
              <span class="cursor">_</span>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .main-menu {
        padding: 2rem;
      }
      .card-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1rem;
        margin: 2rem 0;
      }
      .card {
        cursor: pointer;
      }
      .card-img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
      .retro-loader {
        font-family: 'Courier New', Courier, monospace;
      }
      .cursor {
        animation: blink 1s step-end infinite;
      }
      .typewriter-text {
        overflow: hidden;
        white-space: nowrap;
        animation: typing 3s steps(30, end) infinite;
      }
      @keyframes blink {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
      }
      @keyframes typing {
        from {
          width: 0;
        }
        to {
          width: 100%;
        }
      }
      pre {
        line-height: 1.2;
        font-size: 14px;
      }
    `
  ]
})
export class GameMenuComponent implements OnDestroy {
  cards: CardData[] = CARD_DATA;
  customTheme = new FormControl({
    value: '',
    disabled: false
  });
  isLoading = signal(false);
  currentFrame = 0;
  private frameInterval: ReturnType<typeof setInterval> | null = null;

  loaderFrames = [
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [/----------]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [//---------]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [///--------]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [////-------]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [/////------]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [//////-----]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [///////----]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [////////---]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [/////////--]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [//////////-]    ║
    ╚═════════════════════╝
`,
    `
    ╔═════════════════════╗
    ║     INITIALIZING    ║
    ║  A GREAT ADVENTURE  ║
    ║                     ║
    ║    [///////////]    ║
    ╚═════════════════════╝
`
  ];

  constructor(private zorkService: ZorkService, private router: Router) {
    effect(() => {
      if (this.isLoading()) {
        this.customTheme.disable();
      } else {
        this.customTheme.enable();
      }
    });
  }

  async startGame(theme: string | null) {
    if (!theme || this.isLoading()) return;

    this.isLoading.set(true);
    this.startLoaderAnimation();

    this.zorkService.startNewGame(theme).subscribe({
      next: (response) => {
        this.router.navigate(['/game'], {
          queryParams: { threadId: response.threadId }
        });
      },
      error: (error) => {
        console.error('Failed to start game:', error);
        this.isLoading.set(false);
        this.stopLoaderAnimation();
        // Add error handling UI here
      }
    });
  }

  startLoaderAnimation() {
    this.frameInterval = setInterval(() => {
      this.currentFrame = (this.currentFrame + 1) % this.loaderFrames.length;
    }, 300);
  }

  stopLoaderAnimation() {
    if (this.frameInterval) {
      clearInterval(this.frameInterval);
    }
  }

  ngOnDestroy() {
    this.stopLoaderAnimation();
    this.customTheme.enable();
  }
}
