import { Component, input, effect, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-over',
  standalone: true,
  imports: [CommonModule, RouterLink],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-20px)', opacity: 0 }),
        animate('800ms 400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('ctaFadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 1200ms ease-out', style({ opacity: 1 }))
      ])
    ]),
    // Add this to match your template usage
    trigger('buttonFadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 1200ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ],
  template: `
    <div
      [@fadeIn]
      class="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 font-vt323"
    >
      <div class="max-w-2xl w-full mx-4 text-center" [ngClass]="getStatusClass()">
        <!-- Death Screen -->
        @if (gameState() === 'death') {
        <pre [@slideIn] class="text-red-500 leading-tight">
  ▄████  ▄▄▄       ███▄ ▄███▓▓█████
 ██▒ ▀█▒▒████▄    ▓██▒▀█▀ ██▒▓█   ▀
▒██░▄▄▄░▒██  ▀█▄  ▓██    ▓██░▒███
░▓█  ██▓░██▄▄▄▄██ ▒██    ▒██ ▒▓█  ▄
░▒▓███▀▒ ▓█   ▓██▒▒██▒   ░██▒░▒████▒
 ░▒   ▒  ▒▒   ▓▒█░░ ▒░   ░  ░░░ ▒░ ░
  ░   ░   ▒   ▒▒ ░░  ░      ░ ░ ░  ░
░ ░   ░   ░   ▒   ░      ░      ░
      ░       ░  ░       ░      ░  ░

 ▒█████   ██▒   █▓▓█████  ██▀███
▒██▒  ██▒▓██░   █▒▓█   ▀ ▓██ ▒ ██▒
▒██░  ██▒ ▓██  █▒░▒███   ▓██ ░▄█ ▒
▒██   ██░  ▒██ █░░▒▓█  ▄ ▒██▀▀█▄
░ ████▓▒░   ▒▀█░  ░▒████▒░██▓ ▒██▒
░ ▒░▒░▒░    ░ ▐░  ░░ ▒░ ░░ ▒▓ ░▒▓░
  ░ ▒ ▒░    ░ ░░   ░ ░  ░  ░▒ ░ ▒░
░ ░ ░ ▒       ░░     ░     ░░   ░
    ░ ░        ░     ░  ░   ░
              ░
</pre
        >
        }

        <!-- Victory Screen -->
        @if (gameState() === 'victory') {
        <pre [@slideIn] class="text-green-500 leading-tight">
██╗   ██╗██╗ ██████╗████████╗ ██████╗ ██████╗ ██╗   ██╗
██║   ██║██║██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║██║        ██║   ██║   ██║██████╔╝ ╚████╔╝
╚██╗ ██╔╝██║██║        ██║   ██║   ██║██╔══██╗  ╚██╔╝
 ╚████╔╝ ██║╚██████╗   ██║   ╚██████╔╝██║  ██║   ██║
  ╚═══╝  ╚═╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝   ╚═╝   </pre
        >
        }

        <!-- stalemate Screen -->
        @if (gameState() === 'stalemate') {
        <pre [@slideIn] class="text-yellow-500 leading-tight">
▗▖    ▄▄▄   ▄▄▄ ▄ ▄▄▄▄
▐▌   █   █ █    ▄ █   █
▐▛▀▚▖▀▄▄▄▀ █    █ █   █
▐▙▄▞▘           █     ▗▄▖
                     ▐▌ ▐▌
                      ▝▀▜▌
                     ▐▙▄▞▘
▄   ▄  ▄▄▄  █  ▐▌     ▄▄▄ ▐▌    ▄▄▄  █  ▐▌█    ▐▌
█   █ █   █ ▀▄▄▞▘    ▀▄▄  ▐▌   █   █ ▀▄▄▞▘█    ▐▌
 ▀▀▀█ ▀▄▄▄▀          ▄▄▄▀ ▐▛▀▚▖▀▄▄▄▀      █ ▗▞▀▜▌
▄   █                     ▐▌ ▐▌           █ ▝▚▄▟▌
 ▀▀▀


▗▞▀▜▌   ■      █ ▗▞▀▚▖▗▞▀▜▌ ▄▄▄  ■         ▐▌▄ ▗▞▀▚▖
▝▚▄▟▌▗▄▟▙▄▖    █ ▐▛▀▀▘▝▚▄▟▌▀▄▄▗▄▟▙▄▖       ▐▌▄ ▐▛▀▀▘
       ▐▌      █ ▝▚▄▄▖     ▄▄▄▀ ▐▌      ▗▞▀▜▌█ ▝▚▄▄▖
       ▐▌      █                ▐▌      ▝▚▄▟▌█
       ▐▌                       ▐▌


▄▄▄▄  ▗▞▀▚▖▄   ▄  ■         ■  ▄ ▄▄▄▄  ▗▞▀▚▖
█   █ ▐▛▀▀▘ ▀▄▀▗▄▟▙▄▖    ▗▄▟▙▄▖▄ █ █ █ ▐▛▀▀▘
█   █ ▝▚▄▄▖▄▀ ▀▄ ▐▌        ▐▌  █ █   █ ▝▚▄▄▖
                 ▐▌        ▐▌  █
                 ▐▌        ▐▌
</pre
        >
        }

        <div [@slideIn] class="mt-8 space-y-4">
          <h2 class="text-4xl" [ngClass]="getMessageClass()">
            {{ getMessage() }}
          </h2>
          <p class="text-xl text-gray-400">
            {{ getSubMessage() }}
          </p>
        </div>

        <div [@buttonFadeIn] class="mt-12">
          <button
            routerLink="/"
            class="px-8 py-4 text-2xl rounded-lg transition-all duration-300"
            [class.opacity-50]="!isBlinking()"
            [ngClass]="getButtonClass()"
          >
            [ PRESS ANY KEY TO CONTINUE ]
          </button>
        </div>

        <!-- <div [@buttonFadeIn] class="mt-6 text-xl text-gray-500">FINAL SCORE: {{ score() }}</div> -->
      </div>
    </div>
  `,
  styles: [
    `
      @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

      :host {
        font-family: 'VT323', monospace;
      }

      pre {
        font-family: 'VT323', monospace;
        font-size: 1rem;
        line-height: 1.2;
      }
    `
  ]
})
export class GameOverComponent {
  gameState = input.required<'death' | 'victory' | 'stalemate'>();

  isBlinking = signal(true);
  //  score = signal(10)
  private canNavigate = signal(false);

  constructor(private router: Router) {
    // Blink effect
    effect(() => {
      const interval = setInterval(() => {
        this.isBlinking.update((v) => !v);
      }, 800);

      // Allow navigation after a short delay
      setTimeout(() => {
        this.canNavigate.set(true);
      }, 1000);

      return () => clearInterval(interval);
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent() {
    if (this.canNavigate()) {
      this.router.navigate(['/']);
    }
  }

  getStatusClass() {
    switch (this.gameState()) {
      case 'death':
        return 'text-red-500';
      case 'victory':
        return 'text-green-500';
      case 'stalemate':
        return 'text-yellow-500';
      default:
        return '';
    }
  }

  getButtonClass() {
    switch (this.gameState()) {
      case 'death':
        return 'bg-red-950 hover:bg-red-900 text-red-500';
      case 'victory':
        return 'bg-green-950 hover:bg-green-900 text-green-500';
      case 'stalemate':
        return 'bg-yellow-950 hover:bg-yellow-900 text-yellow-500';
      default:
        return '';
    }
  }

  getMessage(): string {
    switch (this.gameState()) {
      case 'death':
        return 'YOUR QUEST HAS ENDED';
      case 'victory':
        return 'A TRUE HERO EMERGES';
      case 'stalemate':
        return 'THE JOURNEY CONTINUES...';
      default:
        return '';
    }
  }

  getSubMessage(): string {
    switch (this.gameState()) {
      case 'death':
        return 'But the dungeon awaits another brave soul...';
      case 'victory':
        return 'Your legend shall echo through the ages!';
      case 'stalemate':
        return 'Not all who wander are lost...';
      default:
        return '';
    }
  }

  getMessageClass(): string {
    switch (this.gameState()) {
      case 'death':
        return 'text-red-500';
      case 'victory':
        return 'text-green-500';
      case 'stalemate':
        return 'text-yellow-500';
      default:
        return '';
    }
  }
}
