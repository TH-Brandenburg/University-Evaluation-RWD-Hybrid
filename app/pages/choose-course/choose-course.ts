import {Page, Platform, Alert, NavController,NavParams} from 'ionic-angular';
import {globalVar, globalText, Question,globalNavigation, Course,QuestionDataService} from '../../global'
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {QuestionsPage} from '../questions/questions';

@Page({
    templateUrl: 'build/pages/choose-course/choose-course.html',
    providers : [globalText,globalNavigation]
})

export class CoursesPage{
    allCourses: Course[];

    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;


    type : String;
    counter : Number;
    QuestionDataService: any;

    constructor(private GlobalText: globalText,private navParams: NavParams,private nav : NavController,private globNav :globalNavigation) {
        //this.allCourses = this.GlobalText.getStudyPaths();
        this.QuestionDataService = QuestionDataService;

        this.type = navParams.get('type');
        this.counter = navParams.get('counter');
        this.QuestionDataService = QuestionDataService;
        this.allCourses = this.QuestionDataService.survey.studyPaths;
    }


    DisableOtherCourses(number){
        var nextButtonNumber = number;
        for(var i = 0; i < this.allCourses.length - 1; i++){
            nextButtonNumber++;
            //alert(nextButtonNumber);
            if(nextButtonNumber > this.allCourses.length - 1)
                nextButtonNumber = nextButtonNumber - this.allCourses.length;

            document.getElementById("button_course"+nextButtonNumber).className = "course disabled";

        }
    }

    onClickCourse(number, course:string){
        document.getElementById("button_course"+number).className = "course enabled";
        this.DisableOtherCourses(number);
        QuestionDataService.studyPath = course;
    }

    goTo(type: String,counter:Number){
      if (type == "textQuestions"){
        this.nav.push(CommentViewPage, {
          pagecounter: counter
        });
      }
      if (type == "multipleChoiceQuestionDTOs"){
      this.nav.push(QuestionsPage, {
        pagecounter: counter
      });}
    }
}
