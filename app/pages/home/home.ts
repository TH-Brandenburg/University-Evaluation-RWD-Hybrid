import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {CommentViewPage} from '../comment-view/comment-view';
import {SendViewPage} from '../send-view/send-view';
import {BarcodeScanner} from 'ionic-native';

@Page({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    commentViewPage = CommentViewPage;
    sendViewPage = SendViewPage;
    static get parameters() {
        return [[Platform], [NavController]];
    }

    constructor(private plt: Platform, private nav : NavController, public barcode: String) {
        this.barcode = "";
    }


    scan() {
        this.plt.ready().then(() => {
            BarcodeScanner.scan().then((barcodeData) => {
                this.barcode = barcodeData.text
                // Success! Barcode data is here
            }, (err) => {
                // An error occurred
            });
        });
   }
}
