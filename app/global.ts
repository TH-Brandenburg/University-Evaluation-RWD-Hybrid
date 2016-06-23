import {Injectable}  from '@angular/core';

@Injectable()
    export class globalVar {

    constructor(public text: String) {
        this.text = "";
    }

    setText(value) {
        this.text = value;
    }

    getText() {
        return this.text;
    }

}

