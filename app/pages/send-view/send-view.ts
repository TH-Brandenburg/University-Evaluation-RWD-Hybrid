import { Page,NavController } from 'ionic-angular';
import {globalText,globalNavigation,QuestionDataService} from "../../global";
import {CommentViewPage} from '../comment-view/comment-view';
import {QuestionsPage} from '../questions/questions';

/*
  Generated class for the SendViewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/send-view/send-view.html',
  providers : [globalText,globalNavigation]
})
export class SendViewPage {
    private sendView_LabelText: String;
    commentViewPage = CommentViewPage;
    QuestionDataService: any;
  constructor(private nav: NavController, private GlobalText: globalText,private globNav :globalNavigation) {
    this.sendView_LabelText = this.GlobalText.getsendView_LabelText();
      this.QuestionDataService = QuestionDataService;
    }
    sendResult(){
      QuestionDataService.sendAnswers()
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
}
