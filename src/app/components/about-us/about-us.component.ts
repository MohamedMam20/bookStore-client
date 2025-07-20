import { Component } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [PageHeaderComponent, CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})
export class AboutUsComponent {}
