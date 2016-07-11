import {Page, Platform, Alert, NavController,NavParams} from 'ionic-angular';
import {globalVar, globalText, Question,globalNavigation} from '../../global'
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {QuestionDataService} from "../../QuestionDataService";

@Page({
    templateUrl: 'build/pages/questions/questions.html',
    providers : [globalText,globalNavigation, QuestionDataService]
})



export class QuestionsPage{

    allQuestions: Question[];
    currentQuestion: Question;
    currentQuestionID: number;

    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;


    type : String;
    counter : Number;
    navList = [];

    constructor(private GlobalText: globalText,
                private navParams: NavParams,
                private nav : NavController,
                private globNav :globalNavigation,
                private qService: QuestionDataService) {
        
        this.allQuestions = this.GlobalText.getQuestions();
        this.currentQuestion = this.allQuestions[0];
        this.currentQuestionID = 0;
        this.type = navParams.get('type');
        this.counter = navParams.get('counter');
        this.navList = globNav.generateNavigation();

//    constructor(private GlobalText: globalText) {
//        this.allQuestions = this.GlobalText.getQuestions();
//        this.currentQuestion = this.allQuestions[0];
//        this.currentQuestionID = 0;

    }

    LoadQuestion(number) {
        this.currentQuestion = this.allQuestions[number];
        this.currentQuestionID = number;

        for(var i = 1; i < this.currentQuestion.choices.length + 1; i++){

            document.getElementById("button_answer"+i).className = "answer disabled";
        }

        if(globalVar.answers[this.currentQuestionID] != -1){
            document.getElementById("button_answer"+globalVar.answers[this.currentQuestionID]).className = "answer enabled";
        }
    }



    DisableOtherAnswers(number){
        var nextButtonNumber = number;
        for(var i = 0; i < this.currentQuestion.choices.length - 1; i++){
            nextButtonNumber++;
            if(nextButtonNumber > this.currentQuestion.choices.length)
                nextButtonNumber = nextButtonNumber - this.currentQuestion.choices.length;

            document.getElementById("button_answer"+nextButtonNumber).className = "answer disabled";

        }
    }

    onClickAnswer(number){
        document.getElementById("button_answer"+number).className = "answer enabled";
        this.DisableOtherAnswers(number);
        globalVar.answers[this.currentQuestionID] = number;
    }

    goTo(type: String, counter:Number){
      this.nav.push(QuestionsPage, {
        questiontype: type, pagecounter: counter
      });
    }
}
