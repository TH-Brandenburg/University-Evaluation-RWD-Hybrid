import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {MultipartItem} from "./plugins/multipart-upload/multipart-item";
import {MultipartUploader} from "./plugins/multipart-upload/multipart-uploader";
import 'rxjs/add/operator/map';
import {isUndefined} from "ionic-angular/util";

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

export interface GetQuestionError {
	message: string;
	type: number;
}


@Injectable()
export class QuestionDataService {
	voteToken = "0e17372a-3566-4b6f-b32e-43ebbe98a720";
	deviceID = "123";
	address = 'http://localhost:8080/v1';
	questions;
	studyPath = "Technologie- und Innovationsmanagement";
	textAnswers = [];
	multipleChoiceAnswers = [];
	answerFiles: File[] = [];

	public getQuestionFailedCallback: (error: GetQuestionError) => void;


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

	 /*	Example Barcode Data
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

	addAnswerImage(file:File){
		this.answerFiles.push(file);
	}

	getQuestion(): Survey {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');

		let result: Survey = <Survey>JSON.parse(this.getQuestionTest()); //testcode for example data

		/*
		let result: Survey = null;
		let body = JSON.stringify({"voteToken":this.voteToken, "deviceID":this.deviceID});
		this.http.post(this.address + '/questions', body, { headers: headers })
		.map(res => res.json())
		.subscribe(
		  data => result = <Survey>JSON.parse(data),
		  err => this.handleGetQuestionError(err),
		  () => console.log('Request questions completed')
		); */
		return result;
	}

	getQuestionTest(){
		return '{"studyPaths":["Betriebswirtschaftslehre","Security Management","Technologie- und Innovationsmanagement","Wirtschaftsinformatik"],"textQuestions":[{"questionID":19,"questionText":"Was fanden Sie positiv?","onlyNumbers":false,"maxLength":1000},{"questionID":20,"questionText":"Was fanden Sie negativ?","onlyNumbers":false,"maxLength":1000}],"multipleChoiceQuestionDTOs":[{"question":"Haben Sie die Veranstaltung regelmässig besucht?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Haben Sie Interesse an diesem Fach?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, sehr","grade":1},{"choiceText":"durchaus","grade":2},{"choiceText":"mittelmäßig","grade":3},{"choiceText":"eher nicht","grade":4},{"choiceText":"überhaupt nicht","grade":5}]},{"question":"Wie empfanden Sie das Niveau der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"zu hoch","grade":3},{"choiceText":"hoch","grade":2},{"choiceText":"angemessen","grade":1},{"choiceText":"niedrig","grade":2},{"choiceText":"zu niedrig","grade":3}]},{"question":"Wie waren Sprache und Ausdrucksweise des Dozenten/der Dozentin?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr laut, sehr deutlich","grade":1},{"choiceText":"laut, präzise","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"leise, eher undeutlich","grade":4},{"choiceText":"zu leise, undeutlich","grade":5}]},{"question":"Kann er/sie schwierige Sachverhalte verständlich erklären?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, hervorragend","grade":1},{"choiceText":"ja, fast immer","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"manchmal klappt es","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"Versuchte der/die Dozent(in) festzustellen, ob die Studenten der LV folgen können?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer Dialog mit Studenten","grade":1},{"choiceText":"überwiegend Dialog","grade":2},{"choiceText":"gute Mischung","grade":3},{"choiceText":"zu oft Monolog","grade":4},{"choiceText":"nein, nur Monolog","grade":5}]},{"question":"Ging der/die Dozent(in) auf Fragen innerhalb der LV ein?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War er/sie auch ausserhalb der LV zu diesen Themen ansprechbar?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War der/die Dozent(in) gut vorbereitet?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Welche Gesamtnote geben Sie dem/der Dozenten(in)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Welche Gesamtnote geben Sie den Lehrunterlagen?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie war die Vorgehensweise und Stoffpräsentation in der LV?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr klar","grade":1},{"choiceText":"gut strukturiert","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"sprunghaft","grade":4},{"choiceText":"Roter Faden fehlte","grade":5}]},{"question":"Wie war die Stoffmenge im Verhältnis zur verfügbaren Zeit?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Stoff","grade":1},{"choiceText":"viel Stoff","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Stoff","grade":4},{"choiceText":"sehr wenig Stoff","grade":5}]},{"question":"Die Übung war nützlich. Sie war sehr gut geeignet, die Vorlesungsinhalte zu verdeutlichen und zu vertiefen.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Wie beurteilen Sie die Ausstattung des Übungs- oder Laborraumes?","choices":[{"choiceText":"keine Ü/L vorhanden","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie beurteilen Sie den Medieneinsatz (Beamer, Tafel, Overhead-Projektor, usw.)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"viel zu viele Medien eingesetzt","grade":5},{"choiceText":"etwas zu viele Medien eingesetzt","grade":3},{"choiceText":"Medieneinsatz adäquat","grade":1},{"choiceText":"etwas zu wenige Medien eingesetzt","grade":3},{"choiceText":"viel zu wenig Medien eingesetzt","grade":5}]},{"question":"Wie beurteilen Sie Ihren persönlichen Lernerfolg in dieser Lehrveranstaltung?","choices":[{"choiceText":"weiss ich nicht","grade":0},{"choiceText":"habe sehr viel gelernt","grade":1},{"choiceText":"habe viel gelernt","grade":2},{"choiceText":"habe etwas gelernt","grade":3},{"choiceText":"habe wenig gelernt","grade":4},{"choiceText":"habe sehr wenig gelernt","grade":5}]},{"question":"Welche Gesamtnote geben Sie der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]}],"textQuestionsFirst":false}';
	}

	sendAnswers(){
		let uploader = new MultipartUploader(this.address + "/answers");
		uploader.url = this.address + "/answers";
		let multipartItem = new MultipartItem(uploader);
		multipartItem.url = this.address + "/answers";

		var body = JSON.stringify({"voteToken":this.voteToken, "studyPath":this.studyPath, "textAnswers":this.textAnswers, "mcAnswers":this.multipleChoiceAnswers, "deviceID":this.deviceID});
		let formData = new FormData();
		formData.append("answers-dto", body);

		if(this.answerFiles.length == 0){
			formData.append("images",  new Blob());
		}else{
			for(let i = 0; i < this.answerFiles.length; i++){
				formData.append("images",  this.answerFiles[i]);
			}
		}

		multipartItem.callback = this.uploadCallback;
		multipartItem.formData = formData;
		multipartItem.upload();
	}

	uploadCallback = (data) => {
		this.answerFiles = [];
		if (data){
			console.debug("uploadCallback() file upload successful");
		}else{
			console.error("uploadCallback() fil upload error", data);
		}
	}

	//example: addTextAnswer (3,"Welche Verbesserungsvorschläge würden Sie machen?","Antwort");
	addTextAnswer(questionID: number, questionText:string, answerText:string){
		//erase array entry if the question is answered a second time
		for (var givenAnswer of this.textAnswers) {
			if (givenAnswer['questionID'] === questionID) {
				let index = this.textAnswers.indexOf(givenAnswer);
				this.textAnswers.splice(index, 1);
			}
		}
		this.textAnswers.push({"questionID":questionID, "questionText":questionText, "answerText":answerText});
	}

	//example: addMultipleChoiceAnswer ("Ging er/sie auf Fragen innerhalb der LV ein?", "oft",2);
	addMultipleChoiceAnswer(questionText:string, choiceText:string, grade:number){
		//erase entry if question is answered a second time
		for (var givenAnswer of this.multipleChoiceAnswers) {
			if (givenAnswer['questionText'] === questionText) {
				let index = this.multipleChoiceAnswers.indexOf(givenAnswer);
				this.multipleChoiceAnswers.splice(index, 1);
			}
		}
		this.multipleChoiceAnswers.push({"questionText":questionText, "choice":{"choiceText":choiceText,"grade":grade}});
	}

	/* Example Error Data
	 {
		 "_body" : "{"message":"Invalid vote token","type":1}",
		 "status" : 400,
		 "ok" : false,
		 "statusText" : "Ok",
		 "headers" : {
			 "Cache-Control" : ["no-cache", " no-store", " max-age=0", " must-revalidate"],
			 "Pragma" : ["no-cache"],
			 "Expires" : ["0"],
			 "Content-Type" : ["application/json;charset=UTF-8"]
		 },
		 "type" : 2,
		 "url" : "http://localhost:8080/v1/questions"
	 }	*/
	private handleGetQuestionError(err) {
		console.error('There was an error: ' + err);
		let errData: GetQuestionError = <GetQuestionError>(JSON.parse(err._body));
		this.getQuestionFailedCallback(errData);
	}
}
