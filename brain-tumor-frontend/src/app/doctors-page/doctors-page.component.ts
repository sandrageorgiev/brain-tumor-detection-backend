import {Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule, Brain, Upload, FileText, Download,
  Stethoscope, User, Zap, CircleCheckBig, ArrowRight, Menu, X,
  Eye, Edit, ChevronLeft, ChevronRight, Settings, LayoutDashboard, ChevronDown, LogOut, Search
} from 'lucide-angular';

import {RouterLink, Router} from "@angular/router";
import {SessionStorageService} from "../service/session-storage.service";
import {Result, ResultService} from "../service/result.service";
import {PdfGeneratorComponent} from "../service/pdf.component";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, PdfGeneratorComponent, FormsModule],
  templateUrl: './doctors-page.component.html',
})
export class DoctorsPageComponent implements OnInit{
  @ViewChild('userMenuContainer', { read: ElementRef }) userMenuContainer!: ElementRef;
  session = inject(SessionStorageService);
  router = inject(Router);
  resultService = inject(ResultService)

  results: Result[] = []
  filteredResults: Result[] = []
  searchTerm: string = ''

  loading: boolean = false

  // Mobile menu toggle
  isMenuOpen = false;

  // Active feature for highlights
  activeFeature = 0;

  // Icon references
  // icons = { Brain, Upload, FileText, Download, Stethoscope, User, Zap, CircleCheckBig, ArrowRight, Menu, X };
  icons = {
    Brain, Upload, FileText, Download, Stethoscope, User, Zap,
    CircleCheckBig, ArrowRight, Menu, X, Eye, Edit, ChevronLeft, ChevronRight, Search
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

  // Search functionality
  onSearchChange(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredResults = [...this.results];
    } else {
      this.filteredResults = this.results.filter(result =>
        result.patient.embg?.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
        result.patient.name.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
        result.patient.surname.toLowerCase().includes(this.searchTerm.toLowerCase().trim()) ||
        result.patient.email.toLowerCase().includes(this.searchTerm.toLowerCase().trim())
      );
    }
  }

  // Clear search
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredResults = [...this.results];
  }

  protected readonly Zap = Zap;
  protected readonly ArrowRight = ArrowRight;
  protected readonly Brain = Brain;
  protected readonly X = X;
  protected readonly Menu = Menu;

  ngOnInit(): void {
    this.checkAuthenticationStatus();
    if (this.session.getRole() != 'DOCTOR'){
      this.router.navigate(['./']);
    }else if (this.session.getUsername() != null){
      this.loading = true;
      this.resultService.getDoctorResults(this.session.getUsername()!!).subscribe({
        next: results => {
          this.results = results
          this.filteredResults = [...results]
          this.loading = false
        }
      })
    }
  }


  public isLoggedIn: boolean = false;
  username = '';
  userRole = '';

  private checkAuthenticationStatus() {
    const storedUsername = this.session.getUsername();
    const storedRole = this.session.getRole();

    if (storedUsername && storedRole) {
      this.isLoggedIn = true;
      this.username = storedUsername;
      this.userRole = storedRole;
    } else {
      this.isLoggedIn = false;
      this.username = '';
      this.userRole = '';
    }
  }


  // Get user initials for avatar
  getUserInitials(): string {
    if (!this.username) return 'U';

    const names = this.username.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }

    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  refreshAuthStatus(): void {
    this.checkAuthenticationStatus();
  }


  logout(): void {
    try {
      // Clear session storage
      this.session.clear();

      // Update component state
      this.isLoggedIn = false;
      this.username = '';
      this.userRole = '';
      // this.isUserMenuOpen = false;

      // Navigate to home page
      this.router.navigate(['/']);

      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  isUserMenuOpen = false;

  // Toggle user dropdown menu
  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Close user menu if clicking outside
    if (this.isUserMenuOpen && this.userMenuContainer &&
      !this.userMenuContainer.nativeElement.contains(target)) {
      this.isUserMenuOpen = false;
    }
  }

  protected readonly Download = Download;
  protected readonly FileText = FileText;
  protected readonly Settings = Settings;
  protected readonly LayoutDashboard = LayoutDashboard;
  protected readonly ChevronDown = ChevronDown;
  protected readonly LogOut = LogOut;
  protected readonly User = User;
  protected readonly Search = Search;
}
