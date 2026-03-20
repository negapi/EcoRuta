import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcoService, Ruta } from '../eco.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section>
      <h2>Catálogo de Rutas</h2>

      <div>
        <label>Búsqueda:</label>
        <input type="text" [ngModel]="filtroNombre()" (ngModelChange)="filtroNombre.set($event)" placeholder="Buscar por nombre...">

        <label>Dificultad:</label>
        <select [ngModel]="filtroDificultad()" (ngModelChange)="filtroDificultad.set($event)">
          <option value="">Todas</option>
          <option value="Baja">Baja</option>
          <option value="Media">Media</option>
          <option value="Alta">Alta</option>
        </select>

        <label>Precio Máximo: {{filtroPrecio()}}</label>
        <input type="range" min="0" max="1000" step="50" [ngModel]="filtroPrecio()" (ngModelChange)="filtroPrecio.set(+$event)">

        <label>Actividad:</label>
        <select [ngModel]="filtroTipo()" (ngModelChange)="filtroTipo.set($event)">
          <option value="">Todas</option>
          <option value="Senderismo">Senderismo</option>
          <option value="Recreativa">Recreativa</option>
          <option value="Ciclismo">Ciclismo</option>
          <option value="Kayak">Kayak</option>
          <option value="Acampada">Acampada</option>
        </select>
      </div>

      <div *ngIf="rutasFiltradas().length > 0; else noRutas">
        <article *ngFor="let ruta of rutasFiltradas()">
          <img [src]="ruta.imagen" [alt]="ruta.nombre" width="200">
          <h3>{{ruta.nombre}}</h3>
          <p><strong>Ubicación:</strong> {{ruta.ubicacion}}</p>
          <p><strong>Dificultad:</strong> {{ruta.dificultad}}</p>
          <p><strong>Precio:</strong> L. {{ruta.precio}}</p>
          <p><strong>Duración:</strong> {{ruta.duracion}}</p>
          <p><strong>Tipo:</strong> {{ruta.tipo}}</p>
          <p>{{ruta.descripcion}}</p>
        </article>
      </div>

      <ng-template #noRutas>
        <p>No se encontraron rutas con los filtros seleccionados.</p>
      </ng-template>
    </section>
  `
})
export class CatalogoComponent implements OnInit {
  private ecoService = inject(EcoService);

  rutas = signal<Ruta[]>([]);
  filtroNombre = signal<string>('');
  filtroDificultad = signal<string>('');
  filtroPrecio = signal<number>(1000);
  filtroTipo = signal<string>('');

  rutasFiltradas = computed(() => {
    return this.rutas().filter(ruta => {
      const matchNombre = ruta.nombre.toLowerCase().includes(this.filtroNombre().toLowerCase());
      const matchDificultad = this.filtroDificultad() === '' || ruta.dificultad === this.filtroDificultad();
      const matchPrecio = ruta.precio <= this.filtroPrecio();
      const matchTipo = this.filtroTipo() === '' || ruta.tipo === this.filtroTipo();
      return matchNombre && matchDificultad && matchPrecio && matchTipo;
    });
  });

  ngOnInit() {
    this.ecoService.getRutas().subscribe(data => {
      this.rutas.set(data);
    });
  }
}
