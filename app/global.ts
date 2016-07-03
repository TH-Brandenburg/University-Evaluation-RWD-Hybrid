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
