import { Routes } from '@angular/router';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegistrationComponent } from './pages/auth/registration/registration.component';
import { OtpVerificationComponent } from './pages/auth/otp-verfication/otp-verfication.component';
import { PasswordResetRequestComponent } from './pages/auth/password-reset-request/password-reset-request.component';
import { PasswordResetConfirmComponent } from './pages/auth/password-reset-confirm/password-reset-confirm.component';
import { OtpCompleteComponent } from './pages/auth/otp-complete/otp-complete.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { BooksPageComponent } from './pages/books-page/books-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { AdminComponent } from './pages/admin/admin.component';
import { BookListComponent } from './pages/admin/components/book-list/book-list.component';
import { BookFormComponent } from './pages/admin/components/book-form/book-form.component';
import { DashboardOverviewComponent } from './pages/admin/components/dashboard-overview/dashboard-overview.component';
import { UserListComponent } from './pages/admin/components/user-list/user-list.component';
import { UserFormComponent } from './pages/admin/components/user-form/user-form.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';
import { CheckoutFormComponent } from './components/checkout-form/checkout-form.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component'; // Add this import
import { SearchBooksPageComponent } from './pages/search-books-page/search-books-page.component';
import { PaypalComponent } from './pages/paypal/paypal.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
// import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { AdminGuard } from './guards/admin.guard';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { FAQPageComponent } from './pages/faq-page/faq-page.component';
import { AdminListComponent } from './pages/admin/components/admin-list/admin-list.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {path: 'contact-us', component: ContactUsComponent,title:'contactus'},
  {path: 'faq', component: FAQPageComponent,title:'FAQ'},
  { path: 'paypal', component: PaypalComponent ,title: 'paypal'},

// // export const routes: Routes = [
//   { path: '', component: HomePageComponent },
//   { path: 'paypal', component: PaypalComponent, title: 'paypal' },

  {
    path: 'thank-you',
    loadComponent: () =>
      import('./pages/paypal/thank-you/thank-you.component').then(
        (m) => m.ThankYouComponent
      ),
  },
  { path: 'orders', component: OrderHistoryComponent, title: 'My Orders' },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    title: 'My Profile',
  },

  { path: 'contact-us', component: ContactUsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'shop', component: BooksPageComponent },
  { path: 'checkout', component: CheckoutFormComponent, title: 'Payment Form' },
  {
    path: 'order-confirmation',
    component: OrderConfirmationComponent,
    title: 'Order Confirmation',
  }, // Added route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'otp-verification', component: OtpVerificationComponent },
  { path: 'otp-complete', component: OtpCompleteComponent },
  { path: 'password-reset', component: PasswordResetRequestComponent },
  { path: 'password-reset-confirm', component: PasswordResetConfirmComponent },
  { path: 'product-details', component: ProductDetailsComponent },
  { path: 'my-account', component: MyAccountComponent },
  { path: 'search', component: SearchBooksPageComponent },
  { path: 'aboutus', component: AboutUsComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardOverviewComponent },
      // Books routes
      { path: 'books', component: BookListComponent },
      { path: 'books/new', component: BookFormComponent },
      { path: 'books/edit/:id', component: BookFormComponent },
      // Users routes
      { path: 'users', component: UserListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserFormComponent },
      { path: 'admins', component: AdminListComponent },
      {
        path: 'categories',
        loadComponent: () =>
          import(
            './pages/admin/components/category-list/category-list.component'
          ).then((m) => m.CategoryListComponent),
      },
      {
        path: 'categories/new',
        loadComponent: () =>
          import(
            './pages/admin/components/category-form/category-form.component'
          ).then((m) => m.CategoryFormComponent),
      },
      {
        path: 'categories/edit/:id',
        loadComponent: () =>
          import(
            './pages/admin/components/category-form/category-form.component'
          ).then((m) => m.CategoryFormComponent),
      },
      // Reviews routes
      {
        path: 'reviews',
        loadComponent: () =>
          import(
            './pages/admin/components/review-list/review-list.component'
          ).then((m) => m.ReviewListComponent),
      },
      {
        path: 'reviews/:id',
        loadComponent: () =>
          import(
            './pages/admin/components/review-detail/review-detail.component'
          ).then((m) => m.ReviewDetailComponent),
      },
      // Orders routes
      {
        path: 'orders',
        loadComponent: () =>
          import(
            './pages/admin/components/order-list/order-list.component'
          ).then((m) => m.OrderListComponent),
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import(
            './pages/admin/components/order-detail/order-detail.component'
          ).then((m) => m.OrderDetailComponent),
      },
    ],
  },
  {
    path: 'product-details/:slug',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
  },

  { path: '**', component: NotFoundComponent },

];
