import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {BarcodeScanner} from 'ionic-native';
import {QuestionsPage} from '../questions/questions';
import {QuestionsDTO, RequestError,QuestionDataService} from '../../global';
import {CoursesPage} from '../choose-course/choose-course';

@Page({
    templateUrl: 'build/pages/home/home.html',
})
export class HomePage {
    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    questionsPage = QuestionsPage;
    coursesPage = CoursesPage;

    debugMode: boolean = true;

    constructor(private plt: Platform, private nav : NavController) {
    }

    onPageLoaded(){
      if(this.plt.is('core')||this.debugMode)
      {
        QuestionDataService.setTestData();
        //QuestionDataService.sendAnswers();
          
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
                 QuestionDataService.setBarcodeData(barcodeData.text);
                 QuestionDataService.getQuestionFailedCallback = (errData: RequestError) => {
                     let alert = Alert.create({
                         title: "Error!", //String(errData.type),
                         subTitle: errData.message,
                         buttons: ['YEAH']
                     });
                     this.nav.present(alert);
                 }
                 QuestionDataService.getQuestionSucceedCallback = (survey: QuestionsDTO) => {
                   QuestionDataService.survey = survey;
                   this.nav.setPages([{
                           page: CoursesPage,
                           params: {pagecounter: -1}
                         }]);
                 }
                 QuestionDataService.getQuestion();
             }, (err) => {
                 // An error occurred
             });
         });
     }
 }
