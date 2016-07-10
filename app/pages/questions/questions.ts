import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {globalVar, globalText, Question} from '../../global'

@Page({
    templateUrl: 'build/pages/questions/questions.html',
    providers : [globalText]
})



export class QuestionsPage{

    allQuestions: Question[];
    currentQuestion: Question;
    currentQuestionID: number;

    constructor(private GlobalText: globalText) {
//        this.allQuestions = this.GlobalText.getQuestions();
        this.currentQuestion = this.allQuestions[0];
        this.currentQuestionID = 0;


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
}
