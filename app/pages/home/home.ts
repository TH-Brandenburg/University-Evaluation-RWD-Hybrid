import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {BarcodeScanner} from 'ionic-native';
import {QuestionsPage} from '../questions/questions';
import {QuestionsDTO, RequestResponse, QuestionDataService, debugMode} from '../../global';
import {CoursesPage} from '../choose-course/choose-course';

@Page({
    templateUrl: 'build/pages/home/home.html',
    providers: [QuestionDataService]
})
export class HomePage {
    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    questionsPage = QuestionsPage;
    coursesPage = CoursesPage;

    constructor(private plt: Platform, private nav : NavController, private qService: QuestionDataService) {
    }

    onPageLoaded(){
      if(this.plt.is('core'))
      {
        //QuestionDataService.setTestData();
        //QuestionDataService.testGetQuestionSendAnswers('c9998352-3fed-4399-a6fb-aaae3d06f380', 'http://52.88.89.29:8080');
        //QuestionDataService.testGetQuestion('ba4d6b45-418b-4c32-921e-26656eff591a', 'http://52.36.71.138:8080');

        this.nav.setPages([{
                page: CoursesPage,
                params: {pagecounter: -1}
              }]);
      }
      else{
          this.plt.ready().then(() => { this.scan(); });
      }
    }


    scan() {
         BarcodeScanner.scan().then((barcodeData) => {
           if(debugMode){
               QuestionDataService.setTestData();
               this.nav.setPages([{
                       page: CoursesPage,
                       params: {pagecounter: -1}
                     }]);
           } else {
             if(QuestionDataService.setBarcodeData(barcodeData.text)) {
                 QuestionDataService.getQuestionsFailedCallback = (errData: RequestResponse) => {
                     let alert = Alert.create({
                         title: "Error!", //String(errData.type),
                         subTitle: errData.message,
                         buttons: [{
                             text: 'RETRY',
                             handler: () => {
                                 this.scan();
                             }
                         }, {
                             text: 'EXIT',
                             handler: () => {
                                 this.plt.exitApp();
                             }
                         }]
                     });
                     this.nav.present(alert);
                 };
                 QuestionDataService.getQuestionsSucceedCallback = (survey: QuestionsDTO) => {
                     this.nav.setPages([{
                         page: CoursesPage,
                         params: {pagecounter: -1}
                     }]);
                 };
                 QuestionDataService.getQuestions();
             } else {
                 let alert = Alert.create({
                     title: "Error!",
                     subTitle: "QR-Code invalid!",
                     buttons: [{
                         text: 'RETRY',
                         handler: () => {
                             this.scan();
                         }
                     }, {
                         text: 'EXIT',
                         handler: () => {
                             this.plt.exitApp();
                         }
                     }]
                 });
                 this.nav.present(alert);
             }
           }
         }, (err) => {
             // An error occurred
         });
    }

 }
