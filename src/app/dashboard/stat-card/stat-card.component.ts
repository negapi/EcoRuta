import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.component.html'
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  bgColor = input<string>('bg-primary');
}
