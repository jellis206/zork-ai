import { Routes } from '@angular/router';
import { GameMenuComponent } from './components/game-menu/game_menu.component';
import { GameComponent } from './components/game/game.component';

export const appRoutes: Routes = [
  { path: '', component: GameMenuComponent },
  { path: 'game', component: GameComponent },
  { path: '**', redirectTo: '' }
];
