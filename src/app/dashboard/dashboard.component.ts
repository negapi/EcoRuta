import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcoService, Ruta } from '../eco.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="container py-4">
      <h2 class="mb-4 text-primary">Dashboard EcoRuta</h2>

      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <article class="card bg-primary text-white h-100 shadow">
            <div class="card-body text-center">
              <h3 class="card-title h5">Total de Rutas</h3>
              <p class="display-4 fw-bold mb-0">{{totalRutas()}}</p>
            </div>
          </article>
        </div>

        <div class="col-md-4">
          <article class="card bg-success text-white h-100 shadow">
            <div class="card-body text-center">
              <h3 class="card-title h5">Dificultad Promedio</h3>
              <p class="display-4 fw-bold mb-0">{{dificultadPromedio()}}</p>
            </div>
          </article>
        </div>

        <div class="col-md-4">
          <article class="card bg-info text-white h-100 shadow">
            <div class="card-body text-center">
              <h3 class="card-title h5">Ruta Más Popular</h3>
              <p class="h4 mb-1">{{rutaMasPopular().nombre}}</p>
              <div class="progress mt-2" style="height: 10px;">
                <div class="progress-bar bg-warning" role="progressbar" [style.width.%]="rutaMasPopular()?.popularidad"></div>
              </div>
              <small class="d-block mt-1">{{rutaMasPopular().popularidad}}% popularidad</small>
            </div>
          </article>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-md-6">
          <div class="card h-100 shadow-sm">
            <div class="card-header bg-dark text-white">
              <h3 class="card-title h5 mb-0">Rutas por Región</h3>
            </div>
            <div class="card-body p-0">
              <ul class="list-group list-group-flush">
                <li *ngFor="let region of rutasPorRegion() | keyvalue" class="list-group-item d-flex justify-content-between align-items-center">
                  {{region.key}}
                  <span class="badge bg-primary rounded-pill">{{region.value}} actividades</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card h-100 shadow-sm border-warning">
            <div class="card-header bg-warning text-dark">
              <h3 class="card-title h5 mb-0">Recomendaciones para ti</h3>
            </div>
            <div class="card-body">
              <p class="card-text text-muted mb-3">Explora nuestras actividades más destacadas basadas en la preferencia de la comunidad.</p>
              <div *ngFor="let ruta of recomendaciones()" class="mb-3 p-2 border-start border-4 border-warning bg-light">
                <h4 class="h6 fw-bold mb-1">{{ruta.nombre}}</h4>
                <p class="small mb-0 text-secondary">{{ruta.tipo}} - {{ruta.ubicacion}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `
})
export class DashboardComponent implements OnInit {
  private ecoService = inject(EcoService);

  rutas = signal<Ruta[]>([]);

  totalRutas = computed(() => this.rutas().length);

  dificultadPromedio = computed(() => {
    if (this.rutas().length === 0) return 'N/A';
    const conteo = { 'Baja': 0, 'Media': 0, 'Alta': 0 };
    this.rutas().forEach(r => {
      if (r.dificultad === 'Baja') conteo.Baja++;
      if (r.dificultad === 'Media') conteo.Media++;
      if (r.dificultad === 'Alta') conteo.Alta++;
    });

    if (conteo.Alta >= conteo.Media && conteo.Alta >= conteo.Baja) return 'Alta';
    if (conteo.Media >= conteo.Baja) return 'Media';
    return 'Baja';
  });

  rutaMasPopular = computed(() => {
    return this.rutas().reduce((prev, current) =>
      (prev.popularidad > current.popularidad) ? prev : current, this.rutas()[0]);
  });

  rutasPorRegion = computed(() => {
    const regiones: { [key: string]: number } = {};
    this.rutas().forEach(r => {
      const region = r.ubicacion.split(',').pop()?.trim() || r.ubicacion;
      regiones[region] = (regiones[region] || 0) + 1;
    });
    return regiones;
  });

  recomendaciones = computed(() => {
    return this.rutas()
      .sort((a, b) => b.popularidad - a.popularidad)
      .slice(0, 2);
  });

  ngOnInit() {
    this.ecoService.getRutas().subscribe(data => {
      this.rutas.set(data);
    });
  }
}
