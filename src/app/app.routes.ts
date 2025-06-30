import { Routes } from '@angular/router';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CheckoutComponent } from './components/checkout-form/checkout-form.component';
import { BooksPageComponent } from './pages/books-page/books-page.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { OtpVerificationComponent } from './pages/auth/otp-verfication/otp-verfication.component';
import { PasswordResetRequestComponent } from './pages/auth/password-reset-request/password-reset-request.component';
import { PasswordResetConfirmComponent } from './pages/auth/password-reset-confirm/password-reset-confirm.component';
import { OtpCompleteComponent } from './pages/auth/otp-complete/otp-complete.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

// import { BooksPageComponent } from './pages/books-page/books-page.component';
import { HomePageComponent } from './home-page/home-page.component';
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'wishlist', component: WishlistComponent },
  // { path: 'shop', component: BooksPageComponent },
  { path: 'checkout', component: CheckoutComponent, title: 'Payment Form' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'otp-verification', component: OtpVerificationComponent },
  { path: 'otp-complete', component: OtpCompleteComponent },
  { path: 'password-reset', component: PasswordResetRequestComponent },
  { path: 'password-reset-confirm', component: PasswordResetConfirmComponent },
  { path: 'product-details', component: ProductDetailsComponent },
  { path: '**', component: NotFoundComponent },
];
