import { Component, OnInit } from '@angular/core';
import {  FORM_DIRECTIVES,  REACTIVE_FORM_DIRECTIVES,  FormBuilder,  FormGroup  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
    selector: 'test-question-show',
    moduleId: module.id,
    templateUrl: 'text-question.template.html',
    directives: [FORM_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, NavigationComponent],
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
    public base64Image: File;
    private fileUploaded: boolean = false;
    private file: File;
    private thumbUrl: string;

    ngOnInit() {
        this.fetchedQuestions = JSON.parse(this.dataService.getQuestions());
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
            this.loadView();
        });
        this.givenImages = this.dataService.getImages();
        document.getElementById("fileInput").addEventListener("change",  e => {this.readImageFile(e);}, false);

        //empty answer and Image
        this.base64Image = undefined;
        this.file = undefined;
    }

    readImageFile(e) {
      console.log("Image wird gelesen");
      this.file = e.target.files[0];
      if (!this.file) {
        return;
      }
      var reader = new FileReader();
      reader.onload = file => {
        var contents: any = file.target;
        this.base64Image = contents.result;
      }
      reader.readAsBinaryString(this.file);

      var readerThumbnail = new FileReader();
      readerThumbnail.onloadend = file => {
        this.thumbUrl = readerThumbnail.result;
        console.log(this.thumbUrl);
      }
     readerThumbnail.readAsDataURL(this.file);
     //this.fileUploaded = true;
   }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    constructor(private dataService: QuestionDataService,
        private route: ActivatedRoute,
        private router: Router, private fb: FormBuilder) {
          this.answerForm = this.fb.group({
            'text': [this.answerText],
            'image': undefined,
          });
    }

    deleteImage() {
      this.base64Image = undefined;
      this.file = undefined;
      this.thumbUrl = undefined;
      this.answerText = document.getElementById('textInput')["value"];
      this.answerForm = this.fb.group({
        'text': [this.answerText],
        'image': undefined,
      });
    }

    onSubmit(value: string) {
        this.dataService.deleteTextAnswer(this.fetchedQuestions[this.id].questionID);
        if (value['text'] != '' && value['text'] != null && value['text'] != undefined){
        this.dataService.addTextAnswer(this.fetchedQuestions[this.id].questionID, this.fetchedQuestions[this.id].questionText, value['text']);
      }
        console.log('Image: ' + value['image']);
        console.log(this.dataService.getTextAnswersSize());
        this.dataService.deleteImage(this.id);
        if (this.file != undefined) {
          this.dataService.addImageAnswer(this.id, this.thumbUrl, this.file);
        };
        this.answerText = "";
        this.answerForm = this.fb.group({
            'text': [this.answerText],
            'image': undefined,
        });
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

    loadView(){
        let imageObject:any = this.dataService.getImageObject(this.id);
        this.base64Image = undefined;
        this.thumbUrl = undefined;
        if(imageObject != undefined){
            this.base64Image = imageObject.file;
            this.thumbUrl = imageObject.thumbUrl;
        }
        this.file = undefined;
        this.answerText = this.dataService.getTextAnswer(this.fetchedQuestions[this.id].questionID).answerText;
        this.answerForm = this.fb.group({
            'text': [this.answerText],
            'image': undefined,
        });
    }
}
