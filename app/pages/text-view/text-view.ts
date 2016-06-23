import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {globalVar} from "../../global";
/*
  Generated class for the TextViewPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/text-view/text-view.html'
})
export class TextViewPage {
    static get parameters() {
        return [];
    }
    constructor(private nav: NavController, public inputText :String, private global: globalVar) {
        this.inputText = '';
    }

    onSubmit(formData) {
        // let's log our findings
        this.inputText = formData.name;
        this.global.setText(this.inputText);
        console.log('Texteingabe ', this.global.getText());
    }

}
