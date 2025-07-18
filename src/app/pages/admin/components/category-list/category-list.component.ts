import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Category } from '../../../../models/category.model';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchTerm: string = '';
  loading: boolean = true;
  error: string | null = null;

  // Pagination properties
  currentPage: number = 1;
  totalPages: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.adminService.getAllCategories(this.currentPage, this.itemsPerPage).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.categories = response.data;
          this.filteredCategories = [...this.categories];

          // Set pagination data if available
          if (response.page) this.currentPage = response.page;
          if (response.totalPages) this.totalPages = response.totalPages;
          if (response.totalItems) this.totalItems = response.totalItems;
        } else {
          console.error('Unexpected response format:', response);
          this.error = 'Unexpected data format from server';
          this.categories = [];
          this.filteredCategories = [];
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load categories. Please try again.';
        this.loading = false;
        console.error('Error loading categories:', err);
      }
    });
  }

  onSearch(): void {
    this.filterCategories();
  }

  filterCategories(): void {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = [...this.categories];
      return;
    }

    const searchTerm = this.searchTerm.toLowerCase().trim();
    this.filteredCategories = this.categories.filter(category => {
      return (
        category.name.toLowerCase().includes(searchTerm) ||
        (category.description && category.description.toLowerCase().includes(searchTerm))
      );
    });
  }

  deleteCategory(idOrSlug: string): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.adminService.deleteCategory(idOrSlug).subscribe({
        next: () => {
          // Find the category in the original array to get its ID
          const categoryToRemove = this.categories.find(cat => cat._id === idOrSlug || cat.slug === idOrSlug);
          if (categoryToRemove && categoryToRemove._id) {
            this.categories = this.categories.filter(category => category._id !== categoryToRemove._id);
            this.filterCategories();
            this.toastr.success('Category deleted successfully');
          }
        },
        error: (err) => {
          console.error('Error deleting category:', err);
          this.toastr.error(err.error?.message || 'Failed to delete category. Please try again.');
        }
      });
    }
  }

  changePage(pageNumber: number): void {
    if (pageNumber < 1 || pageNumber > this.totalPages || pageNumber === this.currentPage) {
      return;
    }
    this.currentPage = pageNumber;
    this.loadCategories();
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}
