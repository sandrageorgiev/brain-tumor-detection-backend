import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  setUserData(username: string, role: string): void {
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('role', role);
  }

  getUsername(): string | null {
    return sessionStorage.getItem('username');
  }

  getRole(): string | null {
    return sessionStorage.getItem('role');
  }

  clear(): void {
    sessionStorage.clear();
  }
}
