import { Component, OnInit } from '@angular/core';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
    selector: 'question-show',
    moduleId: module.id,
    templateUrl: 'question-showcase.template.html',
    directives: [NavigationComponent],
})

export class QuestionComponent implements OnInit {
    private currentQuestion: any;
    private sub: any;
    private id: any;
    private textFirst: boolean;
    private givenMCAnswers: any[];
    private chosenChoice: any[];
    ngOnInit() {
        this.currentQuestion = JSON.parse(this.dataService.getQuestionTest());
        this.textFirst = this.currentQuestion.textQuestionsFirst;
        this.currentQuestion = this.currentQuestion.multipleChoiceQuestionDTOs;
        this.sub = this.route.params.subscribe(params => {let id = +params['id'];
            this.id = id;
        });
        this.givenMCAnswers = this.dataService.getMultipleChoiceAnswers();

    }
    //needed to erase observer after leaving question area
    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    checkIfAnswered(grade: number) {
      console.log('begin Element Focus');
      this.givenMCAnswers = this.dataService.getMultipleChoiceAnswers();
      for (var givenAnswer of this.givenMCAnswers) {
        if (givenAnswer.questionText === this.currentQuestion[this.id].question) {
          if (givenAnswer.choice['grade'] == grade){
            return true;
          }
        }
    }
    return false;
  }

    constructor(private dataService: QuestionDataService,
        private route: ActivatedRoute,
        private router: Router) {
    }
    onClickAnswer(answer: any) {
        this.dataService.addMultipleChoiceAnswer(this.currentQuestion[this.id].question, answer.choiceText, answer.grade);
        console.log(this.currentQuestion.length);
        if (this.id + 1 >= this.currentQuestion.length) {
            if (this.textFirst == true) {
                this.router.navigate(['/send'])
            }
            else {
                this.router.navigate(['/text-question', 0])
            }
        }
        else this.router.navigate(['/question', this.id + 1]);
    }
}
