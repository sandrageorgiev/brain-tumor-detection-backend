import {Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule, Brain, Upload, FileText, Download,
  Stethoscope, User, Zap, CircleCheckBig, ArrowRight, Menu, X, LogOut, Settings, LayoutDashboard, ChevronDown
} from 'lucide-angular';
import {Router, RouterLink} from "@angular/router";
import {SessionStorageService} from "../service/session-storage.service";
import {window} from "rxjs";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit{
  @ViewChild('userMenuContainer', { read: ElementRef }) userMenuContainer!: ElementRef;
  session = inject(SessionStorageService);
  router = inject(Router)

  // Mobile menu toggle
  isMenuOpen = false;

  // Active feature for highlights
  activeFeature = 0;

  showDemoModal:boolean = false;

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
  public isLoggedIn: boolean = false;
  username = '';
  userRole = '';


  ngOnInit(): void {
    this.showDemoModal = false;
    this.checkAuthenticationStatus();
  }

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


  protected readonly LogOut = LogOut;
  protected readonly Settings = Settings;
  protected readonly LayoutDashboard = LayoutDashboard;
  protected readonly User = User;
  protected readonly ChevronDown = ChevronDown;

  hasRoleDoctor() {
    return 'DOCTOR' == this.session.getRole();
  }

  protected readonly window = window;
  // openDemo() {
  //   globalThis.window.open('https://youtu.be/kuQ1zFVsnIc', '_blank');
  // }


  openDemo() {
    this.showDemoModal = true;
  }

  closeDemo() {
    this.showDemoModal = false;
  }
}
