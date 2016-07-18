import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
//import {QuestionDataService} from '../../QuestionDataService';
import {BarcodeScanner} from 'ionic-native';
import {QuestionsPage} from '../questions/questions';
import {globalVar,globalNavigation,Survey, GetQuestionError,QuestionDataService} from '../../global';
import {CoursesPage} from '../choose-course/choose-course';

@Page({
    templateUrl: 'build/pages/home/home.html',
    providers : [globalNavigation]
})
export class HomePage {
    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    questionsPage = QuestionsPage;
    coursesPage = CoursesPage;
    constructor(private plt: Platform, private nav : NavController ,private globNav :globalNavigation) {
    }

    onPageLoaded(){
//      QuestionDataService.getQuestion();
      if(this.plt.is('core'))
      {
        QuestionDataService.setTestData();
        for(var i = 0; i < QuestionDataService.multipleChoiceQuestionDTOs.length; i++) {
            globalVar.choiceAnswers[i] = -1;
        }
        this.nav.push(CommentViewPage, {
          pagecounter: 1
        });
      }
      else{
        this.scan()
      }
    }


    scan() {
         this.plt.ready().then(() => {
             BarcodeScanner.scan().then((barcodeData) => {
                 QuestionDataService.setBarcodeData(barcodeData.text);
                 QuestionDataService.getQuestionFailedCallback = (errData: GetQuestionError) => {
                     let alert = Alert.create({
                         title: "Error!", //String(errData.type),
                         subTitle: errData.message,
                         buttons: ['YEAH']
                     });
                     this.nav.present(alert);
                 }
                 QuestionDataService.getQuestionSucceedCallback = (survey: Survey) => {
                   QuestionDataService.multipleChoiceQuestionDTOs = survey.multipleChoiceQuestionDTOs;
                   QuestionDataService.textQuestions = survey.textQuestions;
                     this.nav.push(QuestionsPage, {
                         questiontype: "TextQuestion", pagecounter: 1
                     });
                 }
                 QuestionDataService.getQuestion();
             }, (err) => {
                 // An error occurred
             });
         });
     }
 }
