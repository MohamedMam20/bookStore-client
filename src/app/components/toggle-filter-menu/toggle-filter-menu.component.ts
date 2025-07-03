import { Component, HostListener } from '@angular/core';
import { FilterComponent } from '../filter/filter.component';

// Tell TypeScript about the global bootstrap variable
declare var bootstrap: any;

@Component({
  selector: 'app-toggle-filter-menu',
  standalone: true,
  imports: [FilterComponent],
  templateUrl: './toggle-filter-menu.component.html',
  styleUrl: './toggle-filter-menu.component.css',
})
export class ToggleFilterMenuComponent {
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = window.innerWidth;
    if (width >= 992) {
      const offcanvasElement = document.getElementById('filterOffcanvas');
      if (offcanvasElement) {
        const offcanvasInstance =
          bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      }
    }
  }
}
