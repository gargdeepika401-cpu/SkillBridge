import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/auth.models';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.scss'
})
export class StudentDashboard {
  @Input({ required: true }) user!: User;
}
