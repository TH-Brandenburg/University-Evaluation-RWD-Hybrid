import {Page,NavController,NavParams,Alert} from 'ionic-angular';
import { Camera,File } from 'ionic-native';
import { Component } from '@angular/core';
import {globalVar,globalText,globalNavigation,QuestionDataService} from "../../global";
import {QuestionsPage} from '../questions/questions';
import {SendViewPage} from '../send-view/send-view';
//import {QuestionDataService} from '../../QuestionDataService';

@Page({
    templateUrl: 'build/pages/comment-view/comment-view.html',
    providers : [globalText,globalNavigation]
})

export class CommentViewPage {
    public base64Image: String;
    public inputText :String;
    public deleteButtonState: boolean;

    private commmentView_editText: String;
    private commmentView_sendText: String;
    private commmentView_camera_addText: String;
    private commmentView_camera_delText: String;
    sendViewPage = SendViewPage;
    commentViewPage = CommentViewPage;
    counter : number;

    QuestionDataService: any;

    constructor(private nav: NavController, private GlobalText: globalText,private globNav :globalNavigation,private navParams: NavParams) {
        this.counter = navParams.get('pagecounter');
        console.log(this.counter);
        this.commmentView_editText = QuestionDataService.textQuestions[this.counter-1].questionText;
        this.commmentView_sendText = this.GlobalText.getsendView_LabelText();
        this.commmentView_camera_addText = this.GlobalText.getcommmentView_camera_addText();
        this.commmentView_camera_delText = this.GlobalText.getcommmentView_camera_delText();
        this.nav = nav;
        this.inputText = '';
        this.deleteButtonState = true;
        this.QuestionDataService = QuestionDataService;
    }

    takepic() {
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
//            this.base64Image = "data:image/jpeg;base64," + imageData;
//            QuestionDataService.answerFiles.push(this.convertImage("data:image/jpeg;base64," + imageData,this.commmentView_editText));
//            globalVar.base64Image = this.base64Image;
            this.deleteButtonState = false;
        }, (err) => {
            console.log(err);
        });
    }
    deletepic() {
        globalVar.base64Image = "";
        this.deleteButtonState = true;
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
    saveText(text) {
      globalVar.textAnswers.push(text);
    }
    convertImage(base64str,fileName){
      var binary = atob(base64str.replace(/\s/g, ''));
      var len = binary.length;
      var buffer = new ArrayBuffer(len);
      var view = new Uint8Array(buffer);
      for (var i = 0; i < len; i++) {
       view[i] = binary.charCodeAt(i);
      }
      var blob = new Blob( [view], { type: "application/pdf" });
      var file = this.blobToFile(blob,fileName);
      return file
      }

    blobToFile(blob: Blob, fileName:string): File {
    var b: any = blob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>blob;
}
    }
