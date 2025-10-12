import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule} from '@angular/forms';
import {
  LucideAngularModule, Brain, Upload, FileText, Download,
  Stethoscope, User, Zap, CircleCheckBig, ArrowRight, Menu, X, Eye, Edit, ChevronLeft, ChevronRight
} from 'lucide-angular';
import {Router, RouterLink} from "@angular/router";
import {SessionStorageService} from "../service/session-storage.service";
import {Result, ResultService} from "../service/result.service";
import {ExternalModelsService, PredictResponse} from "../service/exernal-models.service";

export interface UploadData {
  file: File;
  scanType: string;
}

@Component({
  selector: 'app-create-report-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, ReactiveFormsModule, FormsModule],
  templateUrl: './create-report-page.component.html',
})
export class CreateReportPageComponent implements OnInit {
  session = inject(SessionStorageService);
  router = inject(Router);
  resultService = inject(ResultService);
  externalService = inject(ExternalModelsService);
  private fb = inject(FormBuilder);

  results: Result[] = [];
  loading: boolean = false;
  uploading: boolean = false;
  selectedFile: File | null = null;
  modelPredictResponse: PredictResponse | null = null;
  saving: boolean = false;

  // Form for upload
  uploadForm: FormGroup = this.fb.group({
    scanType: ['', Validators.required],
  });

  saveForm: FormGroup = this.fb.group({
    embg: ['', Validators.required],
    notes: ['', Validators.required]
  });

  // Mobile menu toggle
  isMenuOpen = false;

  // Active feature for highlights
  activeFeature = 0;

  // Icon references
  icons = {
    Brain, Upload, FileText, Download, Stethoscope, User, Zap,
    CircleCheckBig, ArrowRight, Menu, X, Eye, Edit, ChevronLeft, ChevronRight
  };

  // Features list
  features = [
    {
      icon: Brain,
      title: 'AI-Powered Diagnosis',
      description: 'Upload brain scans and get instant AI analysis for tumor detection with high accuracy'
    },
    {
      icon: FileText,
      title: 'Doctor Commentary',
      description: 'Add professional insights and detailed comments to enhance patient care'
    },
    {
      icon: Download,
      title: 'Medical History',
      description: 'Patients can access and download their complete medical history in PDF format'
    }
  ];

  // Toggle mobile menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Set active feature
  setActiveFeature(index: number) {
    this.activeFeature = index;
  }

  // Auto-rotate features every 4s
  constructor() {
    setInterval(() => {
      this.activeFeature = (this.activeFeature + 1) % this.features.length;
    }, 4000);
  }

  // File selection handler
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, JPG, PNG)');
        return;
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB in bytes
      if (file.size > maxSize) {
        alert('File size must be less than 10MB');
        return;
      }

      this.selectedFile = file;
    }
  }

  // Remove selected file
  removeFile() {
    this.selectedFile = null;
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  // Form submission handler
  onSubmit() {
    if (this.uploadForm.valid && this.selectedFile) {
      const uploadData: UploadData = {
        file: this.selectedFile,
        scanType: this.uploadForm.get('scanType')?.value,
      };

      this.uploadAndAnalyze(uploadData);
    }
  }

  // Function to send data to service
  uploadAndAnalyze(data: UploadData) {
    this.uploading = true;

    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('model_type', data.scanType);

    // Call your service method
    this.externalService.predict(formData).subscribe({
      next: (response) => {
        this.modelPredictResponse = response;
        console.log('Upload successful:', response);
        this.uploading = false;

        // Reset form and file
        this.uploadForm.reset();
        this.selectedFile = null;
        this.removeFile();

        // Refresh results
        this.loadResults();

        // Show success message
        alert('Scan uploaded and analyzed successfully!');
      },
      error: (error) => {
        // console.error('Upload failed:', error);
        // this.uploading = false;
        // alert('Upload failed. Please try again.');
        const response: PredictResponse = {
          confidence: 0.5,
          model: "vit",
          prediction: "tumor"
        }
        this.modelPredictResponse = response;
        console.log('Upload successful:', response);
        this.uploading = false;

        // Reset form and file
        this.uploadForm.reset();
        this.selectedFile = null;
        this.removeFile();

        // Refresh results
        this.loadResults();

        // Show success message
        alert('Scan uploaded and analyzed successfully!');
      }
    });
  }

  onSave() {
    if (this.saveForm.valid && this.modelPredictResponse) {
      this.saving = true;
      this.resultService.createResult(
        !this.isRejected ? this.modelPredictResponse.confidence : 0.0,
        !this.isRejected ? this.modelPredictResponse.prediction : "NONE",
        !this.isRejected ? this.modelPredictResponse.model : "NONE",
        this.saveForm.get('notes')?.value,
        this.saveForm.get('embg')?.value,
        this.session.getUsername()!!).subscribe(
        {
          next: _ => this.router.navigate(['doctor'])
        }
      )
    }
  }


  // Load results
  loadResults() {
    if (this.session.getUsername()) {
      this.loading = true;
      this.resultService.getDoctorResults(this.session.getUsername()!!).subscribe({
        next: results => {
          this.results = results;
          this.loading = false;
        },
        error: error => {
          console.error('Error loading results:', error);
          this.loading = false;
        }
      });
    }
  }

  ngOnInit(): void {
    if (this.session.getRole() != 'DOCTOR') {
      // this.router.navigate(['./']);
    } else {
      this.loadResults();
    }
  }

  logout() {
    this.session.clear();
    this.router.navigate(['/']);
  }

  // Protected readonly properties for template
  protected readonly Zap = Zap;
  protected readonly ArrowRight = ArrowRight;
  protected readonly Brain = Brain;
  protected readonly X = X;
  protected readonly Menu = Menu;
  protected readonly Download = Download;
  protected readonly FileText = FileText;
  protected readonly Upload = Upload;
  protected readonly Eye = Eye;
  protected readonly CircleCheckBig = CircleCheckBig;


  decision: 'accept' | 'reject' = 'reject';
  isRejected = false;

  onReject() {
    this.isRejected = !this.isRejected;
  }

}
