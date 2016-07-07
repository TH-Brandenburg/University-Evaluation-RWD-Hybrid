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

  questions: Question[] = new Array();

  q1: Question = new Question();
  q2: Question = new Question();
  q3: Question = new Question();
  a1: Answer = new Answer();
  a2: Answer = new Answer();
  a3: Answer = new Answer();
  a4: Answer = new Answer();
  a5: Answer = new Answer();




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
  getQuestions() {
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


    return this.questions;
  }
}
