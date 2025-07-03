import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Filter {
  label: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class FilterService {
  private filtersSubject = new BehaviorSubject<Filter[]>([]);
  filters$ = this.filtersSubject.asObservable();

  get filters(): Filter[] {
    return this.filtersSubject.value;
  }

  addFilter(filter: Filter) {
    if (
      !this.filters.find(
        (f) => f.label === filter.label && f.value === filter.value
      )
    ) {
      this.filtersSubject.next([...this.filters, filter]);
    }
  }

  removeFilter(filter: Filter) {
    this.filtersSubject.next(
      this.filters.filter(
        (f) => !(f.label === filter.label && f.value === filter.value)
      )
    );
  }

  clearFilters() {
    this.filtersSubject.next([]);
  }
}
