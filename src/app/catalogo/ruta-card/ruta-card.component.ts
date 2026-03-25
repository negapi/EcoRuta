import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Ruta } from '../../eco.service';

@Component({
  selector: 'app-ruta-card',
  standalone: true,
  templateUrl: './ruta-card.component.html'
})
export class RutaCardComponent {
  @Input() ruta!: Ruta;
  @Input() isAdmin = false;
  @Input() isLoggedIn = false;
  @Input() isFavorito = false;
  @Output() onDelete = new EventEmitter<number>();
  @Output() onFavorito = new EventEmitter<number>();
}