import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { QuestionDataService } from './questions.service';

@Component({
  selector: 'navigation',
  template: `
                <ul>
                  <li><a [routerLink]="['/scan']" routerLinkActive="active">Scanner</a></li>
                  <li><a [routerLink]="['/course']" routerLinkActive="active">Choose Course</a></li>
                  <li><a [routerLink]="['/question']" routerLinkActive="active">Example Question</a></li>
                  <li><a [routerLink]="['/send']" routerLinkActive="active">Send</a></li>
                </ul>
            <router-outlet></router-outlet>
            `,
directives: [ROUTER_DIRECTIVES],
  providers: [QuestionDataService]
})
export class AppComponent {
}
