import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'test-question-show',
    moduleId: module.id,
    templateUrl: 'text-question.template.html'
})

export class TextQuestionComponent implements OnInit {
    private fetchedQuestions: any;
    private sub: any;
    private id: any;
    private textFirst: any;
    private textAns: string;
    private photo: any;
    private givenTextAnswers: any[];
    private givenImages: any[];
    ngOnInit() {
        this.fetchedQuestions = JSON.parse(this.dataService.getQuestionTest());
        this.textFirst = this.fetchedQuestions.textQuestionsFirst;
        this.fetchedQuestions = this.fetchedQuestions.textQuestions;
        this.givenTextAnswers = this.dataService.getTextAnswers();
        this.sub = this.route.params.subscribe(params => {let id = +params['id'];
            this.id = id;
        });
        this.givenImages = this.dataService.getImages();
        this.textAns = '';
        this.photo = null;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    constructor(private dataService: QuestionDataService,
        private route: ActivatedRoute,
        private router: Router) {
    }
    onSubmit(value: string) {
        this.dataService.addTextAnswer(this.fetchedQuestions[this.id].questionID, this.fetchedQuestions[this.id].questionText, value);
        if (this.photo) {
            this.dataService.addImageAnswer(this.photo);
        };
        if ((this.id + 1) < this.dataService.getMultipleChoiceAnswersSize()) {
            this.router.navigate(['/text-question', this.id + 1]);
        } else {
            if (this.textFirst == true) {
                this.router.navigate(['/question', 0])
            }
            else {
                this.router.navigate(['/send'])
            }
        }
    }
}
