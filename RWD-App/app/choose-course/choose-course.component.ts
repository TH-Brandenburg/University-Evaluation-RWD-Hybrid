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
  availableCourses: any = {"studyPath":{}};
  ngOnInit() {
  //get survey data on initialization
    let scannerData = JSON.parse(localStorage.getItem('scanner'));
    localStorage.removeItem('scanner');
    if(scannerData != null && scannerData != undefined){
      this.dataService.setAddress(scannerData.host);
      this.dataService.setVoteToken(scannerData.voteToken);
      // let questions = this.dataService.getQuestions();
      let questions = this.dataService.getQuestionTest();
      this.dataService.setQuestions(questions);
      if(questions == undefined) {
        this.dataService.startQuestionRequest().subscribe(
            data => {
              this.dataService.setQuestions(data);
              this.availableCourses = JSON.parse(this.dataService.getQuestions());
            },
            err => {this.dataService.logError(err); window.location.href = '/app/scanner/scanner.template.html';},
            () => console.log('Request questions completed')
        );
      }
    }
    let questions = this.dataService.getQuestions();
    if(questions != undefined){
      this.availableCourses = JSON.parse(questions);
    }
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
