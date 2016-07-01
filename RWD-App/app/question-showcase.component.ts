import { Component, Input, OnInit } from '@angular/core';
//import { QuestionDataService } from './questions.service';

export class Answer {
  text: string;
  value: number;
  color: string;
};

export class Question {
  type: string;
  id: number;
  answers: Answer[] = [];
  selectedAnswer: Answer;
};



@Component({
  selector: 'question-show',
  template: `
            <h1>In Survey</h1>
            `
})

export class QuestionComponent implements OnInit {
  currentQuestion: Question;
  ngOnInit() {
    //this.currentQuestion = this.surveyService.getQuestion();
  }
  //constructor(private surveyService: QuestionDataService) {
  //}
  onSelect(answer: Answer) {this.currentQuestion.selectedAnswer = answer}
}
