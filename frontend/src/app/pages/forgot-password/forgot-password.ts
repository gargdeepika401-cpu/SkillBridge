import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // Which step are we on? 1 = email, 2 = OTP, 3 = new password
  readonly currentStep = signal(1);

  // Data that carries across steps
  readonly email = signal('');
  readonly resetToken = signal('');

  // UI state
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly emailFocused = signal(false);
  readonly passwordFocused = signal(false);
  readonly confirmFocused = signal(false);
  readonly hidePassword = signal(true);
  readonly hideConfirm = signal(true);

  // Step 3: password fields
  newPassword = '';
  confirmPassword = '';

  // Step 2: OTP digits (6 individual boxes)
  readonly otpDigits = signal<string[]>(['', '', '', '', '', '']);

  // ── Step 1: Submit Email ──────────────────────────────────
  submitEmail(emailValue: string): void {
    if (!emailValue || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    this.email.set(emailValue);

    this.auth.forgotPassword({ email: emailValue }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.successMessage.set(res.message);
        this.currentStep.set(2);
        this.errorMessage.set(null);
        this.successMessage.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        const apiErrors = err.error?.errors as { msg: string }[] | undefined;
        this.errorMessage.set(
          apiErrors?.[0]?.msg || err.error?.message || 'Something went wrong. Try again.'
        );
      }
    });
  }

  // ── Step 2: Submit OTP ────────────────────────────────────
  submitOtp(): void {
    const otp = this.otpDigits().join('');
    if (otp.length !== 6 || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.verifyOtp({ email: this.email(), otp }).subscribe({
      next: (res) => {
        this.loading.set(false);
        this.resetToken.set(res.resetToken);
        this.currentStep.set(3);
        this.errorMessage.set(null);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid OTP. Please try again.');
      }
    });
  }

  // ── Step 3: Submit New Password ───────────────────────────
  submitNewPassword(): void {
    if (this.loading()) return;

    if (this.newPassword.length < 6) {
      this.errorMessage.set('Password must be at least 6 characters.');
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.resetPassword({
      email: this.email(),
      otp: this.resetToken(),
      newPassword: this.newPassword
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Password reset successfully! Redirecting to login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.message || 'Failed to reset password. Please try again.');
      }
    });
  }

  // ── Resend OTP ────────────────────────────────────────────
  resendOtp(): void {
    this.otpDigits.set(['', '', '', '', '', '']);
    this.errorMessage.set(null);
    this.submitEmail(this.email());
  }

  // ── OTP Input Handling ────────────────────────────────────
  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, ''); // digits only

    const digits = [...this.otpDigits()];
    digits[index] = value.slice(-1); // take only last digit
    this.otpDigits.set(digits);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = input.parentElement?.querySelector(
        `input:nth-child(${index + 2})`
      ) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    const input = event.target as HTMLInputElement;

    // Backspace: clear current and move to previous
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = input.parentElement?.querySelector(
        `input:nth-child(${index})`
      ) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || '';
    const digits = [...this.otpDigits()];
    for (let i = 0; i < 6; i++) {
      digits[i] = pasted[i] || '';
    }
    this.otpDigits.set(digits);
  }

  togglePassword(): void {
    this.hidePassword.update((v) => !v);
  }

  toggleConfirm(): void {
    this.hideConfirm.update((v) => !v);
  }
}
