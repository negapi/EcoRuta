import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EcoService } from '../eco.service';
import { AuthService } from '../auth.service';
import { RutaCardComponent } from './ruta-card/ruta-card.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, RutaCardComponent],
  templateUrl: './catalogo.component.html'
})
export class CatalogoComponent {
  protected ecoService = inject(EcoService);
  protected auth = inject(AuthService);

  filtroNombre = signal('');
  filtroDificultad = signal('');
  filtroPrecio = signal(1000);
  filtroTipo = signal('');
  soloFavoritos = signal(false);

    
  showAddModal = signal(false);
  newNombre = signal('');
  newUbicacion = signal('');
  newDificultad = signal('Media');
  newPrecio = signal(100);
  newDuracion = signal('');
  newTipo = signal('Senderismo');
  newDescripcion = signal('');
  newImagen = signal('');

  rutasFiltradas = computed(() => {
    let rutas = this.ecoService.getFilteredRutas({
      nombre: this.filtroNombre(),
      dificultad: this.filtroDificultad(),
      precio: this.filtroPrecio(),
      tipo: this.filtroTipo()
    });
    if (this.soloFavoritos() && !this.auth.isAdmin()) {
      rutas = rutas.filter(r => this.auth.isFavorito(r.id));
    }
    return rutas;
  });

  deleteRuta(id: number) {
    if (confirm('¿Eliminar esta ruta?')) {
      this.ecoService.deleteRuta(id);
    }
  }

  submitAddRuta() {
    if (!this.newNombre() || !this.newUbicacion()) return;
    this.ecoService.addRuta({
      nombre: this.newNombre(),
      ubicacion: this.newUbicacion(),
      dificultad: this.newDificultad(),
      precio: this.newPrecio(),
      duracion: this.newDuracion(),
      tipo: this.newTipo(),
      popularidad: 50,
      imagen: this.newImagen() || `https://placehold.co/600x400/1B4332/B7E4C7?text=${encodeURIComponent(this.newNombre())}`,
      descripcion: this.newDescripcion()
    });
    this.showAddModal.set(false);
    this.newNombre.set(''); this.newUbicacion.set('');
    this.newDuracion.set(''); this.newDescripcion.set('');
    this.newImagen.set('');
  }
}