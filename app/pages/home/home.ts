import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {QuestionDataService, Survey, GetQuestionError} from '../../QuestionDataService';
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
                this.questionDataService.getQuestionFailedCallback = (errData: GetQuestionError) => {
                    let alert = Alert.create({
                        title: "Error!", //String(errData.type),
                        subTitle: errData.message,
                        buttons: ['YEAH']
                    });
                    this.nav.present(alert);
                }
                this.questionDataService.getQuestionSucceedCallback = (survey: Survey) => {
                    this.nav.push(QuestionsPage, {
                        questiontype: "TextQuestion", pagecounter: 1
                    });
                }
                this.questionDataService.getQuestion();
            }, (err) => {
                // An error occurred
            });
        });
    }
}
