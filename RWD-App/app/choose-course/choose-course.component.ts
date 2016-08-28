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
  showView:boolean = false;
  availableCourses: any = {"studyPath":{}};
  ngOnInit() {
  //get survey data on initialization
    let scannerData = JSON.parse(localStorage.getItem('scanner'));
    localStorage.removeItem('scanner');
    if(scannerData != null && scannerData != undefined){
      this.dataService.setAddress(scannerData.host);
      this.dataService.setVoteToken(scannerData.voteToken);

      // rausnehmen
      //this.dataService.setQuestions(this.dataService.getQuestionTest());

      let questions = this.dataService.getQuestions();
      if(questions == "{}") {
        this.dataService.startQuestionRequest().subscribe(
            data => {
              this.dataService.setQuestions(data);
              this.availableCourses = JSON.parse(this.dataService.getQuestions());
              this.showView = true;
            },
            err => {this.dataService.logError(err);
              var message = "Error while reading QRCode";
              try{
                var body = JSON.parse(err._body);
                message = body.message;
              }catch(e){
              }
              alert(message);
              window.location.href = '/app/scanner/scanner.template.html';},
            () => console.log('Request questions completed')
        );
      }
    }
    let questions = this.dataService.getQuestions();
    if(questions != undefined && questions != "{}"){
      this.availableCourses = JSON.parse(questions);
      this.showView = true;
    }
  }

  constructor(private dataService: QuestionDataService,
  private router: Router){
  }

  checkIfChosen(classInput: string) {
    let chosenClass = this.dataService.getStudyPath();
    if (chosenClass == classInput) {
      return true;
    }
    else return false;
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
