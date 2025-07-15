import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../../models/category.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isEditMode: boolean = false;
  categoryIdOrSlug: string | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  private baseUrl = 'http://localhost:3000/api/v1';

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', Validators.maxLength(500)]
    });
  }

  ngOnInit(): void {
    this.loading = true;
    
    this.route.paramMap.subscribe(params => {
      console.log('Route params:', params);
      const id = params.get('id');
      console.log('Category ID from route:', id);
      
      if (id && id !== 'new') {
        this.isEditMode = true;
        this.categoryIdOrSlug = id;
        
        console.log('Edit mode activated, fetching category with ID/slug:', id);
        
        // Direct HTTP request with proper error handling
        const token = localStorage.getItem('authToken');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        this.http.get(`${this.baseUrl}/categories/${id}`, { headers }).subscribe({
          next: (response: any) => {
            console.log('Category data received:', response);
            if (response && response.data) {
              this.populateForm(response.data);
            } else {
              console.error('Invalid response format:', response);
              this.toastr.error('Failed to load category data');
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error fetching category:', error);
            this.toastr.error('Error loading category data');
            this.router.navigate(['/admin/categories']);
            this.loading = false;
          }
        });
      } else {
        console.log('Create mode activated');
        this.isEditMode = false;
        this.loading = false;
      }
    });
  }

  get nameControl() {
    return this.categoryForm.get('name');
  }

  get descriptionControl() {
    return this.categoryForm.get('description');
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  populateForm(category: Category): void {
    console.log('Populating form with category:', category);
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || ''
    });
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.markFormGroupTouched(this.categoryForm);
      return;
    }

    const formData = this.categoryForm.value;
    console.log("🚀 Submitting category:", formData, "isEditMode:", this.isEditMode, "ID/Slug:", this.categoryIdOrSlug);

    this.submitting = true;

    const request = this.isEditMode && this.categoryIdOrSlug
      ? this.adminService.updateCategory(this.categoryIdOrSlug, formData)
      : this.adminService.createCategory(formData);

    request.subscribe({
      next: (response) => {
        this.submitting = false;
        this.toastr.success(
          this.isEditMode ? 'Category updated successfully' : 'Category created successfully'
        );
        this.router.navigate(['/admin/categories']);
      },
      error: (error) => {
        this.submitting = false;
        console.error("❌ Submission error:", error);
        this.toastr.error(error.error?.message || 'An error occurred. Please try again.');
      }
    });
  }
}
