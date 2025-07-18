import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../services/admin/admin.service';
import { User } from '../../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();

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
        // Enable email field for new users
        this.userForm.get('email')?.enable();
        // Add password field for new users
        this.userForm.addControl('password', this.fb.control('', [Validators.required, Validators.minLength(6)]));
      }
    });
  }

  initForm(): void {
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      role: ['user', [Validators.required]]
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
          alert('User updated successfully');
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          this.error = 'Failed to update user';
          this.loading = false;
          console.error('Error updating user:', err);
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
          alert('User created successfully');
          this.router.navigate(['/admin/users']);
        },
        error: (err: any) => {
          this.error = 'Failed to create user';
          this.loading = false;
          console.error('Error creating user:', err);
        }
      });
    }
  }
}
