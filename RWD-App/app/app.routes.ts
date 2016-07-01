import { provideRouter, RouterConfig } from '@angular/router';
import { QuestionComponent } from'./question-showcase.component';
import { ScannerComponent } from'./scanner.component';
import { SenderComponent } from'./sender.component';
import { AppComponent } from'./app.component';
import { ChooseCourseComponent } from './choose-course.component';

const routes: RouterConfig = [
    { path: '', component: AppComponent },
    { path: 'scan', component: ScannerComponent },
    { path: 'course', component: ChooseCourseComponent },
    { path: 'question', component: QuestionComponent },
    { path: 'send', component: SenderComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
