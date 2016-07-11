import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {MultipartItem} from "./plugins/multipart-upload/multipart-item";
import {MultipartUploader} from "./plugins/multipart-upload/multipart-uploader";

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
	voteToken = "0e17372a-3566-4b6f-b32e-43ebbe98a720";
	deviceID = "123";
	address = 'http://localhost:8080/v1';
	infos;
	studyPath = "Technologie- und Innovationsmanagement";
	textAnswers = [];
	multipleChoiceAnswers = [];
	uploader = new MultipartUploader(this.address);
	multipartItem = new MultipartItem(this.uploader);
	file: File;

	constructor(private http:Http){
	}

	getSurveyData() {
	}

	setVoteToken(token) {
		this.voteToken = token;
	}

	getVoteToken() {
		return this.voteToken;
	}

	setHostAddress(hostaddress) {
		this.address = hostaddress;
	}

	getHostAddress() {
		return this.address;
	}

	/*
		Example Barcode Data
	 {"voteToken":"30a8e652-8068-4dad-b9b8-42006a65d1e5","host":"http://172.17.0.18:8080"}
	 */
	setBarcodeData(barcodeString) {
		var barcodeDTO = JSON.parse(barcodeString);
		this.voteToken = barcodeDTO.voteToken;
		this.address = barcodeDTO.host;
	}

	setDeviceID(id) {
		this.deviceID = id;
	}

	getDeviceID() {
		return this.deviceID;
	}

	setFile(file:File){
		this.file = file;
	}

	getQuestion(){
		var headers = new Headers();
		headers.append('Content-Type', 'application/json')
		this.http.post(this.address + '/questions', JSON.stringify({"voteToken":this.voteToken, "deviceID":this.deviceID}), { headers: headers })
		.map(res => res.text())
		.subscribe(
		  data => this.infos = data,
		  err => this.logError(err),
		  () => console.log('Request questions completed')
		);
		alert();
		return this.infos;
	}
	
	getQuestionTest(){
		return '{"studyPaths":["Betriebswirtschaftslehre","Security Management","Technologie- und Innovationsmanagement","Wirtschaftsinformatik"],"textQuestions":[{"questionID":19,"questionText":"Was fanden Sie positiv?","onlyNumbers":false,"maxLength":1000},{"questionID":20,"questionText":"Was fanden Sie negativ?","onlyNumbers":false,"maxLength":1000}],"multipleChoiceQuestionDTOs":[{"question":"Haben Sie die Veranstaltung regelmässig besucht?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Haben Sie Interesse an diesem Fach?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, sehr","grade":1},{"choiceText":"durchaus","grade":2},{"choiceText":"mittelmäßig","grade":3},{"choiceText":"eher nicht","grade":4},{"choiceText":"überhaupt nicht","grade":5}]},{"question":"Wie empfanden Sie das Niveau der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"zu hoch","grade":3},{"choiceText":"hoch","grade":2},{"choiceText":"angemessen","grade":1},{"choiceText":"niedrig","grade":2},{"choiceText":"zu niedrig","grade":3}]},{"question":"Wie waren Sprache und Ausdrucksweise des Dozenten/der Dozentin?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr laut, sehr deutlich","grade":1},{"choiceText":"laut, präzise","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"leise, eher undeutlich","grade":4},{"choiceText":"zu leise, undeutlich","grade":5}]},{"question":"Kann er/sie schwierige Sachverhalte verständlich erklären?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, hervorragend","grade":1},{"choiceText":"ja, fast immer","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"manchmal klappt es","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"Versuchte der/die Dozent(in) festzustellen, ob die Studenten der LV folgen können?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer Dialog mit Studenten","grade":1},{"choiceText":"überwiegend Dialog","grade":2},{"choiceText":"gute Mischung","grade":3},{"choiceText":"zu oft Monolog","grade":4},{"choiceText":"nein, nur Monolog","grade":5}]},{"question":"Ging der/die Dozent(in) auf Fragen innerhalb der LV ein?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War er/sie auch ausserhalb der LV zu diesen Themen ansprechbar?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War der/die Dozent(in) gut vorbereitet?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Welche Gesamtnote geben Sie dem/der Dozenten(in)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Welche Gesamtnote geben Sie den Lehrunterlagen?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie war die Vorgehensweise und Stoffpräsentation in der LV?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr klar","grade":1},{"choiceText":"gut strukturiert","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"sprunghaft","grade":4},{"choiceText":"Roter Faden fehlte","grade":5}]},{"question":"Wie war die Stoffmenge im Verhältnis zur verfügbaren Zeit?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Stoff","grade":1},{"choiceText":"viel Stoff","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Stoff","grade":4},{"choiceText":"sehr wenig Stoff","grade":5}]},{"question":"Die Übung war nützlich. Sie war sehr gut geeignet, die Vorlesungsinhalte zu verdeutlichen und zu vertiefen.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Wie beurteilen Sie die Ausstattung des Übungs- oder Laborraumes?","choices":[{"choiceText":"keine Ü/L vorhanden","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie beurteilen Sie den Medieneinsatz (Beamer, Tafel, Overhead-Projektor, usw.)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"viel zu viele Medien eingesetzt","grade":5},{"choiceText":"etwas zu viele Medien eingesetzt","grade":3},{"choiceText":"Medieneinsatz adäquat","grade":1},{"choiceText":"etwas zu wenige Medien eingesetzt","grade":3},{"choiceText":"viel zu wenig Medien eingesetzt","grade":5}]},{"question":"Wie beurteilen Sie Ihren persönlichen Lernerfolg in dieser Lehrveranstaltung?","choices":[{"choiceText":"weiss ich nicht","grade":0},{"choiceText":"habe sehr viel gelernt","grade":1},{"choiceText":"habe viel gelernt","grade":2},{"choiceText":"habe etwas gelernt","grade":3},{"choiceText":"habe wenig gelernt","grade":4},{"choiceText":"habe sehr wenig gelernt","grade":5}]},{"question":"Welche Gesamtnote geben Sie der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]}],"textQuestionsFirst":false}';	
	}
	
	sendAnswers(){
		this.uploader = new MultipartUploader(this.address + "/answers");
		this.uploader.url = this.address + "/answers";
		this.multipartItem = new MultipartItem(this.uploader);
		this.multipartItem.url = this.address + "/answers";
		var body = JSON.stringify({"voteToken":this.voteToken, "studyPath":this.studyPath, "textAnswers":this.textAnswers, "mcAnswers":this.multipleChoiceAnswers, "deviceID":this.deviceID});
		if (this.multipartItem == null){
				this.multipartItem = new MultipartItem(this.uploader);
		}
		if (this.multipartItem.formData == null){
			this.multipartItem.formData = new FormData();
		}

		this.multipartItem.formData.append("answers-dto",  body);
		this.multipartItem.formData.append("images",  this.file);
		this.multipartItem.callback = this.uploadCallback;
		this.multipartItem.upload();
	}
	
	uploadCallback = (data) => {
		console.debug("home.ts & uploadCallback() ==>");
		this.file = null;
		if (data){
			console.debug("home.ts & uploadCallback() upload file success.");
		}else{
			console.error("home.ts & uploadCallback() upload file false.");
		}
	}
	
	addTextAnswer(questionID: number, questionText:string, answerText:string){
		// addTextAnswer(3,"Welche Verbesserungsvorschläge würden Sie machen?","Antwort");
		this.textAnswers.push({"questionID":questionID, "questionText":questionText, "answerText":answerText});
	}
	
	addMultipleChoiceAnswer(questionText:string, choiceText:string, grade:number){
		// addMultipleChoiceAnswer("Ging er/sie auf Fragen innerhalb der LV ein?", "oft",2);
		this.multipleChoiceAnswers.push({"questionText":questionText, "choice":{"choiceText":choiceText,"grade":grade}});
	}
  
  logError(err) {
	console.error('There was an error: ' + err);
  }
}
