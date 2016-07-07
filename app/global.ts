import { Injectable } from '@angular/core';


export class globalVar {

    static optionalerText: String = "";
    static base64Image: String = "";
}
@Injectable()
export class globalShare {
  questionCounter: Number = 1;
  constructor() {
  }
}



export interface Question {
  question: String;
  choices: Answer[];
};

export interface Answer {
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

  questions: Question[];

  q1: Question;
  q2: Question;
  q3: Question;
  a1: Answer;
  a2: Answer;
  a3: Answer;
  a4: Answer;
  a5: Answer;



constructor() {

  this.q1.question = "Frage 1. Was auch immer"
  this.q2.question = "Frage 2. Was auch immer"
  this.q2.question = "Frage 3. Was auch immer"

  this.a1.choiceText = "Sehr Gut";
  this.a1.grade = 1;
  this.q1.choices.push(this.a1);
  this.q2.choices.push(this.a1);
  this.q3.choices.push(this.a1);

  this.a2.choiceText = "Gut";
  this.a2.grade = 2;
  this.q1.choices.push(this.a2);
  this.q2.choices.push(this.a2);
  this.q3.choices.push(this.a2);

  this.a3.choiceText = "Mittel";
  this.a3.grade = 3;
  this.q1.choices.push(this.a3);
  this.q2.choices.push(this.a3);
  this.q3.choices.push(this.a3);

  this.a4.choiceText = "Schlecht";
  this.a4.grade = 4;
  this.q1.choices.push(this.a4);
  this.q2.choices.push(this.a4);
  this.q3.choices.push(this.a4);

  this.a5.choiceText = "Sehr Schlecht";
  this.a5.grade = 5;
  this.q1.choices.push(this.a5);
  this.q2.choices.push(this.a5);
  this.q3.choices.push(this.a5);

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
}
