import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {BarcodeScanner} from 'ionic-native';
import {QuestionsPage} from '../questions/questions';
import {QuestionsDTO, RequestError,QuestionDataService} from '../../global';
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

    debugMode: boolean = true;

    constructor(private plt: Platform, private nav : NavController, private qService: QuestionDataService) {
    }

    onPageLoaded(){
      if(this.plt.is('core'))
      {
        //QuestionDataService.setTestData();
        //QuestionDataService.testGetQuestionSendAnswers('950209f3-78fb-4c78-ad86-42e854dd75c6', 'http://localhost:8080');

        this.nav.setPages([{
                page: CoursesPage,
                params: {pagecounter: -1}
              }]);
      }
      else{
        this.scan()
      }
    }


    scan() {
         this.plt.ready().then(() => {
             BarcodeScanner.scan().then((barcodeData) => {
               if(this.debugMode){
                   QuestionDataService.setTestData();
                   this.nav.setPages([{
                           page: CoursesPage,
                           params: {pagecounter: -1}
                         }]);
               }
               else{
                 if(QuestionDataService.setBarcodeData(barcodeData.text)) {
                     QuestionDataService.getQuestionsFailedCallback = (errData: RequestError) => {
                         let alert = Alert.create({
                             title: "Error!", //String(errData.type),
                             subTitle: errData.message,
                             buttons: ['OK']
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
                         buttons: ['OK']
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
