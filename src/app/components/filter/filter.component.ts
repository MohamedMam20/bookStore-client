import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common'; // Required for *ngIf, *ngFor
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  activeFilters: { label: string; value: string }[] = [];

  filters = {
    genre: [
      'Business',
      'Entertainment',
      'Fiction',
      'Humor',
      'Literature',
      'Sugar Flakes',
    ],
    price: [
      '$100 - $200',
      '$200 - $300',
      '$300 - $400',
      '$400 - $500',
      '$500 - $700',
    ],
    language: ['English', 'Hebrew', 'Japanese', 'Korean', 'Spanish'],
  };

  isChecked(label: string, value: string): boolean {
    return this.activeFilters.some(
      (f) => f.label === label && f.value === value
    );
  }

  toggleFilter(label: string, value: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.addFilter(label, value);
    } else {
      this.removeFilter({ label, value });
    }
  }

  addFilter(label: string, value: string) {
    const exists = this.activeFilters.some(
      (f) => f.label === label && f.value === value
    );
    if (!exists) {
      this.activeFilters.push({ label, value });
    }
  }

  removeFilter(filterToRemove: { label: string; value: string }) {
    this.activeFilters = this.activeFilters.filter(
      (f) =>
        !(f.label === filterToRemove.label && f.value === filterToRemove.value)
    );
  }

  clearAllFilters() {
    this.activeFilters = [];
  }
}
