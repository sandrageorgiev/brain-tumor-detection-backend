import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define interfaces for type safety
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  surname: string;
  embg: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface BtdUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  embg: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/user';

  constructor(private http: HttpClient) {}

  // ✅ Register user
  register(user: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, user);
  }

  // ✅ Login user
  login(credentials: LoginRequest): Observable<BtdUser> {
    return this.http.post<BtdUser>(`${this.apiUrl}/login`, credentials);
  }
}
