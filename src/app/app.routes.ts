import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CheckoutComponent } from './components/checkout-form/checkout-form.component';
import { BooksPageComponent } from './pages/books-page/books-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'shop', component: BooksPageComponent },
  { path: 'checkout', component: CheckoutComponent, title: 'Payment Form' },
  { path: '**', component: NotFoundComponent },
];
