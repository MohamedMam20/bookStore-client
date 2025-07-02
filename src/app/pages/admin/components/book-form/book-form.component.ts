import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { Book } from '../../../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html', // Changed from CSS to HTML
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode: boolean = false;
  bookId: string | null = null;
  loading: boolean = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  categories: string[] = [
    'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy',
    'Mystery', 'Thriller', 'Romance', 'Biography', 'History',
    'Self-Help', 'Business', 'Children', 'Poetry'
  ];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.bookId = params['id'];
        this.loadBookDetails(this.bookId);
      }
    });
  }

  initForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required]],
      author: [''],
      category: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],
      authorDescription: [''],
      stockEn: [0, [Validators.min(0)]],
      stockAr: [0, [Validators.min(0)]],
      stockFr: [0, [Validators.min(0)]]
    });
  }

  loadBookDetails(id: string | null): void {
    if (!id) return; // Early return if id is null

    this.loading = true;
    this.adminService.getAllBooks().subscribe({
      next: (books) => {
        const book = books.find((b: Book) => b._id === id);
        if (book) {
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            category: book.category,
            price: book.price,
            description: book.description,
            authorDescription: book.authorDescription,
            stockEn: book.stock?.en || 0,
            stockAr: book.stock?.ar || 0,
            stockFr: book.stock?.fr || 0
          });

          if (book.image) {
            this.imagePreview = book.image;
          }
        } else {
          alert('Book not found');
          this.router.navigate(['/admin/books']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading book details:', err);
        alert('Failed to load book details');
        this.loading = false;
        this.router.navigate(['/admin/books']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.bookForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = new FormData();

    // Add form values to FormData
    formData.append('title', this.bookForm.value.title);
    formData.append('author', this.bookForm.value.author || '');
    formData.append('category', this.bookForm.value.category || '');
    formData.append('price', this.bookForm.value.price.toString());
    formData.append('description', this.bookForm.value.description || '');
    formData.append('authorDescription', this.bookForm.value.authorDescription || '');
    formData.append('stockEn', this.bookForm.value.stockEn.toString());
    formData.append('stockAr', this.bookForm.value.stockAr.toString());
    formData.append('stockFr', this.bookForm.value.stockFr.toString());

    // Add image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode && this.bookId) {
      this.adminService.updateBook(this.bookId, formData).subscribe({
        next: (response) => {
          console.log('Book updated successfully:', response);
          alert('Book updated successfully');
          this.router.navigate(['/admin/books']);
        },
        error: (err) => {
          console.error('Error updating book:', err);
          alert('Failed to update book: ' + (err.error?.message || 'Unknown error'));
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.adminService.createBook(formData).subscribe({
        next: (response) => {
          console.log('Book created successfully:', response);
          alert('Book created successfully');
          this.router.navigate(['/admin/books']);
        },
        error: (err) => {
          console.error('Error creating book:', err);
          alert('Failed to create book: ' + (err.error?.message || 'Unknown error'));
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
}
