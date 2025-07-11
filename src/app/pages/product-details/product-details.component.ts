// import {
//   Component,
//   ElementRef,
//   ViewChild,
//   OnInit,
//   inject,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { BooksService } from '../../services/books/books.service';
// import { BookReviewsComponent } from '../book-reviews/book-reviews.component';
// import { environment } from '../../../environments/environment';
// import { CartService } from '../../services/cart/cart.service';
// import { Stripe } from '@stripe/stripe-js';

// import { AuthService } from '../../services/auth/auth.service';
// import { StripeService } from '../../services/payment/payment.service';
// import { loadStripe } from '@stripe/stripe-js';


// @Component({
//   selector: 'app-product-details',
//   standalone: true,
//   templateUrl: './product-details.component.html',
//   styleUrls: ['./product-details.component.css'],
//   imports: [CommonModule, FormsModule, BookReviewsComponent],
// })
// export class ProductDetailsComponent implements OnInit {
//   // constructor(private cartService: CartService) {}
// constructor(
//   private cartService: CartService,
//   private authService: AuthService,
//   private stripeService: StripeService
// ) {}


//   imageBaseUrl = environment.imageBaseUrl;
//   private route = inject(ActivatedRoute);
//   private toastr = inject(ToastrService);
//   private booksService = inject(BooksService);
//   Math = Math;
//   Number = Number;
//   averageRating = 0;
//   reviewsCount = 0;
//   selectedLanguage: 'ar' | 'en' | 'fr' = 'en';
//   slug: string = '';
//   quantity = 1;
//   viewsCount = 0;
//   showDescription = false;
//   showReviewsSection = false;
//   showSection: 'review' | 'description' | '' = '';
//   bookLoading = false;
//   bookError: string | null = null;
//   clientSecret!: string;
//   orderId!: string;
//   elements: any;
//   cardElement: any;
//   stripe!: Stripe;
//   isPaymentReady = false;

//   product: any = {};
//   @ViewChild('reviewSection') reviewSection!: ElementRef;

//   ngOnInit() {
//     this.viewsCount = Math.floor(Math.random() * 200) + 50;

//     this.route.paramMap.subscribe((params) => {
//       const id = params.get('id');
//       if (id) {
//         this.slug = id;
//         this.fetchProduct(id);
//       }
//     });
//   }

//   onRatingStatsChange(data: { average: number; count: number }) {
//     this.averageRating = data.average;
//     this.reviewsCount = data.count;
//   }

//   getLanguageName(code: string): string {
//     const names: any = {
//       en: 'English',
//       ar: 'Arabic',
//       fr: 'French',
//     };
//     return names[code] || code;
//   }

//   fetchProduct(id: string) {
//     this.bookLoading = true;
//     this.bookError = null;

//     this.booksService.getBookById(id).subscribe({
//       next: (res: any) => {
//         this.product = res.data || res;

//         this.slug = this.product.slug;

//         this.averageRating = this.product.averageRating || 0;
//         this.reviewsCount = this.product.reviewsCount || 0;

//         this.product.languages = (
//           Object.entries(this.product.stock || {}) as [string, number][]
//         )
//           .filter(([_, quantity]) => quantity > 0)
//           .map(([code]) => ({
//             name: this.getLanguageName(code),
//             code,
//             selected: code === 'en',
//           }));

//         this.selectedLanguage =
//           this.product.languages.find((l: any) => l.selected)?.code || 'en';

//         this.bookLoading = false;
//       },
//       error: (err: any) => {
//         this.bookError = err?.error?.message || 'Error fetching book details.';
//         this.toastr.error(this.bookError || 'Error fetching book details.');
//         this.bookLoading = false;
//       },
//     });
//   }

//   increment() {
//     const maxStock = this.getStockForSelectedLang();
//     if (this.quantity < maxStock) this.quantity++;
//   }

//   decrement() {
//     if (this.quantity > 1) this.quantity--;
//   }

//   selectLanguage(lang: any) {
//     this.product.languages?.forEach((l: any) => (l.selected = false));
//     lang.selected = true;
//     this.selectedLanguage = lang.code;
//   }

//   getStockForSelectedLang(): number {
//     return this.product.stock?.[this.selectedLanguage] || 0;
//   }

//   toggleSection(section: 'review' | 'description') {
//     this.showSection = section;
//     this.showReviewsSection = section === 'review';
//     this.showDescription = section === 'description';
//   }

//   scrollToReview() {
//     this.showSection = 'review';
//     this.showReviewsSection = true;
//     setTimeout(() => {
//       this.reviewSection?.nativeElement.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }, 0);
//   }
//   addToCart() {
//     const bookId = this.product._id;
//     const quantity = this.quantity;
//     const language = this.selectedLanguage;

//     this.cartService.addToCart({ bookId, quantity, language }).subscribe({
//       next: (res) => {
//         this.toastr.success(res.message);
//         console.log(res);
//       },
//       error: (err) => {
//         this.toastr.error(err.error.message || 'Error adding to cart');
//         console.error(err);
//       },
//     });
//   }
//  buyNow() {
//   const body = {
//     productId: this.product._id,
//     quantity: this.quantity || 1,
//     amount: this.product.price * (this.quantity || 1),
//     userId: this.authService.user._id,
//     email: this.authService.user.email
//   };
// this.stripeService.createCheckout(body).subscribe(async (res: any) => {

//     const stripe = await loadStripe('pk_test_51RgZk44D7v1sBWtpYknNweFjXqV492N65jOnP17tW0Ae8axsePHPZ1cjHQrFZ5miDChrGyKuVf6th5PV1UESoVjJ00rq5z7L6q'); // عدلي المفتاح هنا
//     const elements = stripe!.elements({ clientSecret: res.clientSecret });
//     const paymentElement = elements.create('payment');
//     paymentElement.mount('#payment-element');

//     this.clientSecret = res.clientSecret;
//     this.orderId = res.orderId;
//     this.elements = elements;
//     this.stripe = stripe!;
//     this.cardElement = paymentElement;

//     this.isPaymentReady = true;
//   });
// }
// confirmBuyNow() {
//   this.stripe.confirmPayment({
//     elements: this.elements,
//     confirmParams: { return_url: window.location.href },
//     redirect: 'if_required'
//   }).then(result => {
//     if (result.error) {
//       alert(result.error.message);
//     } else if (result.paymentIntent?.status === 'succeeded') {
//       this.stripeService.confirmPayment({
//         paymentIntentId: result.paymentIntent.id,
//         orderId: this.orderId
//       }).subscribe(() => {
//         alert('Payment successful!');
//       });
//     }
//   });
// }

// }

import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BooksService } from '../../services/books/books.service';
import { BookReviewsComponent } from '../book-reviews/book-reviews.component';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart/cart.service';
import { Stripe } from '@stripe/stripe-js';
import { AuthService } from '../../services/auth/auth.service';
import { StripeService } from '../../services/payment/payment.service';



@Component({
  selector: 'app-product-details',
  standalone: true,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  imports: [CommonModule, FormsModule, BookReviewsComponent],
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private StripeService: StripeService,
    private route: ActivatedRoute,
  private router: Router) {}

  imageBaseUrl = environment.imageBaseUrl;

  private toastr = inject(ToastrService);
  private booksService = inject(BooksService);
  Math = Math;
  Number = Number;
  averageRating = 0;
  reviewsCount = 0;
  selectedLanguage: 'ar' | 'en' | 'fr' = 'en';
  slug: string = '';
  quantity = 1;
  viewsCount = 0;
  showDescription = false;
  showReviewsSection = false;
  showSection: 'review' | 'description' | '' = '';
  bookLoading = false;
  bookError: string | null = null;
  clientSecret!: string;
  orderId!: string;
  elements: any;
  cardElement: any;
  stripe: Stripe | null = null;
  isPaymentReady = false;


  product: any = {};
  @ViewChild('reviewSection') reviewSection!: ElementRef;

  ngOnInit() {
    this.viewsCount = Math.floor(Math.random() * 200) + 50;

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.slug = slug;
        this.fetchProduct(slug);
      }
    });
  }

  onRatingStatsChange(data: { average: number; count: number }) {
    this.averageRating = data.average;
    this.reviewsCount = data.count;
  }

  getLanguageName(code: string): string {
    const names: any = {
      en: 'English',
      ar: 'Arabic',
      fr: 'French',
    };
    return names[code] || code;
  }

  fetchProduct(id: string) {
    this.bookLoading = true;
    this.bookError = null;

    this.booksService.getBookById(id).subscribe({
      next: (res: any) => {
        this.product = res.data || res;

        this.slug = this.product.slug;

        this.averageRating = this.product.averageRating || 0;
        this.reviewsCount = this.product.reviewsCount || 0;

        this.product.languages = (
  Object.entries(this.product.stock || {}) as [string, number][]
).map(([code, quantity]) => ({
  name: this.getLanguageName(code),
  code,
  selected: code === 'en',
  stock: quantity
}));

        const defaultLang = this.product.languages.find((l: any) => l.stock > 0);
this.selectedLanguage = defaultLang?.code || this.product.languages[0]?.code || 'en';
const totalStock = (Object.values(this.product.stock || {}) as number[]).reduce((acc, val) => acc + val, 0);

this.product.isOutOfStock = totalStock === 0;


        this.bookLoading = false;
      },
      error: (err: any) => {
        this.bookError = err?.error?.message || 'Error fetching book details.';
        this.toastr.error(this.bookError || 'Error fetching book details.');
        this.bookLoading = false;
      },
    });
  }

  increment() {
    const maxStock = this.getStockForSelectedLang();
    if (this.quantity < maxStock) this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }

  selectLanguage(lang: any) {
    this.product.languages?.forEach((l: any) => (l.selected = false));
    lang.selected = true;
    this.selectedLanguage = lang.code;
  }

  getStockForSelectedLang(): number {
    return this.product.stock?.[this.selectedLanguage] || 0;
  }

  toggleSection(section: 'review' | 'description') {
    this.showSection = section;
    this.showReviewsSection = section === 'review';
    this.showDescription = section === 'description';
  }

  scrollToReview() {
    this.showSection = 'review';
    this.showReviewsSection = true;
    setTimeout(() => {
      this.reviewSection?.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 0);
  }

  addToCart() {
    const bookId = this.product._id;
    const quantity = this.quantity;
    const language = this.selectedLanguage;

    this.cartService.addToCart({ bookId, quantity, language }).subscribe({
      next: (res) => {
        this.toastr.success(res.message);
        console.log(res);
      },
      error: (err) => {
        this.toastr.error(err.error.message || 'Error adding to cart');
        console.error(err);
      },
    });
  }

buyNow() {
  this.bookLoading = true;
  const token = localStorage.getItem('authToken');
  if (!token) {
    this.toastr.error('You must be logged in to proceed with the purchase.');
    this.bookLoading = false;
    this.router.navigateByUrl('/login', { state: { returnUrl: this.router.url } });
    return;
  }

  if (!this.product || !this.selectedLanguage || !this.quantity) {
    this.toastr.warning('Please select a language and quantity');
    this.bookLoading = false;
    return;
  }

  const stock = this.getStockForSelectedLang();
  if (this.quantity > stock) {
    this.toastr.warning(`Only ${stock} items available in ${this.getLanguageName(this.selectedLanguage)}`);
    this.bookLoading = false;
    return;
  }

  const cartItems = [{
    productId: this.product._id,
    title: this.product.title,
    price: this.product.price,
    quantity: this.quantity,
    image: this.product.image || '',
    language: this.selectedLanguage
  }];

  const amount = this.product.price * this.quantity;

  console.log('📤 Sending to createCheckout:', { cartItems, amount });

  this.StripeService.createCheckout({
    cartItems,
    amount
  }).subscribe({
    next: (res) => {
      console.log('📥 createCheckout response:', res);
      this.bookLoading = false;
      // Store temporarily in localStorage
      localStorage.setItem('buyNowData', JSON.stringify({
        mode: 'buyNow',
        cartItems,
        clientSecret: res.clientSecret,
        orderId: res.orderId
      }));
      this.router.navigate(['/checkout'], {
        queryParams: { mode: 'buyNow', orderId: res.orderId }
      });
    },
    error: (err) => {
      this.bookLoading = false;
      console.error('❌ Buy Now error:', err);
      this.toastr.error(err.error?.message || 'Failed to initiate Buy Now checkout');
    }
  });
}}
