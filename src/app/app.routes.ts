import { Routes } from '@angular/router';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CheckoutComponent } from './components/checkout-form/checkout-form.component';
// import { BooksPageComponent } from './pages/books-page/books-page.component';

import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { OtpVerificationComponent } from './pages/auth/otp-verfication/otp-verfication.component';
import { PasswordResetRequestComponent } from './pages/auth/password-reset-request/password-reset-request.component';
import { PasswordResetConfirmComponent } from './pages/auth/password-reset-confirm/password-reset-confirm.component';
import { OtpCompleteComponent } from './pages/auth/otp-complete/otp-complete.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

import { BooksPageComponent } from './pages/books-page/books-page.component';
import { UploadComponent } from './components/upload/upload.component';

import { HomePageComponent } from './components/home-page/home-page.component';
import { AdminComponent } from './pages/admin/admin.component';

// Admin Components
import { BookListComponent } from './pages/admin/components/book-list/book-list.component';
import { BookFormComponent } from './pages/admin/components/book-form/book-form.component';
import { DashboardOverviewComponent } from './pages/admin/components/dashboard-overview/dashboard-overview.component';
import { UserListComponent } from './pages/admin/components/user-list/user-list.component';
import { UserFormComponent } from './pages/admin/components/user-form/user-form.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';


export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'shop', component: BooksPageComponent},
  { path: 'checkout', component: CheckoutComponent, title: 'Payment Form' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'otp-verification', component: OtpVerificationComponent },
  { path: 'otp-complete', component: OtpCompleteComponent },
  { path: 'password-reset', component: PasswordResetRequestComponent },
  { path: 'password-reset-confirm', component: PasswordResetConfirmComponent },
  { path: 'product-details', component: ProductDetailsComponent },
  { path: 'my-account', component: MyAccountComponent},
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverviewComponent },
      { path: 'books', component: BookListComponent },
      { path: 'books/new', component: BookFormComponent },
      { path: 'books/edit/:id', component: BookFormComponent },
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent }, // New route for creating users
      { path: 'users/edit/:id', component: UserFormComponent },
    ]
  },
  {
  path: 'product-details/:id',
  loadComponent: () =>
    import('./pages/product-details/product-details.component').then(
      (m) => m.ProductDetailsComponent
    ),
},
  { path: '**', component: NotFoundComponent },
];
