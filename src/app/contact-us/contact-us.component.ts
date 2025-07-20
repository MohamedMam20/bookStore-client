import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
  formData = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form submitted:', this.formData);
      alert('Message sent successfully!');
      form.resetForm(); 
    }
  }
}
