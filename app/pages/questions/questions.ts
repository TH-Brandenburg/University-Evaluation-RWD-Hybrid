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

        alert(globalVar.choiceAnswers[this.counter]);
        if(globalVar.choiceAnswers[this.counter] != -1){
            document.getElementById("button_answer"+globalVar.choiceAnswers[this.counter]).className = "answer enabled";
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
        globalVar.choiceAnswers[this.currentQuestionID] = number;
    }

    goTo(type: String,counter:Number){
      if (type == "textQuestions"){
        this.nav.push(CommentViewPage, {
          pagecounter: counter
        });
      }
      if (type == "multipleChoiceQuestionDTOs"){
      this.nav.push(QuestionsPage, {
        pagecounter: counter
      });}
    }
}
