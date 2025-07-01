import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  constructor(private http: HttpClient) {}
  selectedFile: File | null = null;

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  upload() {
    const formData = new FormData();
    formData.append('image', this.selectedFile!);

    this.http
      .post<{ url: string }>('http://localhost:3000/api/cloud/upload', formData)
      .subscribe({
        next: (res) => {
          console.log('Image uploaded to:', res.url);
        },
        error: (err) => {
          console.error('Upload failed', err);
        },
      });
  }
}
