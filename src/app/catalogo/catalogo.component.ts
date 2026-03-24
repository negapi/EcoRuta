import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EcoService } from '../eco.service';
import { RutaCardComponent } from './ruta-card/ruta-card.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, RutaCardComponent],
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent {
  private ecoService = inject(EcoService);

  filtroNombre = signal<string>('');
  filtroDificultad = signal<string>('');
  filtroPrecio = signal<number>(1000);
  filtroTipo = signal<string>('');

  rutasFiltradas = computed(() => {
    return this.ecoService.getFilteredRutas({
      nombre: this.filtroNombre(),
      dificultad: this.filtroDificultad(),
      precio: this.filtroPrecio(),
      tipo: this.filtroTipo()
    });
  });
}
