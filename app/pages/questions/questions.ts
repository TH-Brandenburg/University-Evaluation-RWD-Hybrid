import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {globalVar, globalText, Question} from '../../global'

@Page({
    templateUrl: 'build/pages/questions/questions.html'
})



export class QuestionsPage{

    allQuestions: Question[];
    currentQuestion: Question;

    constructor(private nav: NavController, private GlobalText: globalText) {
        this.allQuestions = this.GlobalText.getQuestions();     
        this.currentQuestion = this.allQuestions[0];
    }


    LoadQuestion(number) {
        this.currentQuestion = this.allQuestions[number];
    }
    
    Answered(number) {
        document.getElementById("answer_div_"+number).className = "answer enabled";
        this.DisableOtherAnswers(number);
    }

    DisableOtherAnswers(number){
        var nextButtonNumber = number;
        for(var i = 0; i < 5; i++){
            nextButtonNumber++;
            if(nextButtonNumber > 6)
                nextButtonNumber = nextButtonNumber - 6;

            document.getElementById("answer_div_"+nextButtonNumber).className = "answer disabled";

        }

    }
}