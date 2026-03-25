import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('EcoRuta Honduras');
  protected auth = inject(AuthService);

  showLogin = signal(false);
  loginTab = signal<'user' | 'admin'>('user');
  loginEmail = signal('');
  loginPassword = signal('');
  loginError = signal('');

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.showLogin.set(false);
      this.loginError.set('');
    }
  }

  submitLogin() {
    const success = this.auth.login(this.loginEmail(), this.loginPassword());
    if (success) {
      this.showLogin.set(false);
      this.loginError.set('');
      this.loginEmail.set('');
      this.loginPassword.set('');
    } else {
      this.loginError.set('Correo o contraseña incorrectos.');
    }
  }

  logout() {
    this.auth.logout();
  }
}