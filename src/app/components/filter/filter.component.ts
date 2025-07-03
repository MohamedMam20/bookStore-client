import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import {
  Filter,
  FilterService,
} from '../../services/filter/filter-state.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit, OnDestroy {
  activeFilters: Filter[] = [];
  subscription!: Subscription;

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
      'LE 100 - LE 200',
      'LE 200 - LE 300',
      'LE 300 - LE 400',
      'LE 400 - LE 500',
      'LE 500 - LE 700',
    ],
    language: ['English', 'French', 'Arabic'],
  };

  constructor(private filterService: FilterService) {}

  ngOnInit() {
    this.subscription = this.filterService.filters$.subscribe((filters) => {
      this.activeFilters = filters;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  isChecked(label: string, value: string): boolean {
    return this.activeFilters.some(
      (f) => f.label === label && f.value === value
    );
  }

  toggleFilter(label: string, value: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.filterService.addFilter({ label, value });
    } else {
      this.filterService.removeFilter({ label, value });
    }
  }

  removeFilter(filter: Filter) {
    this.filterService.removeFilter(filter);
  }

  clearAllFilters() {
    this.filterService.clearFilters();
  }
}
