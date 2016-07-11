import { Page,NavController } from 'ionic-angular';
import {globalText,globalNavigation} from "../../global";
import {QuestionDataService} from '../../QuestionDataService';
import {CommentViewPage} from '../comment-view/comment-view';
import {QuestionsPage} from '../questions/questions';

/*
  Generated class for the SendViewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/send-view/send-view.html',
  providers : [globalText,globalNavigation,QuestionDataService]
})
export class SendViewPage {
    private sendView_LabelText: String;
    commentViewPage = CommentViewPage;
    navList = [];
  constructor(private nav: NavController, private GlobalText: globalText, private questionDataService : QuestionDataService,private globNav :globalNavigation) {
    this.sendView_LabelText = this.GlobalText.getsendView_LabelText();
      this.navList = globNav.generateNavigation();
    }
    sendResult(){
      this.questionDataService.sendAnswers()
    }
    goTo(type: String, counter:Number){
      this.nav.push(QuestionsPage, {
        questiontype: type, pagecounter: counter
      });
    }
}
