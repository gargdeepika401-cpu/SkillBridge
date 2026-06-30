import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../core/models/auth.models';

@Component({
  selector: 'app-mentor-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './mentor-dashboard.html',
  styleUrl: './mentor-dashboard.scss'
})
export class MentorDashboard {
  @Input({ required: true }) user!: User;
}
