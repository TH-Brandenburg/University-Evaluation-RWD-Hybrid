import { Page,NavController } from 'ionic-angular';
import {globalText} from "../../global";

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
  constructor(private nav: NavController,private GlobalText: globalText) {
    this.sendView_LabelText = this.GlobalText.getsendView_LabelText();
  }
}
