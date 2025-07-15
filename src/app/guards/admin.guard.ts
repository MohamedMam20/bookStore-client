import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken.role !== 'admin') {
        this.router.navigate(['/']);
        return false;
      }

      return true;
    } catch (error) {
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
