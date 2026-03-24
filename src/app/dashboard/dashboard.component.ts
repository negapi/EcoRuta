import { Component, inject } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { EcoService } from '../eco.service';
import { StatCardComponent } from './stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KeyValuePipe, StatCardComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  protected ecoService = inject(EcoService);

  totalRutas = this.ecoService.totalRutas;
  dificultadPromedio = this.ecoService.dificultadPromedio;
  rutaMasPopular = this.ecoService.rutaMasPopular;
  rutasPorRegion = this.ecoService.rutasPorRegion;
  recomendaciones = this.ecoService.recomendaciones;
}
