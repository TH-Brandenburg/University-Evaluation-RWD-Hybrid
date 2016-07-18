import {Page, Platform, Alert, NavController,NavParams} from 'ionic-angular';
import {globalText, Question,QuestionDataService} from '../../global'
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {CoursesPage} from '../choose-course/choose-course';

@Page({
    templateUrl: 'build/pages/questions/questions.html',
    providers : [globalText]
})



export class QuestionsPage{

    allQuestions: Question[];
    currentQuestion: Question;
    currentQuestionID: number;

    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    QuestionDataService: any;


    type : String;
    counter : number;

    constructor(private GlobalText: globalText,private navParams: NavParams,private nav : NavController) {
        this.counter = navParams.get('pagecounter');
        this.QuestionDataService = QuestionDataService;
        this.currentQuestion = QuestionDataService.multipleChoiceQuestionDTOs[this.counter];
        console.log("Question",this.currentQuestion)
        this.currentQuestionID = this.counter;

       if(QuestionDataService.multipleChoiceAnswers[this.counter] != -1){
           document.getElementById("button_answer"+this.counter).className = "answer enabled";
       }
    }

    DisableOtherAnswers(number){
       var nextButtonNumber = number;
       for(var i = 0; i < this.currentQuestion.choices.length - 1; i++){

           nextButtonNumber++;
           if(nextButtonNumber > this.currentQuestion.choices.length - 1)
               nextButtonNumber = nextButtonNumber - this.currentQuestion.choices.length;

           document.getElementById("button_answer"+nextButtonNumber).className = "answer disabled";

       }
   }

   onClickAnswer(number){

       document.getElementById("button_answer"+number).className = "answer enabled";
       this.DisableOtherAnswers(number);
       QuestionDataService.multipleChoiceAnswers[this.currentQuestionID] = number;
}

    goTo(type: String,counter:Number){
      if (type == "textQuestions"){
        this.nav.setPages([{
              page: CommentViewPage,
              params: {pagecounter: counter}
            }]);
      }
      if (type == "multipleChoiceQuestionDTOs"){
        this.nav.setPages([{
              page: QuestionsPage,
              params: {pagecounter: counter}
            }]);
      ;}
      if (type == "sendPage"){  this.nav.setPages([{
              page: SendViewPage,
              params: {pagecounter: counter}
            }]);
      ;}
      if (type == "choosePage"){  this.nav.setPages([{
              page: CoursesPage,
              params: {pagecounter: counter}
            }]);
      ;}
    }
}
