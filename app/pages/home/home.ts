import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {QuestionDataService} from '../../QuestionDataService';
import {BarcodeScanner} from 'ionic-native';
import {QuestionsPage} from '../questions/questions';
import {globalVar,globalNavigation} from '../../global';
import {CoursesPage} from '../choose-course/choose-course';

@Page({
    templateUrl: 'build/pages/home/home.html',
    providers : [QuestionDataService,globalNavigation]
})
export class HomePage {
    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    questionsPage = QuestionsPage;
    coursesPage = CoursesPage;
    constructor(private plt: Platform, private nav : NavController, private questionDataService : QuestionDataService,private globNav :globalNavigation) {
    }

    scan() {
        this.plt.ready().then(() => {
            BarcodeScanner.scan().then((barcodeData) => {
                this.questionDataService.setBarcodeData(barcodeData.text);
                if (this.questionDataService.getQuestion()){
                  this.nav.push(QuestionsPage, {
                    questiontype: "TextQuestion", pagecounter: 1
                  });
                }
                else {
                  this.questionDataService.getQuestionFailedCallback = (errData) => {
                    let alert = Alert.create({
                      title: String(errData.type),
                      subTitle: errData.message,
                      buttons: ['YEAH']
                    });
                    this.nav.present(alert);
                  }

                }
            }, (err) => {
                // An error occurred
            });
        });
    }
}
