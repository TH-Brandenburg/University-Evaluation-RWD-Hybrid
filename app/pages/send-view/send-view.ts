import { Page,NavController,Alert } from 'ionic-angular';
import {QuestionDataService, RequestResponse} from "../../global";
import {CommentViewPage} from '../comment-view/comment-view';
import {QuestionsPage} from '../questions/questions';
import {CoursesPage} from '../choose-course/choose-course';
import {Platform} from 'ionic-angular';

/*
  Generated class for the SendViewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/send-view/send-view.html',
})
export class SendViewPage {
    commentViewPage = CommentViewPage;
    QuestionDataService: any;
	pos: number;
  platform: any;



  constructor(private nav: NavController,platform: Platform) {
    this.QuestionDataService = QuestionDataService;
	  this.pos = QuestionDataService.calulateNavigationPos("send-view",-1);
    this.platform = platform;
    }
    sendResult(){
        QuestionDataService.sendAnswersFailedCallback = (errData: RequestResponse) => {
            let alert = Alert.create({
                title: "Error!", //String(errData.type),
                subTitle: errData.message,
                buttons: [{
                    text: 'RETRY',
                    handler: () => {
                        this.sendResult();
                    }
                }, {
                    text: 'EXIT',
                    handler: () => {
                        this.platform.exitApp();
                    }
                }]
            });
            this.nav.present(alert);
        };
        QuestionDataService.sendAnswersSucceedCallback = (successMsg: RequestResponse) => {
            let alert = Alert.create({
                title: "Success!",
                subTitle: successMsg.message,
                buttons: [{
                    text: 'EXIT',
                    handler: () => {
                        this.platform.exitApp();
                    }
                }]
            });
            this.nav.present(alert);
        };
        QuestionDataService.sendAnswers();
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
  }
