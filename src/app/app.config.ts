import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
import { AuthInterceptor } from './intercepter/auth.intercepter';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
<<<<<<< HEAD
    provideHttpClient(),
    provideAnimations(),  // Required for Toastr
    provideToastr(),      // Enables Toastr globally
  ]
=======
    AuthService,
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],
>>>>>>> f81e3c34affb691b19b319be946277375aafdbe9
};
