import { Component, OnInit } from '@angular/core';
import {  FORM_DIRECTIVES,  REACTIVE_FORM_DIRECTIVES,  FormBuilder,  FormGroup  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';

@Component({
    selector: 'test-question-show',
    moduleId: module.id,
    templateUrl: 'text-question.template.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
})

export class TextQuestionComponent implements OnInit {
    private fetchedQuestions: any;
    private sub: any;
    private id: any;
    private textFirst: any;
    private givenTextAnswers: any[];
    private givenImages: File[];
    private answerText: string = '';
    private answerImage: File;
    private answerForm: FormGroup;
    private alreadyAnswered: boolean = false;
    public base64Image: String;
    private fileUploaded: boolean = false;
    ngOnInit() {
        this.fetchedQuestions = JSON.parse(this.dataService.getQuestionTest());
        this.textFirst = this.fetchedQuestions.textQuestionsFirst;
        this.fetchedQuestions = this.fetchedQuestions.textQuestions;
        this.givenTextAnswers = this.dataService.getTextAnswers();
        for (var givenAnswer of this.givenTextAnswers) {
          if (givenAnswer['questionID'] == this.fetchedQuestions[this.id].questionID) {
            this.answerText = givenAnswer.answerText;
          }
        }
        this.sub = this.route.params.subscribe(params => {let id = +params['id'];
            this.id = id;
        });
        this.givenImages = this.dataService.getImages();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    constructor(private dataService: QuestionDataService,
        private route: ActivatedRoute,
        private router: Router, fb: FormBuilder) {
          this.answerForm = fb.group({
            'text': [this.answerText],
            'image': undefined,
          });
    }

    onSubmit(value: string) {
        if (value['text'] != ''){
        this.dataService.addTextAnswer(this.fetchedQuestions[this.id].questionID, this.fetchedQuestions[this.id].questionText, value['text']);
      }
        console.log('Image: ' + value['image']);
        console.log(this.dataService.getTextAnswersSize());
        if (value['image']) {
          //Read Image
          let fileReader = new FileReader();
          let fileDest = value['image'];
          fileReader.readAsText(fileDest);
          this.fileUploaded = true;
          //this.dataService.addImageAnswer(value['image']);
          console.log(value['image']);
        };
        if ((this.id + 1) < this.fetchedQuestions.length) {
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
