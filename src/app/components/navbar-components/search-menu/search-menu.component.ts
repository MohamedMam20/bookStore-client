import { Component } from '@angular/core';
import { Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-search-menu',
  standalone: true,
  imports: [],
  templateUrl: './search-menu.component.html',
  styleUrl: './search-menu.component.css',
})
export class SearchMenuComponent {
  @Input() isSearchVisible = false;
  @Output() searchClosed = new EventEmitter<boolean>();
  closeSearch() {
    this.searchClosed.emit();
  }
}
