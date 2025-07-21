import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { PayComponent } from './components/payForm/pay/pay.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: 'contact-us',
    loadComponent: () =>
      import('./pages/contact-us/contact-us.component').then(
        (m) => m.ContactUsComponent
      ),
    title: 'contactus',
  },
  {
    path: 'faq',
    loadComponent: () =>
      import('./pages/faq-page/faq-page.component').then(
        (m) => m.FAQPageComponent
      ),
    title: 'FAQ',
  },
  {
    path: 'paypal',
    loadComponent: () =>
      import('./pages/paypal/paypal.component').then((m) => m.PaypalComponent),
    title: 'paypal',
  },
  {
    path: 'thank-you',
    loadComponent: () =>
      import('./pages/paypal/thank-you/thank-you.component').then(
        (m) => m.ThankYouComponent
      ),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./pages/order-history/order-history.component').then(
        (m) => m.OrderHistoryComponent
      ),
    title: 'My Orders',
  },
  {
    path: 'user-profile',
    loadComponent: () =>
      import('./pages/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
    title: 'My Profile',
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist.component').then(
        (m) => m.WishlistComponent
      ),
  },
  {
    path: 'shop',
    loadComponent: () =>
      import('./pages/books-page/books-page.component').then(
        (m) => m.BooksPageComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./components/checkout-form/checkout-form.component').then(
        (m) => m.CheckoutFormComponent
      ),
    title: 'Payment Form',
  },
  {
    path: 'order-confirmation',
    loadComponent: () =>
      import(
        './components/order-confirmation/order-confirmation.component'
      ).then((m) => m.OrderConfirmationComponent),
    title: 'Order Confirmation',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/registration/registration.component').then(
        (m) => m.RegistrationComponent
      ),
  },
  {
    path: 'otp-verification',
    loadComponent: () =>
      import('./pages/auth/otp-verfication/otp-verfication.component').then(
        (m) => m.OtpVerificationComponent
      ),
  },
  {
    path: 'otp-complete',
    loadComponent: () =>
      import('./pages/auth/otp-complete/otp-complete.component').then(
        (m) => m.OtpCompleteComponent
      ),
  },
  {
    path: 'password-reset',
    loadComponent: () =>
      import(
        './pages/auth/password-reset-request/password-reset-request.component'
      ).then((m) => m.PasswordResetRequestComponent),
  },
  {
    path: 'password-reset-confirm',
    loadComponent: () =>
      import(
        './pages/auth/password-reset-confirm/password-reset-confirm.component'
      ).then((m) => m.PasswordResetConfirmComponent),
  },
  {
    path: 'product-details',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
  },
  {
    path: 'my-account',
    loadComponent: () =>
      import('./pages/my-account/my-account.component').then(
        (m) => m.MyAccountComponent
      ),
  },
  {
    path: 'search',
    loadComponent: () =>
      import('./pages/search-books-page/search-books-page.component').then(
        (m) => m.SearchBooksPageComponent
      ),
  },
  {
    path: 'aboutus',
    loadComponent: () =>
      import('./components/about-us/about-us.component').then(
        (m) => m.AboutUsComponent
      ),
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import(
            './pages/admin/components/dashboard-overview/dashboard-overview.component'
          ).then((m) => m.DashboardOverviewComponent),
      },
      // Books routes
      {
        path: 'books',
        loadComponent: () =>
          import('./pages/admin/components/book-list/book-list.component').then(
            (m) => m.BookListComponent
          ),
      },
      {
        path: 'books/new',
        loadComponent: () =>
          import('./pages/admin/components/book-form/book-form.component').then(
            (m) => m.BookFormComponent
          ),
      },
      {
        path: 'books/edit/:id',
        loadComponent: () =>
          import('./pages/admin/components/book-form/book-form.component').then(
            (m) => m.BookFormComponent
          ),
      },
      // Users routes
      {
        path: 'users',
        loadComponent: () =>
          import('./pages/admin/components/user-list/user-list.component').then(
            (m) => m.UserListComponent
          ),
      },
      {
        path: 'users/new',
        loadComponent: () =>
          import('./pages/admin/components/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      {
        path: 'users/edit/:id',
        loadComponent: () =>
          import('./pages/admin/components/user-form/user-form.component').then(
            (m) => m.UserFormComponent
          ),
      },
      {
        path: 'admins',
        loadComponent: () =>
          import(
            './pages/admin/components/admin-list/admin-list.component'
          ).then((m) => m.AdminListComponent),
      },
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
     { path: 'payment', component: PayComponent},

  {
    path: 'product-details/:slug',
    loadComponent: () =>
      import('./pages/product-details/product-details.component').then(
        (m) => m.ProductDetailsComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  }
];
