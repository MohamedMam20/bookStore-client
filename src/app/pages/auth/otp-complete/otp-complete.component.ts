import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-complete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp-complete.component.html',
  styleUrls: ['./otp-complete.component.css']
})
export class OtpCompleteComponent implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {
    // Initialize particles effect
    this.initParticles();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  private initParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;

    // Create particles similar to the login component
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      // Random positioning and animation duration
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;

      container.appendChild(particle);
    }
  }
}
