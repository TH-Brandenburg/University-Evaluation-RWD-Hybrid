import { Component } from '@angular/core';

@Component({
  selector: 'navigation',
  template: `
              <ul>
                <li><a [routerLink]="['/scan']">Scanner</a></li>
                <li><a [routerLink]="['/question']">Example Question</a></li>
                <li><a [routerLink]="['/send']">Send</a></li>
              </ul>
            `
})

export class NavigationComponent {
  constuctor() {

  }
}
