import { Component, OnInit, DoCheck } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';


@Component({
  selector: 'navigation',
  moduleId: module.id,
  templateUrl: 'navigation.template.html',
  directives: [ROUTER_DIRECTIVES]
})
export class NavigationComponent implements OnInit, DoCheck {
  //Variable for storing survey data
  private questions: any;
  private subID: any;
  private id: number;
  private component: any;
  ngOnInit() {
  this.questions = JSON.parse(this.dataService.getQuestionTest());
  this.subID = this.activeRoute.params.subscribe(params => {let id = +params['id'];
      this.id = id;
      //this.component = component;
  });
  //var subComponent = this.activeRoute.data.subscribe(url => {console.log(url)});
  this.component = this.activeRoute.snapshot.url[0].path;
  console.log(this.component);
  }

  ngDoCheck() {
    switch(this.component)
    {
      case 'course':
      if (document.getElementById("course")) {
        document.getElementById("course").focus();
        break;
      };
      case 'question':
      if (document.getElementById("mc-" + this.id)) {
        document.getElementById("mc-" + this.id).focus();
        break;
      };
      case 'text-question':
      if (document.getElementById("text-" + this.id)) {
        document.getElementById("text-" + this.id).focus();
        break;
      };
      case 'send':
      if (document.getElementById("send")) {
        document.getElementById("send").focus();
        break;
      };
      default:
        break;
    }
  }

  constructor(private dataService: QuestionDataService,
  private activeRoute: ActivatedRoute,
  private route: Router){
  }
}
