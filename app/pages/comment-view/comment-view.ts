import {Page,NavController,ViewController,NavParams,Alert} from 'ionic-angular';
import { Camera } from 'ionic-native';
import {globalText,QuestionDataService} from "../../global";
import {QuestionsPage} from '../questions/questions';
import {SendViewPage} from '../send-view/send-view';
import {CoursesPage} from '../choose-course/choose-course';
import {isUndefined} from "ionic-angular/util";

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
	pos: number;

    QuestionDataService: any;

    constructor(private nav: NavController, private GlobalText: globalText,private navParams: NavParams,private viewCtrl: ViewController) {
        this.counter = navParams.get('pagecounter') -1;
        this.commmentView_editText = QuestionDataService.textQuestions[this.counter].questionText;
        this.commmentView_sendText = this.GlobalText.getsendView_LabelText();
        this.commmentView_camera_addText = this.GlobalText.getcommmentView_camera_addText();
        this.commmentView_camera_delText = this.GlobalText.getcommmentView_camera_delText();
        this.base64Image = QuestionDataService.answerFiles[this.counter];
        this.nav = nav;
        this.deleteButtonState = true;
        this.QuestionDataService = QuestionDataService;
		this.pos = QuestionDataService.calulateNavigationPos("textQuestions",this.counter);
    }

   //  ionViewLoaded() {
   //   if (typeof QuestionDataService.textAnswers[this.counter] != 'undefined' ){
   //      document.getElementsByClassName('text-input').item(0).setAttribute("placeholder",QuestionDataService.textAnswers[this.counter]);
   //    }
   //
   // }


    takepic() {
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            QuestionDataService.answerFiles.push("data:image/jpeg;base64," + imageData,this.commmentView_editText);
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
     QuestionDataService.textAnswers[this.counter] = document.getElementsByTagName('textarea').item(0).value;
    }

    fillTextarea() {
        return QuestionDataService.textAnswers[this.counter];
    }
  }
