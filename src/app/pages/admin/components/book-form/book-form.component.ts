import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { Book } from '../../../../models/book.model';
import { Category } from '../../../../models/category.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm!: FormGroup;
  isEditMode: boolean = false;
  bookId: string | null = null;
  loading: boolean = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;
  categories: Category[] = [];

  // Add new properties for category modal
  showCategoryModal: boolean = false;
  categoryForm!: FormGroup; // Add the ! operator to fix the error
  submittingCategory: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initCategoryForm(); // Initialize the category form
    this.loadCategories();

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
      author: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required]],
      authorDescription: ['', [Validators.required]],
      stockEn: [0, [Validators.required, Validators.min(0)]],
      stockAr: [0, [Validators.required, Validators.min(0)]],
      stockFr: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Initialize category form - moved into a method
  initCategoryForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  loadCategories(): void {
    this.adminService.getAllCategories(1, 100).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.categories = response.data;
        } else {
          console.error('Unexpected category response format:', response);
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.toastr.error('Failed to load categories');
      }
    });
  }

  loadBookDetails(id: string | null): void {
    if (!id) return;

    this.loading = true;
    this.adminService.getBookById(id).subscribe({
      next: (response: any) => {
        if (response && response.data) {
          const book = response.data;
          
          // Handle category - if it's an object with _id property, extract the ID
          let categoryId = '';
          if (book.category) {
            if (typeof book.category === 'string') {
              categoryId = book.category;
            } else if (typeof book.category === 'object' && book.category._id) {
              categoryId = book.category._id;
            }
          }
          
          this.bookForm.patchValue({
            title: book.title,
            author: book.author,
            category: categoryId, // Use the extracted category ID
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
          this.toastr.error('Book not found');
          this.router.navigate(['/admin/books']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading book details:', err);
        this.toastr.error('Failed to load book details');
        this.loading = false;
        this.router.navigate(['/admin/books']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    // Mark all form controls as touched to trigger validation messages
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });

    if (this.bookForm.invalid) {
      this.toastr.error('Please fill in all required fields correctly');
      return;
    }

    // Validate price is greater than 0
    const price = this.bookForm.get('price')?.value;
    if (!price || price <= 0) {
      this.toastr.error('Price must be greater than 0');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    const selectedCategoryId = this.bookForm.value.category || '';
    
    // Find the selected category object to get its name
    const selectedCategory = this.categories.find(cat => cat._id === selectedCategoryId);
    console.log('Selected category:', selectedCategory); // Debug log

    formData.append('title', this.bookForm.value.title);
    formData.append('author', this.bookForm.value.author || '');
    
    // Send category as a nested object with both ID and name
    if (selectedCategory) {
      // Try different approaches to ensure the data is properly received by the server
      // Approach 1: Send as JSON string
      const categoryData = JSON.stringify({
        _id: selectedCategory._id || '',
        name: selectedCategory.name || ''
      });
      formData.append('category', categoryData);
      
      // Approach 2: Send as individual fields
      formData.append('category[_id]', selectedCategory._id || '');
      formData.append('category[name]', selectedCategory.name || '');
      
      // Approach 3: Send as flat fields with different names
      formData.append('categoryId', selectedCategory._id || '');
      formData.append('categoryName', selectedCategory.name || '');
      
      console.log('Category being sent:', selectedCategory._id, selectedCategory.name); // Debug log
    }
    
    formData.append('price', this.bookForm.value.price.toString());
    formData.append('description', this.bookForm.value.description || '');
    formData.append('authorDescription', this.bookForm.value.authorDescription || '');
    formData.append('stockEn', this.bookForm.value.stockEn.toString());
    formData.append('stockAr', this.bookForm.value.stockAr.toString());
    formData.append('stockFr', this.bookForm.value.stockFr.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    if (this.isEditMode && this.bookId) {
      this.adminService.updateBook(this.bookId, formData).subscribe({
        next: (response) => {
          this.toastr.success('Book updated successfully');
          this.router.navigate(['/admin/books']);
        },
        error: (err) => {
          console.error('Error updating book:', err);
          this.toastr.error('Failed to update book: ' + (err.error?.message || 'Unknown error'));
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.adminService.createBook(formData).subscribe({
        next: (response) => {
          this.toastr.success('Book created successfully');
          this.router.navigate(['/admin/books']);
        },
        error: (err) => {
          console.error('Error creating book:', err);
          this.toastr.error('Failed to create book: ' + (err.error?.message || 'Unknown error'));
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  // Open category modal
  openCategoryModal(): void {
    this.showCategoryModal = true;
    this.categoryForm.reset();
  }

  // Close category modal
  closeCategoryModal(): void {
    this.showCategoryModal = false;
  }

  // Submit new category
  submitCategory(): void {
    // Mark all form controls as touched to trigger validation messages
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      if (control) control.markAsTouched();
    });

    if (this.categoryForm.invalid) {
      this.toastr.error('Please fill in all category fields correctly');
      return;
    }

    // Additional validation checks
    const name = this.categoryForm.get('name')?.value;
    const description = this.categoryForm.get('description')?.value;

    if (!name || name.trim().length < 2) {
      this.toastr.error('Category name must be at least 2 characters');
      return;
    }

    if (!description || description.trim().length < 10) {
      this.toastr.error('Category description must be at least 10 characters');
      return;
    }

    this.submittingCategory = true;
    const categoryData = this.categoryForm.value;

    this.adminService.createCategory(categoryData).subscribe({
      next: (response) => {
        this.toastr.success('Category created successfully');
        this.submittingCategory = false;
        this.closeCategoryModal();

        // Add the new category to the categories list and select it
        if (response && response.data) {
          const newCategory = response.data;
          this.categories.push(newCategory);
          this.bookForm.patchValue({
            category: newCategory._id
          });
        }

        // Refresh categories list
        this.loadCategories();
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Failed to create category');
        this.submittingCategory = false;
        console.error('Error creating category:', err);
      }
    });
  }
}
