import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: '**', component: NotFoundComponent }, // Wildcard route for 404
];
