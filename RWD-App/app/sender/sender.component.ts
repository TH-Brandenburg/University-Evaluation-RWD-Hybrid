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
    private inSending: boolean = false;
    ngOnInit() {
        this.currentSurvey = JSON.parse(this.dataService.getQuestions());
        this.currentSurvey = this.currentSurvey.multipleChoiceQuestionDTOs.length + this.currentSurvey.textQuestions.length;
        this.givenAnswers = this.dataService.getMultipleChoiceAnswersSize() + this.dataService.getTextAnswersSize();
    }
    constructor(private dataService: QuestionDataService, private router: Router) {
    }
    onSubmit() {
        var send:boolean=true;
        if (this.givenAnswers < this.currentSurvey) {
          if (confirm('Sie haben bisher nur ' + this.givenAnswers + ' von ' + this.currentSurvey + ' Fragen beantwortet. Sind sie sicher, dass sie die Evaluation abschließen wollen?')) {
            this.inSending = true;
              send = true;
          }
          else {
            console.log('Zu wenige Antworten gegeben');
              send = false;
            }
        }
        if(send) {
            console.log("send answers");
            this.inSending = true;
            console.log(this.dataService.getMultipleChoiceAnswers());
            console.log(this.dataService.getTextAnswers());

            var requestItem = this.dataService.sendAnswers();
            requestItem.onSuccess = (response, status, headers) => {
                console.log("Upload erfolgreich");
                alert("Upload erfolgreich");
                this.inSending = false;
                this.router.navigate(['/']);}
            requestItem.onError = (response, status, headers) => {
                this.inSending = false;
                alert("Upload fehlgeschlagen");
                console.log("Upload fehlgeschlagen");}
        }
    }
}
