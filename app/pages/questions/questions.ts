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
	pos: number;

    constructor(private GlobalText: globalText,private navParams: NavParams,private nav : NavController) {
        this.counter = navParams.get('pagecounter');
        this.QuestionDataService = QuestionDataService;
        this.currentQuestion = QuestionDataService.multipleChoiceQuestionDTOs[this.counter];
        console.log("Question",this.currentQuestion)
        this.currentQuestionID = this.counter;
		this.pos = QuestionDataService.calulateNavigationPos("multipleChoiceQuestionDTOs",this.counter);
    }

    GetClass(grade: number){

      var classes = "";
      if(grade == QuestionDataService.multipleChoiceAnswers[this.counter])
        classes = "answer enabled";
      else
        classes = "answer disabled";

      if(grade == 0){
          if(document.getElementById("button_answer0") != null)
            document.getElementById("button_answer0").style.height = ((this.currentQuestion.choices.length - 1) * 50 + (this.currentQuestion.choices.length - 2) * 10) + "px";
          return classes += " right";
      }
      else
        return classes += " normalAnswer";
    }

    DisableOtherAnswers(number){
       var nextButtonNumber = number;
       for(var i = 0; i < this.currentQuestion.choices.length - 1; i++){

           nextButtonNumber++;
           if(nextButtonNumber > this.currentQuestion.choices.length - 1)
               nextButtonNumber = nextButtonNumber - this.currentQuestion.choices.length;
           if(nextButtonNumber == 0)
               document.getElementById("button_answer"+nextButtonNumber).className = "answer disabled right";
           else
               document.getElementById("button_answer"+nextButtonNumber).className = "answer disabled normalAnswer";

       }
   }

   onClickAnswer(number){
       if(number == 0)
           document.getElementById("button_answer"+number).className = "answer enabled right";
       else
           document.getElementById("button_answer"+number).className = "answer enabled normalAnswer";
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
