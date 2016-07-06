import {Page,NavController,Alert} from 'ionic-angular';
import { Camera } from 'ionic-native';
import { Component } from '@angular/core';
import {globalVar,globalText} from "../../global";
import {SendViewPage} from '../send-view/send-view';


@Page({
    templateUrl: 'build/pages/comment-view/comment-view.html',
    providers : [globalText]
})

export class CommentViewPage {
    public base64Image: String;
    public inputText :String;
    public deleteButtonState: boolean;

    private commmentView_editText: String;
    private commmentView_sendText: String;
    private commmentView_camera_addText: String;
    private commmentView_camera_delText: String;

    constructor(private nav: NavController, private GlobalText: globalText) {
        this.commmentView_editText = this.GlobalText.getcommmentView_editText();
        this.commmentView_sendText = this.GlobalText.getsendView_LabelText();
        this.commmentView_camera_addText = this.GlobalText.getcommmentView_camera_addText();
        this.commmentView_camera_delText = this.GlobalText.getcommmentView_camera_delText();
        this.nav = nav;
        this.inputText = '';
        this.deleteButtonState = true;

    }

    takepic() {
        Camera.getPicture({
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1000,
            targetHeight: 1000
        }).then((imageData) => {
            // imageData is a base64 encoded string
            this.base64Image = "data:image/jpeg;base64," + imageData;
            globalVar.base64Image = this.base64Image;
            this.deleteButtonState = false;
        }, (err) => {
            console.log(err);
        });
    }
    deletepic() {
        globalVar.base64Image = "";
        this.deleteButtonState = true;
    }
    next(){
        globalVar.optionalerText = (this.inputText);
        this.nav.push(SendViewPage);
    }
}
