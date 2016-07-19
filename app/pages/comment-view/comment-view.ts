import {Page,NavController,ViewController,NavParams,Alert} from 'ionic-angular';
import { Camera } from 'ionic-native';
import {globalText,QuestionDataService} from "../../global";
import {QuestionsPage} from '../questions/questions';
import {SendViewPage} from '../send-view/send-view';
import {CoursesPage} from '../choose-course/choose-course';

//import {QuestionDataService} from '../../QuestionDataService';

@Page({
    templateUrl: 'build/pages/comment-view/comment-view.html',
    providers : [globalText]
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

    constructor(private nav: NavController, private GlobalText: globalText,private navParams: NavParams,private viewCtrl: ViewController) {
        this.counter = navParams.get('pagecounter');
        this.commmentView_editText = QuestionDataService.textQuestions[this.counter-1].questionText;
        this.commmentView_sendText = this.GlobalText.getsendView_LabelText();
        this.commmentView_camera_addText = this.GlobalText.getcommmentView_camera_addText();
        this.commmentView_camera_delText = this.GlobalText.getcommmentView_camera_delText();
        this.nav = nav;
        this.deleteButtonState = true;
        this.QuestionDataService = QuestionDataService;
    }

    ionViewLoaded() {
    document.getElementsByClassName('text-input').item(0).setAttribute("placeholder",QuestionDataService.textAnswers[this.counter]);
    }

    takepic() {
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            QuestionDataService.answerFiles.push(this.convertImage("data:image/jpeg;base64," + imageData,this.commmentView_editText));
            this.deleteButtonState = false;
        }, (err) => {
            console.log(err);
        });
    }
    deletepic() {
        this.deleteButtonState = true;
    }
    goTo(type: String,counter:Number){
      if (type == "textQuestions"){
        this.nav.setPages([{
              page: CommentViewPage,
              params: {pagecounter: counter}
            }]);
      }
      if (type == "multipleChoiceQuestionDTOs"){
        this.nav.setPages([{
              page: QuestionsPage,
              params: {pagecounter: counter}
            }]);
      ;}
      if (type == "sendPage"){  this.nav.setPages([{
              page: SendViewPage,
              params: {pagecounter: counter}
            }]);
      ;}
      if (type == "choosePage"){  this.nav.setPages([{
              page: CoursesPage,
              params: {pagecounter: counter}
            }]);
      ;}
    }
    saveText(text) {
//      let test = document.getElementsByClassName('text-input').item(0).setAttribute("placeholder","peter");
      QuestionDataService.textAnswers[this.counter] = text;
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
    var f: File;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>blob;
    }
  }
