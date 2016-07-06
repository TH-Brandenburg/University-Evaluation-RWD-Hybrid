import { Component, OnInit } from '@angular/core';
import { QuestionDataService } from '../questions.service';
import { Router } from '@angular/router';

@Component({
  selector: 'choose-course',
  moduleId: module.id,
  templateUrl: 'choose-course.template.html',
  providers: [QuestionDataService]
})

export class ChooseCourseComponent implements OnInit {
  availableCourses: any;
  ngOnInit() {
  //get survey data on initialization
  this.availableCourses = JSON.parse(this.dataService.getQuestionTest());
  }
  constructor(private dataService: QuestionDataService,
  private router: Router){
  }
  onClick(value: any) {
    this.dataService.studyPath = value;
    if (this.availableCourses.textQuestionsFirst == true) {
      this.router.navigate(['/text-question', 0]);
    }
    else {
    this.router.navigate(['/question', 0]);
    }
  }
}
