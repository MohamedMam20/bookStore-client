import { Component } from '@angular/core';
import { Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-toggle-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './toggle-menu.component.html',
  styleUrl: './toggle-menu.component.css',
})
export class ToggleMenuComponent {
  @Input() isToggleVisible = false;
  @Output() toggleClosed = new EventEmitter<boolean>();
  closeToggle() {
    this.toggleClosed.emit();
  }
}
