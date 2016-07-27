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
        QuestionDataService.setTestData();

        // getQuestion() POST-Request test:
        // QuestionDataService.getQuestionFailedCallback = (data: RequestError) => {
        //     console.log('getQuestion failed', data);
        // };
        // QuestionDataService.getQuestionSucceedCallback = (data: QuestionsDTO) => {
        //     console.log('getQuestion succeed', data);
        // };
        // QuestionDataService.getQuestion();

        console.log(QuestionDataService.survey.multipleChoiceQuestionDTOs);
        console.log(QuestionDataService.survey.multipleChoiceQuestionDTOs.length);
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
                 QuestionDataService.setBarcodeData(barcodeData.text);
                 QuestionDataService.getQuestionFailedCallback = (errData: RequestError) => {
                     let alert = Alert.create({
                         title: "Error!", //String(errData.type),
                         subTitle: errData.message,
                         buttons: ['YEAH']
                     });
                     this.nav.present(alert);
                 };
                 QuestionDataService.getQuestionSucceedCallback = (survey: QuestionsDTO) => {
                   this.nav.setPages([{
                           page: CoursesPage,
                           params: {pagecounter: -1}
                         }]);
                 };
                 QuestionDataService.getQuestion();
               }
             }, (err) => {
                 // An error occurred
             });
         });
     }
 }
