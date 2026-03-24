import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Ruta {
  id: number;
  nombre: string;
  ubicacion: string;
  dificultad: 'Baja' | 'Media' | 'Alta' | string;
  precio: number;
  duracion: string;
  tipo: string;
  popularidad: number;
  imagen: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class EcoService {
  private http = inject(HttpClient);
  private apiUrl = '/rutas.json';

  private _rutas = signal<Ruta[]>([]);
  public readonly rutas = this._rutas.asReadonly();

  constructor() {
    this.cargarRutas().subscribe();
  }

  cargarRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.apiUrl).pipe(
      tap(data => this._rutas.set(data))
    );
  }

  totalRutas = computed(() => this.rutas().length);

  dificultadPromedio = computed(() => {
    const data = this.rutas();
    if (data.length === 0) return 'N/A';
    const conteo = { 'Baja': 0, 'Media': 0, 'Alta': 0 };
    data.forEach(r => {
      if (r.dificultad === 'Baja') conteo.Baja++;
      if (r.dificultad === 'Media') conteo.Media++;
      if (r.dificultad === 'Alta') conteo.Alta++;
    });

    if (conteo.Alta >= conteo.Media && conteo.Alta >= conteo.Baja) return 'Alta';
    if (conteo.Media >= conteo.Baja) return 'Media';
    return 'Baja';
  });

  rutaMasPopular = computed(() => {
    const data = this.rutas();
    if (data.length === 0) return null;
    return data.reduce((prev, current) =>
      (prev.popularidad > current.popularidad) ? prev : current, data[0]);
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
    return [...this.rutas()]
      .sort((a, b) => b.popularidad - a.popularidad)
      .slice(0, 2);
  });

  getFilteredRutas(filters: { nombre: string; dificultad: string; precio: number; tipo: string }) {
    return this.rutas().filter(ruta => {
      const matchNombre = ruta.nombre.toLowerCase().includes(filters.nombre.toLowerCase());
      const matchDificultad = filters.dificultad === '' || ruta.dificultad === filters.dificultad;
      const matchPrecio = ruta.precio <= filters.precio;
      const matchTipo = filters.tipo === '' || ruta.tipo === filters.tipo;
      return matchNombre && matchDificultad && matchPrecio && matchTipo;
    });
  }
}
