import { provideRouter, RouterConfig } from '@angular/router';
import { QuestionComponent } from'./multiple-choice-question/question-showcase.component';
import { TextQuestionComponent } from'./text-question/text-question-showcase.component';
import { ScannerComponent } from'./scanner/scanner.component';
import { SenderComponent } from'./sender/sender.component';
import { AppComponent } from'./app.component';
import { ChooseCourseComponent } from './choose-course/choose-course.component';

const routes: RouterConfig = [
    { path: 'scan', component: ScannerComponent },
    { path: '', component: AppComponent },
    { path: 'course', component: ChooseCourseComponent },
    { path: 'question/:id', component: QuestionComponent },
    { path: 'text-question/:id', component: TextQuestionComponent },
    { path: 'send', component: SenderComponent }
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
