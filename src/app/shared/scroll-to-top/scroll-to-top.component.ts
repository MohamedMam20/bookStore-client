import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [],
  templateUrl: './scroll-to-top.component.html',
  styleUrl: './scroll-to-top.component.css'
})
export class ScrollToTopComponent {
  isShown = false;
@HostListener('window:scroll' ,[])
onWindowScroll(){
  this.isShown = window.scrollY >= 300;
}
scrollToTop(){
  window.scrollTo({
    top:0,
    behavior:'smooth'
  });
}
}
