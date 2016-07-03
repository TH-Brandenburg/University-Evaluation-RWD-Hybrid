import { Component, OnInit } from '@angular/core';
import { QuestionDataService } from './questions.service';

@Component({
  selector: 'choose-course',
  template: `
              <div class="btn-group">
                <button *ngFor="let class of availableCourses.studyPaths">{{ class }}</button>
              </div>
            `
})

export class ChooseCourseComponent implements OnInit {
  availableCourses: any;
  ngOnInit() {
  //get survey data on initialization
  this.availableCourses = JSON.parse(this.dataService.getQuestionTest());
  }
  constructor(private dataService: QuestionDataService){
  }
}
