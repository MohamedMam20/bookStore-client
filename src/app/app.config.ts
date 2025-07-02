import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { AuthService } from './services/auth/auth.service';
import { authInterceptor } from './interceptors/auth.interceptor';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    AuthService,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideToastr({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
  ],

};
