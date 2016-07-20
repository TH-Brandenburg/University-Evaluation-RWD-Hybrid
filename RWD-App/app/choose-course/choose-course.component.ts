import { Component, OnInit } from '@angular/core';
import { QuestionDataService } from '../questions.service';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'choose-course',
  moduleId: module.id,
  templateUrl: 'choose-course.template.html',
  directives: [NavigationComponent],
})

export class ChooseCourseComponent implements OnInit {
  availableCourses: any;
  ngOnInit() {
  //get survey data on initialization
  this.availableCourses = JSON.parse(this.dataService.getQuestionTest());
    let scannerData = JSON.parse(localStorage.getItem('scanner'));
    localStorage.removeItem('scanner');
    this.dataService.setAddress(scannerData.host);
    this.dataService.setVoteToken(scannerData.voteToken);
  }
  constructor(private dataService: QuestionDataService,
  private router: Router){
  }
  onClick(value: any) {
    this.dataService.setStudyPath(value);
    if (this.availableCourses.textQuestionsFirst == true) {
      this.router.navigate(['/text-question', 0]);
    }
    else {
    this.router.navigate(['/question', 0]);
    }
  }
}
