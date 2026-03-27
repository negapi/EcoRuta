import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password: string;
  isAdmin: boolean;
  favoritos: number[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private _usuarios = signal<Usuario[]>([]);
  private _currentUser = signal<Usuario | null>(null);

  public readonly currentUser = this._currentUser.asReadonly();
  public readonly isLoggedIn = computed(() => this._currentUser() !== null);
  public readonly isAdmin = computed(() => this._currentUser()?.isAdmin === true);

  constructor() {
    this.http.get<Usuario[]>('/users.json').pipe(
      tap(data => this._usuarios.set(data))
    ).subscribe();
  }

  login(email: string, password: string): boolean {
    const user = this._usuarios().find(
      u => u.email === email && u.password === password
    );
    if (user) {
      this._currentUser.set({ ...user });
      return true;
    }
    return false;
  }

  logout() {
    this._currentUser.set(null);
  }

  toggleFavorito(rutaId: number) {
    const user = this._currentUser();
    if (!user) return;
    const favs = user.favoritos.includes(rutaId)
      ? user.favoritos.filter(id => id !== rutaId)
      : [...user.favoritos, rutaId];
    this._currentUser.set({ ...user, favoritos: favs });
  }

  isFavorito(rutaId: number): boolean {
    return this._currentUser()?.favoritos.includes(rutaId) ?? false;
  }
}