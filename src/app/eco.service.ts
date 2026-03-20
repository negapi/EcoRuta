import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ruta {
  id: number;
  nombre: string;
  ubicacion: string;
  dificultad: string;
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
  private apiUrl = '/rutas.json';

  constructor(private http: HttpClient) { }

  getRutas(): Observable<Ruta[]> {
    return this.http.get<Ruta[]>(this.apiUrl);
  }
}
