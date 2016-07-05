import { Component } from '@angular/core';
import { QuestionDataService } from './questions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'sender',
  template: `
            <h1>In Sending Process</h1>
            <button (click)="onSubmit()">Submit</button>
            `
})

export class SenderComponent {
  private currentSurvey: any;
  private givenAnswers: any;
  ngOnInit() {
    this.currentSurvey = JSON.parse(this.dataService.getQuestionTest());
    this.currentSurvey = this.currentSurvey.multipleChoiceQuestionDTOs;
    this.givenAnswers = this.dataService.multipleChoiceAnswers;
  }
  constructor(private dataService: QuestionDataService, private router: Router) {
  }
  onSubmit() {
    if (this.givenAnswers < this.currentSurvey.length) {
      console.log('Zu wenige Antworten gegeben');
    }
    else {
    console.log(this.dataService.textAnswers);
    //this.dataService.sendAnswers();
    this.router.navigate(['/']);
  }
  }
}
