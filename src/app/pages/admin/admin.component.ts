import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './components/sidebar/sidebar.component';
import { AdminHeaderComponent } from './components/header/header.component';
import { AdminFooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AdminSidebarComponent,
    AdminHeaderComponent,
    AdminFooterComponent
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
