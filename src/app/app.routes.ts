import { Routes } from '@angular/router';
import { CheckoutComponent } from './components/checkout-form/checkout-form.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
      { path: "checkout", component:CheckoutComponent , title: "Payment Form"  },
      { path: "**", component:NotFoundComponent , title: "Error 404"  },


];
