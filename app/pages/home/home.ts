import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {BarcodeScanner} from 'ionic-native';
import {QuestionsPage} from '../questions/questions';
import {globalVar} from '../../global'
import {QuestionDataService} from '../../QuestionDataService';

@Page({
    templateUrl: 'build/pages/home/home.html',
    providers : [QuestionDataService]
})
export class HomePage {
    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    questionsPage = QuestionsPage;
    static get parameters() {
        return [[Platform], [NavController]];
    }

    constructor(private plt: Platform, private nav : NavController, private questionDataService : QuestionDataService) {
    }

    scan() {
        this.plt.ready().then(() => {
            BarcodeScanner.scan().then((barcodeData) => {
                this.questionDataService.setBarcodeData(barcodeData.text);
                // Success! Barcode data is here
            }, (err) => {
                // An error occurred
            });
        });
    }
}
