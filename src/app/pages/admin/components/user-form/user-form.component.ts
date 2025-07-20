import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { User } from '../../../../models/user.model';
import { ToastrService } from 'ngx-toastr'; // Add this import

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,RouterModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  userId: string | null = null;
  loading: boolean = false;
  error: string | null = null;
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService // Add this injection
  ) {}

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[\w\s'-]+$/)]],
      lastName: ['', [Validators.pattern(/^[\w\s'-]*$/)]],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.initForm();

    // Check for role parameter in query params
    this.route.queryParams.subscribe(params => {
      if (params['role'] === 'admin') {
        this.userForm.get('role')?.setValue('admin');
      }
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = params['id'];
        this.isEditMode = true;
        // Only call loadUserDetails if userId is not null
        if (this.userId) {
          this.loadUserDetails(this.userId);
        }
      } else {
        this.isEditMode = false;
        this.userForm.get('email')?.enable();
        // Add password field for new users with backend-matching validators
        this.userForm.addControl('password', this.fb.control('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,16}$/)
        ]));
      }
    });
  }

  loadUserDetails(id: string): void {
    this.loading = true;
    this.adminService.getUserById(id).subscribe({
      next: (response) => {
        const user = response.data;
        if (user) {
          this.userForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName || '',
            email: user.email,
            role: user.role
          });

          // Disable email field as it shouldn't be changed in edit mode
          this.userForm.get('email')?.disable();
        } else {
          this.error = 'User not found';
          setTimeout(() => {
            this.router.navigate(['/admin/users']);
          }, 2000);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user details';
        this.loading = false;
        console.error('Error loading user details:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.isEditMode) {
      // Update existing user
      const userData = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        role: this.userForm.value.role
      };

      this.adminService.updateUser(this.userId!, userData).subscribe({
        next: (response) => {
          // Replace alert with toastr
          this.toastr.success('User updated successfully');
          // Redirect based on role
          if (userData.role === 'admin') {
            this.router.navigate(['/admin/admins']);
          } else {
            this.router.navigate(['/admin/users']);
          }
        },
        error: (err) => {
          this.error = 'Failed to update user';
          this.loading = false;
          console.error('Error updating user:', err);
          // Add error toastr
          this.toastr.error(err.error?.message || 'Failed to update user');
        }
      });
    } else {
      // Create new user
      const userData = {
        firstName: this.userForm.value.firstName,
        lastName: this.userForm.value.lastName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        role: this.userForm.value.role
      };

      this.adminService.createUser(userData).subscribe({
        next: (response: any) => {
          // Replace alert with toastr
          this.toastr.success('User created successfully');
          // Redirect based on role
          if (userData.role === 'admin') {
            this.router.navigate(['/admin/admins']);
          } else {
            this.router.navigate(['/admin/users']);
          }
        },
        error: (err: any) => {
          this.error = 'Failed to create user';
          this.loading = false;
          console.error('Error creating user:', err);
          // Add error toastr
          this.toastr.error(err.error?.message || 'Failed to create user');
        }
      });
    }
  }
}
