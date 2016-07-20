import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'start',
  moduleId: module.id,
  templateUrl: 'start.template.html'
})
export class StartComponent {
  constructor(){
  }

  ngOnInit(){
  }

  startApp() {
    let appStarted:boolean = true;
    window.location.href = '/app/scanner/scanner.template.html';
    //this.router.navigate('/app/scanner/scanner.template.html');
  }
}
