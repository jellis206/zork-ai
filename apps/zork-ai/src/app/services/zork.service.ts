import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ZorkMessage, GameState, NewGameResponse } from '@zork-ai/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ZorkService {
  private apiUrl = 'http://localhost:3000/api/game';

  constructor(private http: HttpClient) {}

  startNewGame(theme: string): Observable<NewGameResponse> {
    return this.http.post<NewGameResponse>(`${this.apiUrl}/start`, { theme });
  }

  processAction(gameState: GameState, decision: string): Observable<ZorkMessage[]> {
    return this.http.post<ZorkMessage[]>(`${this.apiUrl}/action`, {
      ...gameState,
      decision
    });
  }

  recoverState(gameState: GameState, decision: string): Observable<ZorkMessage[]> {
    return this.http.post<ZorkMessage[]>(`${this.apiUrl}/recover-state`, {
      ...gameState,
      decision
    });
  }

  getGameHistory(threadId: string): Observable<ZorkMessage[]> {
    return this.http.get<ZorkMessage[]>(`${this.apiUrl}/history/${threadId}`);
  }
}
