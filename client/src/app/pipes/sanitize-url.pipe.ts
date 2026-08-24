import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// this is a method to make the cd visible imported from the @Angular/platform-browser
// i am using this pipe to display the resume in the profile page
// it is a pipe that is used to make the cd visible
// it is a pipe that is used to make the cd visible



@Pipe({
  name: 'sanitizeUrl',
  standalone: true,
})
export class SanitizeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
