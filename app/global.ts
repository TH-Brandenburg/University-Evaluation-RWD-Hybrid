import { Injectable } from '@angular/core';
import {NavController} from 'ionic-angular';
import {CommentViewPage} from './pages/comment-view/comment-view';
import {QuestionsPage} from './pages/questions/questions';
import {SendViewPage} from './pages/send-view/send-view';

export class Course {
    course: String;
    id: Number;
};

export class globalVar {

    static optionalerText: String = "";
    static base64Image: String = "";
    static answers = new Array();
    static selectedCourse: String = "";
}


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
  nav : NavController;
  generateNavigation(){
    var navArray = [];
    var completeQuestionLenght = 0;
    // Adding Questions with uniqui Number
    for (; completeQuestionLenght < this.TextQuestionsLenght; completeQuestionLenght++) {
      navArray.push(new NavigationItem("TextQuestion",completeQuestionLenght));
    }
    for (; completeQuestionLenght < this.TextmultipleChoiceAnswersLength; completeQuestionLenght++) {
        navArray.push(new NavigationItem("TextmultipleChoiceAnswers",completeQuestionLenght));
    }
    return navArray
//    this.navigationArray.push(new NavigationItem("Comments",0));
//    this.navigationArray.push(new NavigationItem("Send",0));
  }

}


export class Question {
  question: String;
  choices: Answer[];
};

export class Answer {
  choiceText: String;
  grade: Number;
};

@Injectable()
export class globalText {
  commmentView_editText: String = "Haben sie weitere Anmerkungen?";
  commmentView_sendText: String = "Absenden";
  commmentView_camera_addText: String = "aufnehmen";
  commmentView_camera_delText: String = "löschen";
  sendView_LabelText: String = "Abschicken";

  studyPaths: Course[] = new Array();

  questions: Question[] = new Array();

  q1: Question = new Question();
  q2: Question = new Question();
  q3: Question = new Question();
  a1: Answer = new Answer();
  a2: Answer = new Answer();
  a3: Answer = new Answer();
  a4: Answer = new Answer();
  a5: Answer = new Answer();

  c1: Course = new Course();
  c2: Course = new Course();
  c3: Course = new Course();
  c4: Course = new Course();

    constructor() {

    this.c1.course = "Master Informatik";
    this.c1.id = 0;

    this.c2.course = "Bachelor Informatik";
    this.c2.id = 1;

    this.c3.course = "Master BWL";
    this.c3.id = 2;

    this.c4.course = "Bachelor BWL";
    this.c4.id = 3;

    this.studyPaths.push(this.c1);
    this.studyPaths.push(this.c2);
    this.studyPaths.push(this.c3);
    this.studyPaths.push(this.c4);

    this.q1.choices = new Array();
    this.q1.question = "Frage 1. Was auch immer";
    this.q2.choices = new Array();
    this.q2.question = "Frage 2. Was auch immer";
    this.q3.choices = new Array();
    this.q3.question = "Frage 3. Was auch immer";

    this.a1.grade = 1;
    this.a1.choiceText = "Sehr gut";

    this.a2.grade = 2;
    this.a2.choiceText = "Gut";

    this.a3.grade = 3;
    this.a3.choiceText = "Mittel";

    this.a4.grade = 4;
    this.a4.choiceText = "Schlecht";


    this.q1.choices.push(this.a1);
    this.q1.choices.push(this.a2);
    this.q1.choices.push(this.a3);
    this.q1.choices.push(this.a4);

    this.q2.choices.push(this.a1);
    this.q2.choices.push(this.a2);
    this.q2.choices.push(this.a3);
    this.q2.choices.push(this.a4);

    this.q3.choices.push(this.a1);
    this.q3.choices.push(this.a2);
    this.q3.choices.push(this.a3);
    this.q3.choices.push(this.a4);

    this.questions.push(this.q1);
    this.questions.push(this.q2);
    this.questions.push(this.q3);

    for(var i = 0; i < this.questions.length; i++){
      globalVar.answers[i] = -1;
  }


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
  getQuestions() {
   return this.questions;
  }
  getStudyPaths() {
      return this.studyPaths;
  }
}
