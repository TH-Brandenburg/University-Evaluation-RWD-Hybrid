import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';

export interface Answer {
  choiceText: string;
  grade: number;
};

export interface Question {
  question: string;
  choices: Answer[];
};

export interface Survey {
  studyPaths: string[];
  textQuestions: any[];
  multipleChoiceQuestionDTOs: Question[];
  textQuestionsFirst: boolean;
};

@Injectable()
export class QuestionDataService{
	infos;
	constructor(private http:Http){
	}
  private extractData(res: Response) {
    let body = res.json();
    return body.data || { };
  }
  getSurveyData() {
  }
  getQuestion(){
		var voteToken = "5049ac73-9f2c-4572-92f0-6a91f3781ebb";
		var deviceID = "123";
		var adress = 'http://localhost:8080/v1/questions';
		this.http.post(adress, {"voteToken":voteToken, "deviceID":deviceID},{})
		.map(res => res.text())
		.subscribe(
		  data => this.infos = data,
		  err => this.logError(err),
		  () => console.log('Random Quote Complete')
		);
		return this.infos;
  }

  getQuestionTest(){
	  return '{"studyPaths":["Betriebswirtschaftslehre","Security Management","Technologie- und Innovationsmanagement","Wirtschaftsinformatik"],"textQuestions":[],"multipleChoiceQuestionDTOs":[{"question":"Haben Sie die LV regelmäßig besucht?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"immer","grade":1},{"choiceText":"oft","grade":2},{"choiceText":"mittel","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Haben Sie Interesse an dem Fach?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr groß","grade":1},{"choiceText":"groß","grade":2},{"choiceText":"mittel","grade":3},{"choiceText":"klein","grade":4},{"choiceText":"sehr klein","grade":5}]},{"question":"Wie fanden Sie das Niveau der Lehrveranstaltung?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"zu hoch","grade":1},{"choiceText":"hoch","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"niedrig","grade":4},{"choiceText":"zu niedrig","grade":5}]},{"question":"Seine/Ihre Sprache und Ausdrucksweise sind stets klar verständlich.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Er/Sie kann schwierige Sachverhalte verständlich erklären.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Ging er/sie auf Fragen innerhalb der LV ein?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"immer","grade":1},{"choiceText":"oft","grade":2},{"choiceText":"mittel","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"War er/sie stets gut auf die LV vorbereitet?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"immer","grade":1},{"choiceText":"oft","grade":2},{"choiceText":"mittel","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Welche Gesamtnote geben Sie dem Dozenten/der Dozentin?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Welche Gesamtnote geben Sie den Lehrunterlagen?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Die Stoffpräsentation der LV war stets klar und gut strukturiert.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Wie war die Stoffmenge im Verhältnis zur verfügbaren Zeit?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Stoff","grade":1},{"choiceText":"viel Stoff","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Stoff","grade":4},{"choiceText":"sehr wenig Stoff","grade":5}]},{"question":"Die Übung war nützlich. Sie war sehr gut geeignet, die Vorlesungsinhalte zu verdeutlichen und zu vertiefen.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Wie beurteilen Sie den Übungsanteil im Vergleich zum Vorlesungsanteil?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Übung","grade":1},{"choiceText":"viel Übung","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Übung","grade":4},{"choiceText":"zu wenig Übung","grade":5}]},{"question":"Wie beurteilen Sie den Medieneinsatz der LV? (Beamer, Tafel, Overheadprojektor, Mobil-Telefone...)","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Medien","grade":1},{"choiceText":"viel Medien","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Medien","grade":4},{"choiceText":"sehr wenig Medien","grade":5}]},{"question":"Wie beurteilen Sie Ihren persönlichen Lernerfolg in dieser LV?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr groß","grade":1},{"choiceText":"groß","grade":2},{"choiceText":"mittel","grade":3},{"choiceText":"klein","grade":4},{"choiceText":"sehr klein","grade":5}]},{"question":"Welche Gesamtnote geben Sie der LV?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]}],"textQuestionsFirst":false}';
  }

  logError(err) {
	console.error('There was an error: ' + err);
  }
}
