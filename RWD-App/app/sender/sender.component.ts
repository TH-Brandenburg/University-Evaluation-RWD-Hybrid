import { Component } from '@angular/core';
import { QuestionDataService } from '../questions.service';
import { Router } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
    selector: 'sender',
    moduleId: module.id,
    templateUrl: 'sender.template.html',
    directives: [NavigationComponent],
})

export class SenderComponent {
    private currentSurvey: any;
    private givenAnswers: any;
    ngOnInit() {
        this.currentSurvey = JSON.parse(this.dataService.getQuestionTest());
        this.currentSurvey = this.currentSurvey.multipleChoiceQuestionDTOs.length + this.currentSurvey.textQuestions.length;
        this.givenAnswers = this.dataService.getMultipleChoiceAnswersSize() + this.dataService.getTextAnswersSize();
    }
    constructor(private dataService: QuestionDataService, private router: Router) {
    }
    onSubmit() {
        if (this.givenAnswers < this.currentSurvey) {
          if (confirm('Sie haben bisher nur ' + this.givenAnswers + ' von ' + this.currentSurvey + ' Fragen beantwortet. Sind sie sicher, dass sie die Evaluation abschließen wollen?')) {
            console.log("send finished answers");
            console.log(this.dataService.getMultipleChoiceAnswers());
            console.log(this.dataService.getTextAnswers());
              var requestItem = this.dataService.sendAnswers();
              requestItem.onSuccess = this.onSuccess;
              requestItem.onError = this.onError;
          }
          else {
            console.log('Zu wenige Antworten gegeben');
            }
        }
        else {
            console.log("send all answers");
            console.log(this.dataService.getMultipleChoiceAnswers());
            console.log(this.dataService.getTextAnswers());

            var requestItem = this.dataService.sendAnswers();
            requestItem.callback = (data) => {};
            requestItem.onSuccess = this.onSuccess;
            requestItem.onError = this.onError;
        }
    }
    onSuccess = function(response, status, headers){
        alert("Upload erfolgreich");
    }

    onError = function(response, status, headers){
        alert("Upload fehlgeschlagen");
    }
}
