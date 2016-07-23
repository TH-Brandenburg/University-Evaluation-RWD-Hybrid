import { Page,NavController } from 'ionic-angular';
import {globalText,QuestionDataService} from "../../global";
import {CommentViewPage} from '../comment-view/comment-view';
import {QuestionsPage} from '../questions/questions';
import {CoursesPage} from '../choose-course/choose-course';

/*
  Generated class for the SendViewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/send-view/send-view.html',
  providers : [globalText]
})
export class SendViewPage {
    private sendView_LabelText: String;
    commentViewPage = CommentViewPage;
    QuestionDataService: any;
	pos: number;
  constructor(private nav: NavController, private GlobalText: globalText) {
    this.sendView_LabelText = this.GlobalText.getsendView_LabelText();
      this.QuestionDataService = QuestionDataService;
	  this.pos = QuestionDataService.calulateNavigationPos("send-view",-1);
    }
    sendResult(){
      QuestionDataService.sendAnswers()
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
