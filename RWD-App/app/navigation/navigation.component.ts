import { Component, OnInit, DoCheck } from '@angular/core';
import { ROUTER_DIRECTIVES, ActivatedRoute, Router } from '@angular/router';
import { QuestionDataService, Question, Answer, Survey } from '../questions.service';


@Component({
  selector: 'navigation',
  moduleId: module.id,
  templateUrl: 'navigation.template.html',
  directives: [ROUTER_DIRECTIVES]
})
export class NavigationComponent implements OnInit {
  //Variable for storing survey data
  private questions: any;
  private subID: any;
  private id: number;
  private component: any;
  ngOnInit() {
  this.questions = JSON.parse(this.dataService.getQuestions());
  this.subID = this.activeRoute.params.subscribe(params => {let id = +params['id'];
      this.id = id;
      //this.component = component;
  });
  //var subComponent = this.activeRoute.data.subscribe(url => {console.log(url)});
  this.component = this.activeRoute.snapshot.url[0].path;
  console.log(this.component);
  }

  constructor(private dataService: QuestionDataService,
  private activeRoute: ActivatedRoute,
  private route: Router){
  }
}
