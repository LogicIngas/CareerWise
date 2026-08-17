import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, UserRole } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <h1 class="text-2xl font-bold text-stone-900 mb-2">Create your account</h1>
    <p class="text-stone-500 mb-8">{{ role() === 'employer' ? 'Set up your company profile and start hiring.' : 'Start applying to roles built for you.' }}</p>

    <div class="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-xl mb-6">
      <button type="button" (click)="setRole('candidate')"
        [class.bg-white]="role() === 'candidate'" [class.shadow-sm]="role() === 'candidate'" [class.text-stone-900]="role() === 'candidate'"
        class="py-2 rounded-lg text-sm font-semibold text-stone-500 transition-all">
        I'm looking for a job
      </button>
      <button type="button" (click)="setRole('employer')"
        [class.bg-white]="role() === 'employer'" [class.shadow-sm]="role() === 'employer'" [class.text-stone-900]="role() === 'employer'"
        class="py-2 rounded-lg text-sm font-semibold text-stone-500 transition-all">
        I'm hiring
      </button>
    </div>

    <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="space-y-5">
      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-2">Full name</label>
        <input type="text" formControlName="name" placeholder="Jordan Alvarez"
          class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
        <p *ngIf="signupForm.get('name')?.touched && signupForm.get('name')?.invalid" class="text-xs text-red-600 mt-1.5">
          Enter your full name.
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-2">{{ role() === 'employer' ? 'Work email' : 'Email' }}</label>
        <input type="email" formControlName="email" placeholder="you&#64;company.com"
          class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
        <p *ngIf="signupForm.get('email')?.touched && signupForm.get('email')?.invalid" class="text-xs text-red-600 mt-1.5">
          Enter a valid email address.
        </p>
      </div>

      <div>
        <label class="block text-sm font-semibold text-stone-700 mb-2">Password</label>
        <input type="password" formControlName="password" placeholder="********"
          class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
        <p *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.hasError('minlength')" class="text-xs text-red-600 mt-1.5">
          Password must be at least 8 characters.
        </p>
        <p *ngIf="signupForm.get('password')?.touched && signupForm.get('password')?.hasError('required')" class="text-xs text-red-600 mt-1.5">
          Password is required.
        </p>
      </div>

      <!-- Candidate-specific -->
      <ng-container *ngIf="role() === 'candidate'">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-stone-700 mb-2">Location</label>
            <input type="text" formControlName="location" placeholder="City, State"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
          </div>
          <div>
            <label class="block text-sm font-semibold text-stone-700 mb-2">Current title</label>
            <input type="text" formControlName="currentTitle" placeholder="Frontend Engineer"
              class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
          </div>
        </div>
        <p class="text-xs text-stone-400 -mt-3">Optional — helps us match you with relevant roles. You can add this later from your profile.</p>
      </ng-container>

      <!-- Employer-specific -->
      <ng-container *ngIf="role() === 'employer'">
        <div>
          <label class="block text-sm font-semibold text-stone-700 mb-2">Company name</label>
          <input type="text" formControlName="companyName" placeholder="Nimbus Labs"
            class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
          <p *ngIf="signupForm.get('companyName')?.touched && signupForm.get('companyName')?.invalid" class="text-xs text-red-600 mt-1.5">
            Company name is required.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-stone-700 mb-2">Company size</label>
            <div class="relative">
              <select formControlName="companySize" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm appearance-none bg-white">
                <option value="">Select size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1,000 employees</option>
                <option value="1000+">1,000+ employees</option>
              </select>
              <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-stone-700 mb-2">Industry</label>
            <div class="relative">
              <select formControlName="industry" class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm appearance-none bg-white">
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance &amp; Banking</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Retail">Retail &amp; E-commerce</option>
                <option value="Education">Education</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
              <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-stone-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-stone-700 mb-2">Your role at the company</label>
          <input type="text" formControlName="companyRole" placeholder="Head of Talent"
            class="w-full px-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-stone-900 text-sm placeholder-stone-400">
        </div>
      </ng-container>

      <label class="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" formControlName="agreeToTerms" class="w-4 h-4 mt-0.5 rounded border-stone-300 accent-[var(--color-brand-600)] cursor-pointer">
        <span class="text-sm text-stone-500">I agree to the Terms of Service and Privacy Policy.</span>
      </label>
      <p *ngIf="signupForm.get('agreeToTerms')?.touched && signupForm.get('agreeToTerms')?.invalid" class="text-xs text-red-600 -mt-3">
        You must agree to continue.
      </p>

      <p *ngIf="errorMessage()" class="text-sm text-red-600">{{ errorMessage() }}</p>

      <button type="submit" [disabled]="isSubmitting()" class="w-full bg-brand-600 hover:bg-brand-700 active:scale-[0.98] disabled:bg-brand-400 text-white font-bold py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
        <span *ngIf="isSubmitting()" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        Create account
      </button>
    </form>

    <p class="text-sm text-stone-500 mt-8 text-center">
      Already have an account?
      <a routerLink="/login" class="font-semibold text-brand-600 hover:text-brand-700 transition-colors">Log in</a>
    </p>
  `
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = inject(AuthService);

  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  role = signal<UserRole>('candidate');

  signupForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    location: [''],
    currentTitle: [''],
    companyName: [''],
    companySize: [''],
    industry: [''],
    companyRole: [''],
    agreeToTerms: [false, Validators.requiredTrue]
  });

  setRole(role: UserRole) {
    this.role.set(role);

    const companyNameControl = this.signupForm.get('companyName');
    if (role === 'employer') {
      companyNameControl?.setValidators(Validators.required);
    } else {
      companyNameControl?.clearValidators();
    }
    companyNameControl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.isSubmitting.set(true);
      this.errorMessage.set(null);
      const v = this.signupForm.value;
      this.auth.signup({
        name: v.name!,
        email: v.email!,
        password: v.password!,
        role: this.role(),
        location: v.location || undefined,
        currentTitle: v.currentTitle || undefined,
        companyName: v.companyName || undefined,
        companySize: v.companySize || undefined,
        industry: v.industry || undefined,
        companyRole: v.companyRole || undefined
      }).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate([this.role() === 'employer' ? '/employer-home' : '/dashboard']);
        },
        error: (err: Error) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.message);
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }
}
