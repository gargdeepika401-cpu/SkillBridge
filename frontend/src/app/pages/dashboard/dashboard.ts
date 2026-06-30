import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';
import { StudentDashboard } from './student/student-dashboard';
import { MentorDashboard } from './mentor/mentor-dashboard';
import { AdminDashboard } from './admin/admin-dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    StudentDashboard,
    MentorDashboard,
    AdminDashboard
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  protected readonly auth = inject(AuthService);
  readonly loading = signal(false);
  readonly sidebarOpen = signal(true);

  ngOnInit(): void {
    this.loading.set(true);
    this.auth.fetchMe().subscribe({
      next: () => this.loading.set(false),
      error: () => {
        this.loading.set(false);
        this.auth.logout();
      }
    });
  }

  logout(): void {
    this.auth.logout();
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }
}
