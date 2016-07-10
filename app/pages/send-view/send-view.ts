import { Page,NavController } from 'ionic-angular';
import {globalText,globalNavigation} from "../../global";
import {QuestionDataService} from '../../QuestionDataService';

/*
  Generated class for the SendViewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/send-view/send-view.html',
  providers : [globalText,QuestionDataService]
})
export class SendViewPage {
    private sendView_LabelText: String;
  constructor(private nav: NavController,private GlobalText: globalText, private questionDataService : QuestionDataService) {
    this.sendView_LabelText = this.GlobalText.getsendView_LabelText();
    }
    sendResult(){
      this.questionDataService.sendAnswers();
    }
}
