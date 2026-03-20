import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EcoService, Ruta } from '../eco.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section>
      <h2>Dashboard EcoRuta</h2>

      <div>
        <article>
          <h3>Total de Rutas</h3>
          <p>{{totalRutas()}}</p>
        </article>

        <article>
          <h3>Dificultad Promedio</h3>
          <p>{{dificultadPromedio()}}</p>
        </article>

        <article>
          <h3>Ruta Más Popular</h3>
          <p>{{rutaMasPopular()?.nombre}} ({{rutaMasPopular()?.popularidad}}%)</p>
        </article>
      </div>

      <div>
        <h3>Rutas por Región</h3>
        <ul>
          <li *ngFor="let region of rutasPorRegion() | keyvalue">
            {{region.key}}: {{region.value}} actividades
          </li>
        </ul>
      </div>

      <div>
        <h3>Recomendaciones para ti</h3>
        <p>Explora nuestras actividades más destacadas basadas en la preferencia de la comunidad.</p>
        <div *ngFor="let ruta of recomendaciones()">
          <h4>{{ruta.nombre}}</h4>
          <p>{{ruta.tipo}} - {{ruta.ubicacion}}</p>
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
