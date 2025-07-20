import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css'], // ✅ Fixed
})
export class PageHeaderComponent {
  @Input() title: string = '';
  @Input() path: string = '';
  @Input() background: string = '';
}
