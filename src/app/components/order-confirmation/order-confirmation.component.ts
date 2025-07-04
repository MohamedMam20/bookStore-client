import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit {
  @ViewChild('invoice') invoiceElement!: ElementRef;

  customerName = '';
  customerEmail = '';
  orderId = '';
  orderDate = new Date();
  cartItems: any[] = [];
  totalAmount = 0;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const orderId = localStorage.getItem('orderId');

    this.customerName = user?.name || 'coustomer';
    this.customerEmail = user?.email || ' not available';
    this.orderId = orderId || 'not available';
    this.cartItems = cart;

    this.totalAmount = this.cartItems.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  }

  downloadInvoiceAsPDF() {
    const invoice = this.invoiceElement.nativeElement;

    html2canvas(invoice).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice ${this.orderId}.pdf`);
    });
  }
}
