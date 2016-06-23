import {Page, Platform, Alert, NavController} from 'ionic-angular';
import {TextViewPage} from '../text-view/text-view';

@Page({
    templateUrl: 'build/pages/home/home.html'
})
export class HomePage {
    textViewPage =  TextViewPage;
    static get parameters() {
        return [[Platform], [NavController]];
    }

    constructor(private plt: Platform, private nav : NavController, public barcode: String) {
        this.barcode = "";
    }

    // Webtest

    scan(){}




    // normal

//    scan() {
//        this.plt.ready().then(() => {
//            cordova.plugins.barcodeScanner.scan((result) => {
//                this.barcode = result.text;
//            }, (error) => {
//                this.nav.present(Alert.create({
//                    title: "Attention!",
//                    subTitle: error,
//                    buttons: ["Close"]
//                }));
//            });
//        });
 //   }
}