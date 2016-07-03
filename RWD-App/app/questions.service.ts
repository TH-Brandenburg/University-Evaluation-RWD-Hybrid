import { Injectable } from '@angular/core';

//data structure may not be final, but I gotta work with SOMETHING here :P
export class Answer {
  text: string;
  value: number;
  color: string;
};

export class Question {
  type: string;
  id: number;
  text: string
  answers: Answer[] = [];
  selectedAnswer: any;
};

// mocking data
export var testAnswer: Answer = {
  text: 'Aber immer doch Kindi',
  value: 3,
  color: 'green',
};

export var secondTestAnswer: Answer = {
  text: 'Niemals',
  value: -3,
  color: 'red',
}

export var testMock : Question[] = [
    { type: 'mC',
      id: 1,
      text: 'Haben sie diese Lehrveranstatung regelmäßig besucht?',
      answers: [testAnswer, secondTestAnswer],
      selectedAnswer: 'void' },
    { type: 'text',
      id: 2,
      text: 'Haben sie weitere Anmerkungen',
      answers: null,
      selectedAnswer: null
    }];


@Injectable()
export class QuestionDataService{
  static chosenCourse: string;
  static chosenAnswers: Answer[];

  public getSurveyData() {
    return testMock;
  }
  public getQuestion(questID: number){
    return testMock[questID];
  }
  public setCourse(course: string){
    QuestionDataService.chosenCourse = course;
  }
  public setAnswer(answer: Answer){
    QuestionDataService.chosenAnswers.push(answer);
  }
}
