import { Injectable } from '@angular/core';
import {NavController} from 'ionic-angular';
import {CommentViewPage} from './pages/comment-view/comment-view';
import {QuestionsPage} from './pages/questions/questions';
import {SendViewPage} from './pages/send-view/send-view';

export class globalVar {

    static optionalerText: String = "";
    static base64Image: String = "";
    static answers = new Array();
}

export interface Question {
  question: String;
  choices: Answer[];
};

export interface Answer {
  choiceText: String;
  grade: Number;
};

export class NavigationItem {
  constructor(type : String,counter : Number){
    this.type = type;
    this.counter = counter;
  };
  type : String;
  counter : Number;
};

@Injectable()
export class globalShare {
  questionCounter: Number = 1;
  constructor() {
  }
}
@Injectable()
export class globalNavigation{
  TextQuestionsLenght : Number = 5;
  TextmultipleChoiceAnswersLength : Number = 2;
  navigationArray = new Array();
  completeQuestionLenght = 0;
  nav : NavController;
  generateNavigation(){
    // Adding Questions with uniqui Number
    for (; this.completeQuestionLenght < this.TextQuestionsLenght; this.completeQuestionLenght++) {
      this.navigationArray.push(new NavigationItem("TextQuestion",this.completeQuestionLenght));
    }
    for (; this.completeQuestionLenght < this.TextmultipleChoiceAnswersLength; this.completeQuestionLenght++) {
        this.navigationArray.push(new NavigationItem("TextmultipleChoiceAnswers",this.completeQuestionLenght));
    }
    this.navigationArray.push(new NavigationItem("Comments",0));
    this.navigationArray.push(new NavigationItem("Send",0));
  }
  goTo(type: String){
//    var site: any;
//    if (type=="TextQuestion" || type=="TextmultipleChoiceAnswers"){
//      site=QuestionsPage;
//    }
//    else if (type=="Comments"){
//      site=CommentViewPage;
//    }
//    else if (type=="Send"){
//      site=SendViewPage;
//    }
    return SendViewPage
  }
}

@Injectable()
export class globalText {
  commmentView_editText: String = "Haben sie weitere Anmerkungen?";
  commmentView_sendText: String = "Absenden";
  commmentView_camera_addText: String = "aufnehmen";
  commmentView_camera_delText: String = "löschen";
  sendView_LabelText: String = "Abschicken";

constructor() {
  }
  getcommmentView_editText(){
    return this.commmentView_editText;
  }
  getcommmentView_sendText(){
    return this.commmentView_sendText;
  }
  getcommmentView_camera_addText(){
    return this.commmentView_camera_addText;
  }
  getcommmentView_camera_delText(){
    return this.commmentView_camera_delText;
  }
  getsendView_LabelText(){
    return this.sendView_LabelText;
  }
}
