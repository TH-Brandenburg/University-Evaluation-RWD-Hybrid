import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';


@Component({
  selector: 'navigation',
  moduleId: module.id,
  templateUrl: 'navigation.template.html',
  directives: [ROUTER_DIRECTIVES]
})
export class NavigationComponent implements OnInit {
  //Variable for storing survey data
  questions: any;
  ngOnInit() {
  //get survey data on initialization
  this.questions = JSON.parse(this.dataService.getQuestionTest());
  }
  constructor(private dataService: QuestionDataService){
  }
}
