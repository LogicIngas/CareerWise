import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1 class="text-2xl font-bold text-stone-900 mb-2">Welcome back</h1>
    <p class="text-stone-500 mb-8">Log in to continue your job search.</p>

    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-2">Email</label>
        <input type="email" formControlName="email" placeholder="you&#64;company.com"
          class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
        <p *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-xs text-red-600 mt-1.5">
          Enter a valid email address.
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-2">Password</label>
        <input type="password" formControlName="password" placeholder="********"
          class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
        <p *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-xs text-red-600 mt-1.5">
          Password is required.
        </p>
      </div>

      <p *ngIf="errorMessage()" class="text-sm text-red-600">{{ errorMessage() }}</p>

      <button type="submit" [disabled]="isSubmitting()" class="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-400 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
        <span *ngIf="isSubmitting()" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        Log in
      </button>
    </form>

    <p class="text-sm text-stone-500 mt-8 text-center">
      Don't have an account?
      <a routerLink="/signup" class="font-semibold text-brand-600 hover:text-brand-700 transition-colors">Sign up</a>
    </p>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      this.auth.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigateByUrl(returnUrl ?? '/dashboard');
        },
        error: (err: Error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.message);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
