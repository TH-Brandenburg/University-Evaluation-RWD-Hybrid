import { Component, Input, OnInit } from '@angular/core';
import { QuestionDataService } from './questions.service';

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
			{{questions}}
			This is for uploaing an images\n
			Later the picture comes from the camera
			<input type="file" (change)="selectFile($event)">
            `
})

export class QuestionComponent implements OnInit {
  currentQuestion: Question;
  questions;
  answers;
  
  ngOnInit() {
    this.questions = this.surveyService.getQuestionTest();
  }
  constructor(private surveyService: QuestionDataService) {
	  this.questions = this.surveyService.getQuestionTest();
  }
  
  selectFile($event): void {
        var inputValue = $event.target;
        var file = inputValue.files[0];
		this.surveyService.setFile(file);
		this.sendAnswers();		
		
        console.debug("Input File name: " + file.name + " type:" + file.size + " size:" + file.size);
    }
	
	sendAnswers() {
		// example how to fill answers
		this.surveyService.addTextAnswer(3,"Welche Verbesserungsvorschläge würden Sie machen?","Antwort");
		this.surveyService.addMultipleChoiceAnswer("Ging er/sie auf Fragen innerhalb der LV ein?", "oft",2);
		this.answers = this.surveyService.sendAnswers();
	}
  onSelect(answer: Answer) {this.currentQuestion.selectedAnswer = answer}
}
