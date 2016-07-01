import { Component } from '@angular/core';

@Component({
  selector: 'choose-course',
  template: `
              <div class="btn-group">
                <button type="button" class="btn btn-primary">Bachelor Informatik</button>
                <button type="button" class="btn btn-primary">Master Informatik</button>
                <button type="button" class="btn btn-primary">Digitale Medien</button>
              </div>
            `
})

export class ChooseCourseComponent {
  constuctor() {

  }
}
