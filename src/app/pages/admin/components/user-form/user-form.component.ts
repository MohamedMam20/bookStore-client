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
        // Only call loadUserDetails if userId is not null
        if (this.userId) {
          this.loadUserDetails(this.userId);
        }
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

          // Disable email field as it shouldn't be changed
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
  }
}
