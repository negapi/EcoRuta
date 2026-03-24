import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EcoService, Ruta } from '../eco.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="container py-4">
      <h2 class="mb-4 text-primary">Catálogo de Rutas</h2>

      <div class="row g-3 mb-4 p-3 bg-light border rounded">
        <div class="col-md-3">
          <label class="form-label">Búsqueda:</label>
          <input type="text" class="form-control" [ngModel]="filtroNombre()" (ngModelChange)="filtroNombre.set($event)" placeholder="Buscar por nombre...">
        </div>

        <div class="col-md-2">
          <label class="form-label">Dificultad:</label>
          <select class="form-select" [ngModel]="filtroDificultad()" (ngModelChange)="filtroDificultad.set($event)">
            <option value="">Todas</option>
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        <div class="col-md-3">
          <label class="form-label">Precio Máximo: L. {{filtroPrecio()}}</label>
          <input type="range" class="form-range" min="0" max="1000" step="50" [ngModel]="filtroPrecio()" (ngModelChange)="filtroPrecio.set(+$event)">
        </div>

        <div class="col-md-2">
          <label class="form-label">Actividad:</label>
          <select class="form-select" [ngModel]="filtroTipo()" (ngModelChange)="filtroTipo.set($event)">
            <option value="">Todas</option>
            <option value="Senderismo">Senderismo</option>
            <option value="Recreativa">Recreativa</option>
            <option value="Ciclismo">Ciclismo</option>
            <option value="Kayak">Kayak</option>
            <option value="Acampada">Acampada</option>
          </select>
        </div>
      </div>

      <div class="row row-cols-1 row-cols-md-3 g-4" *ngIf="rutasFiltradas().length > 0; else noRutas">
        <div class="col" *ngFor="let ruta of rutasFiltradas()">
          <article class="card h-100 shadow-sm">
            <img [src]="ruta.imagen" class="card-img-top" [alt]="ruta.nombre" style="height: 200px; object-fit: cover;">
            <div class="card-body">
              <h3 class="card-title h5">{{ruta.nombre}}</h3>
              <p class="card-text text-muted mb-2"><i class="bi bi-geo-alt"></i> {{ruta.ubicacion}}</p>
              <div class="d-flex justify-content-between mb-2">
                <span class="badge bg-info text-dark">{{ruta.dificultad}}</span>
                <span class="fw-bold text-success">L. {{ruta.precio}}</span>
              </div>
              <p class="card-text small">{{ruta.descripcion}}</p>
            </div>
            <div class="card-footer bg-transparent border-top-0 d-flex justify-content-between align-items-center">
              <small class="text-muted">{{ruta.duracion}}</small>
              <span class="badge rounded-pill bg-secondary">{{ruta.tipo}}</span>
            </div>
          </article>
        </div>
      </div>

      <ng-template #noRutas>
        <div class="alert alert-warning mt-4" role="alert">
          No se encontraron rutas con los filtros seleccionados.
        </div>
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
