import {Page, Platform, Alert, NavController,NavParams} from 'ionic-angular';
import {MultipleChoiceQuestionDTO,QuestionDataService} from '../../global';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {CoursesPage} from '../choose-course/choose-course';

@Page({
    templateUrl: 'build/pages/questions/questions.html',
})

export class QuestionsPage{

allQuestions: MultipleChoiceQuestionDTO[];
    currentQuestion: MultipleChoiceQuestionDTO;
    currentQuestionID: number;
    classes: string[]= [];

    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    QuestionDataService: any;

    type : String;
    counter : number;
	   pos: number;

    i: number = 0;

    constructor(private navParams: NavParams,private nav : NavController) {
        this.counter = navParams.get('pagecounter')-1;
        this.QuestionDataService = QuestionDataService;
        this.currentQuestion = QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter];
        console.log("Question",this.currentQuestion)
        this.currentQuestionID = this.counter;
		this.pos = QuestionDataService.calulateNavigationPos("multipleChoiceQuestionDTOs",this.counter)+1;

        //alert(QuestionDataService.getMultipleChoiceAnswer(this.counter));
        while(this.i < QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices.length){

            if(QuestionDataService.getMultipleChoiceAnswer(this.counter) == null){
                if(QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].grade == 0) {
                    this.classes[this.i] = "answer right answer-" + QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].grade;
                }
                else {
                    this.classes[this.i] = "normalAnswer answer answer-" + QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].grade;
                }
            }
            else {
                if(QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].choiceText == QuestionDataService.getMultipleChoiceAnswer(this.counter))
                {
                    if(QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].grade == 0) {
                        this.classes[this.i] = "answer enabled right";
                    }
                    else {
                        this.classes[this.i] = "normalAnswer answer enabled";
                    }
                }
                else {
                    if(QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].grade == 0) {
                        this.classes[this.i] = "answer right answer-" + QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].grade;
                    }
                    else {
                        this.classes[this.i] = "normalAnswer answer answer-" + QuestionDataService.survey.multipleChoiceQuestionDTOs[this.counter].choices[this.i].grade;
                    }
                }
            }
            this.i++;
        }

    console.log(this.currentQuestion.choices)
    }

    // GetClass(grade: number){
    //
    //   var classes = "";
    //   if(grade == QuestionDataService.getMultipleChoiceAnswer(this.counter))
    //     classes = "answer enabled";
    //   else
    //     classes = "answer answer-" + grade;
    //
    //   if(grade == 0){
    //       if(document.getElementById("button_answer0") != null)
    //         document.getElementById("button_answer0").style.height = ((this.currentQuestion.choices.length - 1) * 50 + (this.currentQuestion.choices.length - 2) * 10) + "px";
    //       return classes += " right";
    //   }
    //   else
    //     return classes += " normalAnswer";
    // }

    DisableOtherAnswers(number){
       var nextButtonNumber = number;
       for(var i = 0; i < this.currentQuestion.choices.length - 1; i++){

           nextButtonNumber++;
           if(nextButtonNumber > this.currentQuestion.choices.length - 1)
               nextButtonNumber = nextButtonNumber - this.currentQuestion.choices.length;
           if(nextButtonNumber == 0)
               document.getElementById("button_answer"+nextButtonNumber).className = this.classes[nextButtonNumber];
           else
               document.getElementById("button_answer"+nextButtonNumber).className = this.classes[nextButtonNumber];

       }
   }

   onClickAnswer(number){
       if(number == 0)
           document.getElementById("button_answer"+number).className = "answer enabled right";
       else
           document.getElementById("button_answer"+number).className = "answer enabled normalAnswer";
       this.DisableOtherAnswers(number);
       //alert(this.currentQuestionID + "   " + number);
       QuestionDataService.addMultipleChoiceAnswer(this.currentQuestionID, number);
    }

    goTo(type: String,counter:Number){
      if (type == "textQuestions"){
        this.nav.setPages([{
              page: CommentViewPage,
              params: {pagecounter: counter}
            }]);
      }
      if (type == "multipleChoiceQuestionDTOs"){
        this.nav.setPages([{
              page: QuestionsPage,
              params: {pagecounter: counter}
            }]);
      ;}
      if (type == "sendPage"){  this.nav.setPages([{
              page: SendViewPage,
              params: {pagecounter: counter}
            }]);
      ;}
      if (type == "choosePage"){  this.nav.setPages([{
              page: CoursesPage,
              params: {pagecounter: counter}
            }]);
      ;}
    }
    getClass(pos){
      var className = "navPassiv"
      if (pos ==this.counter){
        className = "navActiv"
        }
        return className
    }
}
