import { Component, input } from '@angular/core';
import { Ruta } from '../../eco.service';

@Component({
  selector: 'app-ruta-card',
  standalone: true,
  imports: [],
  templateUrl: './ruta-card.component.html'
})
export class RutaCardComponent {
  ruta = input.required<Ruta>();
}
