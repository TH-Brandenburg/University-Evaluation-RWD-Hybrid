import {Page, Platform, Alert, NavController,NavParams} from 'ionic-angular';
import {globalVar, globalText, Question,globalNavigation,QuestionDataService} from '../../global'
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';

@Page({
    templateUrl: 'build/pages/questions/questions.html',
    providers : [globalText,globalNavigation]
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

    constructor(private GlobalText: globalText,private navParams: NavParams,private nav : NavController,private globNav :globalNavigation) {

        this.counter = navParams.get('pagecounter');
        this.QuestionDataService = QuestionDataService;
        this.currentQuestion = this.QuestionDataService.multipleChoiceQuestionDTOs[this.counter];
        this.currentQuestionID = this.counter;

    }


    GetClass(grade: number){
      if(grade == globalVar.choiceAnswers[this.counter])
        return "answer enabled";

      return "answer disabled";
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
        globalVar.choiceAnswers[this.currentQuestionID] = number;
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
     }
}
