import { Component, OnInit, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminSidebarComponent } from './components/sidebar/sidebar.component';
import { AdminHeaderComponent } from './components/header/header.component';
import { AdminFooterComponent } from './components/footer/footer.component';
import { trigger, transition, style, animate, state, query, animateChild } from '@angular/animations';

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
  styleUrls: ['./admin.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AdminComponent implements OnInit {
  isMobile = false;
  sidebarCollapsed = false;
  isAnimating = false;

  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    this.checkScreenSize();
    this.loadSidebarState();

    // Add smooth page transitions
    this.renderer.addClass(document.body, 'smooth-transitions');
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    const prevIsMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Automatically collapse sidebar on mobile
    if (this.isMobile && !prevIsMobile) {
      this.sidebarCollapsed = true;
    } else if (!this.isMobile && prevIsMobile) {
      // Restore sidebar state when returning from mobile to desktop
      this.loadSidebarState();
    }
  }

  toggleSidebar() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    this.sidebarCollapsed = !this.sidebarCollapsed;

    // Save sidebar state
    this.saveSidebarState();

    // Add smooth transition effect
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
      this.isAnimating = false;
      
      // Force layout recalculation to ensure proper sizing
      document.body.style.minHeight = '100vh';
      setTimeout(() => {
        document.body.style.minHeight = '';
      }, 0);
    }, 400);
  }

  private loadSidebarState() {
    const savedState = localStorage.getItem('admin-sidebar-collapsed');
    if (savedState !== null && !this.isMobile) {
      this.sidebarCollapsed = JSON.parse(savedState);
    }
  }

  private saveSidebarState() {
    if (!this.isMobile) {
      localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(this.sidebarCollapsed));
    }
  }
}
