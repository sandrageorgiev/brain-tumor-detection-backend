import {Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule, Brain, Upload, FileText, Download,
  Stethoscope, User, Zap, CircleCheckBig, ArrowRight, Menu, X, Settings, LayoutDashboard, ChevronDown, LogOut
} from 'lucide-angular';
import {RouterLink, Router} from "@angular/router";
import {SessionStorageService} from "../service/session-storage.service";
import {PdfGeneratorComponent} from "../service/pdf.component";
import {Result, ResultService} from "../service/result.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink, PdfGeneratorComponent, FormsModule],
  templateUrl: './patients-page.component.html',
})
export class PatientsPageComponent implements OnInit{
  @ViewChild('userMenuContainer', { read: ElementRef }) userMenuContainer!: ElementRef;
  session = inject(SessionStorageService);
  router = inject(Router);
  resultService = inject(ResultService)

  results: Result[] = []

  loading: boolean = false

  // Mobile menu toggle
  isMenuOpen = false;

  // Active feature for highlights
  activeFeature = 0;

  // Icon references
  icons = { Brain, Upload, FileText, Download, Stethoscope, User, Zap, CircleCheckBig, ArrowRight, Menu, X };

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

  protected readonly Zap = Zap;
  protected readonly ArrowRight = ArrowRight;
  protected readonly Brain = Brain;
  protected readonly X = X;
  protected readonly Menu = Menu;
  protected filteredResults: Result[] = [];

  ngOnInit(): void {
    this.checkAuthenticationStatus();
    if (this.session.getRole() != 'PATIENT'){
      this.router.navigate(['./']);
    }else if (this.session.getUsername() != null){
      this.loading = true;
      this.resultService.getPatientResults(this.session.getUsername()!!).subscribe({
        next: results => {
          this.results = results
          this.filteredResults = results
          this.extractUniqueDoctors();
          this.loading = false
        }
      })
    }
  }

  protected readonly FileText = FileText;

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



  protected readonly Settings = Settings;
  protected readonly LayoutDashboard = LayoutDashboard;
  protected readonly ChevronDown = ChevronDown;
  protected readonly LogOut = LogOut;
  protected readonly User = User;

  searchQuery: string = '';
  selectedDoctor: string = '';
  uniqueDoctors: string[] = [];
  sort = { column: '', direction: 'asc' as 'asc' | 'desc' };

  private extractUniqueDoctors(): void {
    const doctorSet = new Set<string>();
    this.results.forEach(result => {
      const doctorFullName = `${result.doctor.name} ${result.doctor.surname}`;
      doctorSet.add(doctorFullName);
    });
    this.uniqueDoctors = Array.from(doctorSet).sort();
  }

  applyFilters() {
    const query = this.searchQuery.toLowerCase();
    const doctorFilter = this.selectedDoctor.toLowerCase();

    this.filteredResults = this.results.filter(r => {
      const matchesSearch = query === '' ||
        r.classification.toLowerCase().includes(query) ||
        r.notes?.toLowerCase().includes(query) ||
        r.doctor.name.toLowerCase().includes(query) ||
        r.doctor.surname.toLowerCase().includes(query);

      const doctorFullName = `${r.doctor.name} ${r.doctor.surname}`.toLowerCase();
      const matchesDoctor = doctorFilter === '' || doctorFullName === doctorFilter;

      return matchesSearch && matchesDoctor;
    });

    if (this.sort.column) this.sortColumn(this.sort.column as keyof Result, true);
  }

  public sortColumn(column: keyof Result | 'doctorName', preserveDirection = false) {
    if (!preserveDirection) {
      this.sort.direction = this.sort.column === column && this.sort.direction === 'asc' ? 'desc' : 'asc';
    }
    this.sort.column = column;

    this.filteredResults.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (column === 'doctorName') {
        valA = `${a.doctor.name} ${a.doctor.surname}`.toLowerCase();
        valB = `${b.doctor.name} ${b.doctor.surname}`.toLowerCase();
      } else {
        valA = a[column as keyof Result];
        valB = b[column as keyof Result];

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
      }

      if (valA < valB) return this.sort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return this.sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
}
