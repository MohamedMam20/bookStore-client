import { Component } from '@angular/core';
import { NavbarComponent} from '../../components/navbar-components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { ProductDetailsComponent } from '../product-details/product-details.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, RouterModule, ProductDetailsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
