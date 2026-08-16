import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-base-layout',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="flex flex-col min-h-screen font-sans text-gray-900 bg-gray-50/30">
      <app-header></app-header>
      <div class="flex-grow">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `
})
export class BaseLayoutComponent {}
