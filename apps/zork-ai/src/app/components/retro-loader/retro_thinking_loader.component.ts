import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-retro-thinking-loader',
  standalone: true,
  template: `
    @if (show) {
    <div class="font-mono text-green-500 animate-typing">
      {{ loadingText }}
    </div>
    }
  `,
  styles: [
    `
      @keyframes typing {
        0% {
          content: '';
        }
        25% {
          content: '.';
        }
        50% {
          content: '..';
        }
        75% {
          content: '...';
        }
        100% {
          content: '....';
        }
      }

      .animate-typing::after {
        content: '';
        animation: typing 2s steps(4) infinite;
      }
    `
  ]
})
export class RetroThinkingLoaderComponent {
  @Input() show = false;
  loadingText = 'Thinking';
}
