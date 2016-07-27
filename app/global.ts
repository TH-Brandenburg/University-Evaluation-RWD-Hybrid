import { Injectable } from '@angular/core';
import {NavController} from 'ionic-angular';
import {CommentViewPage} from './pages/comment-view/comment-view';
import {QuestionsPage} from './pages/questions/questions';
import {SendViewPage} from './pages/send-view/send-view';
import {CoursesPage} from './pages/choose-course/choose-course';
import {Http, Headers, Response} from '@angular/http';
import {MultipartItem} from "./plugins/multipart-upload/multipart-item";
import {MultipartUploader} from "./plugins/multipart-upload/multipart-uploader";
import 'rxjs/add/operator/map';
import {isUndefined} from "ionic-angular/util";

export class Course {
    course: String;
    id: Number;
}

// HTTP Request Error Class
export class RequestError {
	message: string;
	type: number;
}

// Survey
export class QuestionsDTO {
	studyPaths: string[];
	textQuestions: TextQuestionDTO[];
	multipleChoiceQuestionDTOs: MultipleChoiceQuestionDTO[];
	textQuestionsFirst: boolean;
}

// Text Question
export class TextQuestionDTO {
	questionID: number;
	questionText: string;
	onlyNumbers: boolean;
	maxLength: number;
}

// Multiple Choice Question
export class MultipleChoiceQuestionDTO {
	question: String;
	choices: ChoiceDTO[];
}

// Answer / Choice
export class ChoiceDTO {
	choiceText: String;
	grade: Number;
}

// Survey Answer
export class AnswersDTO {
	voteToken: string;
	studyPath: string;
	textAnswers: TextAnswerDTO[] = [];
	multipleChoiceAnswers: MultipleChoiceAnswerDTO[] = [];
	deviceID: string;
}

// Text Answer
export class TextAnswerDTO {
	questionID: number;
	questionText: string;
	answerText: string;
}

// Multiple Choice Answer
export class MultipleChoiceAnswerDTO {
	questionText: string;
	choice: ChoiceDTO = new ChoiceDTO();
}

class Guid {
	static newGuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
			return v.toString(16);
		});
	}
}

@Injectable()
export class QuestionDataService{
	// Private
	private static voteToken = "1dc30a83-392f-4c06-b114-0c8aa382949c"; // TODO: null setzen
	private static deviceID = null;
	private static address = 'http://localhost:8080'; // TODO: null setzen
	private static studyPath = "Technologie- und Innovationsmanagement"; // TODO: null setzen
	private static api = "v1";
	private static http:Http;
	private static surveyAnswers: AnswersDTO = new AnswersDTO();

	// Public
	static answerFiles: String[] = [];
	static survey: QuestionsDTO;

	// Callbacks
	static getQuestionFailedCallback: (data: RequestError) => void;
	static getQuestionSucceedCallback: (data: QuestionsDTO) => void;
	static sendAnswersFailedCallback: (data: RequestError) => void;
	static sendAnswersSucceedCallback: (successMsg: String) => void; //TODO


	constructor(private http:Http){
		QuestionDataService.http = http;
	}

	static setStudyPath(studypath) {
		QuestionDataService.studyPath = studypath;
	}

	static getStudyPath() {
		return QuestionDataService.studyPath;
	}

	static setBarcodeData(barcodeString) {
		var barcodeDTO = JSON.parse(barcodeString);
		QuestionDataService.voteToken = barcodeDTO.voteToken;
		QuestionDataService.address = barcodeDTO.host;
	}

	static getQuestion(){
		this.generateDeviceIdIfNotExists();
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
		let body = JSON.stringify({"voteToken":QuestionDataService.voteToken, "deviceID":QuestionDataService.deviceID});
		let requestURI = QuestionDataService.address + '/' + QuestionDataService.api + '/questions';

		QuestionDataService.http.post(requestURI, body, { headers: headers })
		.map(res => res.json())
		.subscribe(
		  data => QuestionDataService.handleGetQuestionSuccess(data),
		  err => QuestionDataService.handleGetQuestionError(err),
		  () => console.log('Request questions completed')
		);
	}

	private static  handleGetQuestionError(err) {
		if (err._body instanceof Object) {
			console.log('QuestionDataService.handleGetQuestionError()', err);
			QuestionDataService.getQuestionFailedCallback(<RequestError>{"message": "Server not responding", "type": -1});
			return;
		}
		let errData:RequestError = <RequestError>(JSON.parse(err._body));
		QuestionDataService.getQuestionFailedCallback(errData);
	}

	private static  handleGetQuestionSuccess(data) {
		QuestionDataService.survey = data;
		QuestionDataService.getQuestionSucceedCallback(<QuestionsDTO>data);
	}

	static getQuestionTest(){
		return '{"studyPaths":["Betriebswirtschaftslehre","Security Management","Technologie- und Innovationsmanagement","Wirtschaftsinformatik"],"textQuestions":[{"questionID":19,"questionText":"Was fanden Sie positiv?","onlyNumbers":false,"maxLength":1000},{"questionID":20,"questionText":"Was fanden Sie negativ?","onlyNumbers":false,"maxLength":1000}],"multipleChoiceQuestionDTOs":[{"question":"Haben Sie die Veranstaltung regelmässig besucht?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Haben Sie Interesse an diesem Fach?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, sehr","grade":1},{"choiceText":"durchaus","grade":2},{"choiceText":"mittelmäßig","grade":3},{"choiceText":"eher nicht","grade":4},{"choiceText":"überhaupt nicht","grade":5}]},{"question":"Wie empfanden Sie das Niveau der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"zu hoch","grade":3},{"choiceText":"hoch","grade":2},{"choiceText":"angemessen","grade":1},{"choiceText":"niedrig","grade":2},{"choiceText":"zu niedrig","grade":3}]},{"question":"Wie waren Sprache und Ausdrucksweise des Dozenten/der Dozentin?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr laut, sehr deutlich","grade":1},{"choiceText":"laut, präzise","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"leise, eher undeutlich","grade":4},{"choiceText":"zu leise, undeutlich","grade":5}]},{"question":"Kann er/sie schwierige Sachverhalte verständlich erklären?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, hervorragend","grade":1},{"choiceText":"ja, fast immer","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"manchmal klappt es","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"Versuchte der/die Dozent(in) festzustellen, ob die Studenten der LV folgen können?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer Dialog mit Studenten","grade":1},{"choiceText":"überwiegend Dialog","grade":2},{"choiceText":"gute Mischung","grade":3},{"choiceText":"zu oft Monolog","grade":4},{"choiceText":"nein, nur Monolog","grade":5}]},{"question":"Ging der/die Dozent(in) auf Fragen innerhalb der LV ein?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War er/sie auch ausserhalb der LV zu diesen Themen ansprechbar?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War der/die Dozent(in) gut vorbereitet?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Welche Gesamtnote geben Sie dem/der Dozenten(in)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Welche Gesamtnote geben Sie den Lehrunterlagen?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie war die Vorgehensweise und Stoffpräsentation in der LV?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr klar","grade":1},{"choiceText":"gut strukturiert","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"sprunghaft","grade":4},{"choiceText":"Roter Faden fehlte","grade":5}]},{"question":"Wie war die Stoffmenge im Verhältnis zur verfügbaren Zeit?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Stoff","grade":1},{"choiceText":"viel Stoff","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Stoff","grade":4},{"choiceText":"sehr wenig Stoff","grade":5}]},{"question":"Die Übung war nützlich. Sie war sehr gut geeignet, die Vorlesungsinhalte zu verdeutlichen und zu vertiefen.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Wie beurteilen Sie die Ausstattung des Übungs- oder Laborraumes?","choices":[{"choiceText":"keine Ü/L vorhanden","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie beurteilen Sie den Medieneinsatz (Beamer, Tafel, Overhead-Projektor, usw.)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"viel zu viele Medien eingesetzt","grade":5},{"choiceText":"etwas zu viele Medien eingesetzt","grade":3},{"choiceText":"Medieneinsatz adäquat","grade":1},{"choiceText":"etwas zu wenige Medien eingesetzt","grade":3},{"choiceText":"viel zu wenig Medien eingesetzt","grade":5}]},{"question":"Wie beurteilen Sie Ihren persönlichen Lernerfolg in dieser Lehrveranstaltung?","choices":[{"choiceText":"weiss ich nicht","grade":0},{"choiceText":"habe sehr viel gelernt","grade":1},{"choiceText":"habe viel gelernt","grade":2},{"choiceText":"habe etwas gelernt","grade":3},{"choiceText":"habe wenig gelernt","grade":4},{"choiceText":"habe sehr wenig gelernt","grade":5}]},{"question":"Welche Gesamtnote geben Sie der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]}],"textQuestionsFirst":false}';
	}

	static setTestData(){
		QuestionDataService.survey = <QuestionsDTO>JSON.parse(QuestionDataService.getQuestionTest());
	}

	static sendAnswers(){
		this.generateDeviceIdIfNotExists();
		let url = QuestionDataService.address + "/" + QuestionDataService.api + "/answers";
		let uploader = new MultipartUploader( {"url":url,"authToken":null} );
		let multipartItem = new MultipartItem(uploader);
		multipartItem.url = url;

		let body = JSON.stringify({"voteToken":QuestionDataService.voteToken, "studyPath":QuestionDataService.studyPath, "textAnswers":QuestionDataService.surveyAnswers.textAnswers, "mcAnswers":QuestionDataService.surveyAnswers.multipleChoiceAnswers, "deviceID":QuestionDataService.deviceID});

		//test
		//let body = '{"voteToken":"'+ QuestionDataService.voteToken +'","studyPath":"Security Management","textAnswers":[{"questionID":0,"answerText":"HOLD THE DOOR!"},{"questionID":1,"answerText":"HODOR"}],"mcAnswers":[{"questionText":"Haben Sie die Veranstaltung regelmässig besucht?","choice":{"choiceText":"ja, immer","grade":1}},{"questionText":"Haben Sie Interesse an diesem Fach?","choice":{"choiceText":"durchaus","grade":2}},{"questionText":"Wie waren Sprache und Ausdrucksweise des Dozenten/der Dozentin?","choice":{"choiceText":"leise, eher undeutlich","grade":4}},{"questionText":"Kann er/sie schwierige Sachverhalte verständlich erklären?","choice":{"choiceText":"nein, nie","grade":5}},{"questionText":"Versuchte der/die Dozent(in) festzustellen, ob die Studenten der LV folgen können?","choice":{"choiceText":"keine Angabe","grade":0}},{"questionText":"Ging der/die Dozent(in) auf Fragen innerhalb der LV ein?","choice":{"choiceText":"ja, immer","grade":1}},{"questionText":"War er/sie auch ausserhalb der LV zu diesen Themen ansprechbar?","choice":{"choiceText":"ja, wenn Zeit war","grade":2}},{"questionText":"War der/die Dozent(in) gut vorbereitet?","choice":{"choiceText":"oft","grade":3}},{"questionText":"Welche Gesamtnote geben Sie dem/der Dozenten(in)?","choice":{"choiceText":"ungenügend","grade":5}},{"questionText":"Welche Gesamtnote geben Sie den Lehrunterlagen?","choice":{"choiceText":"k.A","grade":0}},{"questionText":"Wie war die Vorgehensweise und Stoffpräsentation in der LV?","choice":{"choiceText":"sehr klar","grade":1}},{"questionText":"Wie war die Stoffmenge im Verhältnis zur verfügbaren Zeit?","choice":{"choiceText":"viel Stoff","grade":2}},{"questionText":"Die Übung war nützlich. Sie war sehr gut geeignet, die Vorlesungsinhalte zu verdeutlichen und zu vertiefen.","choice":{"choiceText":"unentschieden","grade":3}},{"questionText":"Wie beurteilen Sie die Ausstattung des Übungs- oder Laborraumes?","choice":{"choiceText":"ausreichend","grade":4}},{"questionText":"Wie beurteilen Sie Ihren persönlichen Lernerfolg in dieser Lehrveranstaltung?","choice":{"choiceText":"habe etwas gelernt","grade":3}},{"questionText":"Welche Gesamtnote geben Sie der Lehrveranstaltung?","choice":{"choiceText":"befriedigend","grade":3}}],"deviceID":"123"}';

		let formData = new FormData();
		formData.append("answers-dto", body);

		if(QuestionDataService.answerFiles.length == 0){
			formData.append("images",  new Blob());
		}else{
			for(let i = 0; i < QuestionDataService.answerFiles.length; i++){
				formData.append("images",  QuestionDataService.convertImage(QuestionDataService.answerFiles[i],QuestionDataService.survey.textQuestions[i].questionText));
			}
		}

		multipartItem.callback = QuestionDataService.handleUploadCallback;
		multipartItem.formData = formData;
		multipartItem.upload();
	}

	static handleUploadCallback = (data) => {
		//QuestionDataService.answerFiles = [];
		//alert(data);
		if (data){
			let errData:RequestError = <RequestError>(JSON.parse(data));
			QuestionDataService.sendAnswersFailedCallback(errData);
		}else{
			QuestionDataService.sendAnswersFailedCallback(<RequestError>{"message": "Server not responding", "type": -1});
		}
	}

	static generateDeviceIdIfNotExists() {
		if(this.deviceID == null){
			this.deviceID = Guid.newGuid();
		}
	}

	static addTextAnswer(questionID: number, answerText:string) {
		//get question text
		let questionText;
		for (let textQuestion of QuestionDataService.survey.textQuestions) {
			if (textQuestion['questionID'] === questionID) {
				let index = QuestionDataService.survey.textQuestions.indexOf(textQuestion);
				questionText = QuestionDataService.survey.textQuestions[index].questionText;
			}
		}
		//erase array entry if the question is answered a second time
		for (let givenAnswer of QuestionDataService.surveyAnswers.textAnswers) {
			if (givenAnswer['questionID'] === questionID) {
				let index = QuestionDataService.surveyAnswers.textAnswers.indexOf(givenAnswer);
				QuestionDataService.surveyAnswers.textAnswers.splice(index, 1);
			}
		}
		QuestionDataService.surveyAnswers.textAnswers.push(<TextAnswerDTO>{"questionID":questionID, "questionText":questionText, "answerText":answerText});
	}

	static getTextAnswer(questionID: number){
		for (let givenAnswer of QuestionDataService.surveyAnswers.textAnswers) {
			if (givenAnswer['questionID'] === questionID) {
				let index = QuestionDataService.surveyAnswers.textAnswers.indexOf(givenAnswer);
				return QuestionDataService.surveyAnswers.textAnswers[index].answerText;
			}
		}
	}

	static addMultipleChoiceAnswer(questionID: number, grade:number) {
		//get question text
		let questionText = QuestionDataService.survey.multipleChoiceQuestionDTOs[questionID].question;
		//get choice text
		let choiceText;
		for (let choice of QuestionDataService.survey.multipleChoiceQuestionDTOs[questionID].choices) {
			if (choice['grade'] === grade) {
				choiceText = choice.choiceText;
			}
		}
		//erase entry if question is answered a second time
		for (let givenAnswer of QuestionDataService.surveyAnswers.multipleChoiceAnswers) {
			if (givenAnswer['questionText'] === questionText) {
				let index = QuestionDataService.surveyAnswers.multipleChoiceAnswers.indexOf(givenAnswer);
				QuestionDataService.surveyAnswers.multipleChoiceAnswers.splice(index, 1);
			}
		}
		QuestionDataService.surveyAnswers.multipleChoiceAnswers[questionID]= <MultipleChoiceAnswerDTO>{"questionText":questionText, "choice":<ChoiceDTO>{"choiceText":choiceText,"grade":grade}};
	}

	static getMultipleChoiceAnswer(questionID: number) {
		let multipleChoiceAnswer = QuestionDataService.surveyAnswers.multipleChoiceAnswers[questionID];
		if (multipleChoiceAnswer)
			return multipleChoiceAnswer.choice.grade;
		return null;
	}

  static convertImage(base64str,fileName){
    var binary = atob(base64str.replace(/\s/g, ''));
    var len = binary.length;
    var buffer = new ArrayBuffer(len);
    var view = new Uint8Array(buffer);
    for (var i = 0; i < len; i++) {
     view[i] = binary.charCodeAt(i);
    }
    var blob = new Blob( [view], { type: "application/pdf" });
    var file = this.blobToFile(blob,fileName);
    return file
    }

  static blobToFile(blob: Blob, fileName:string): File {
  var b: any = blob;
  var f: File;
  b.lastModifiedDate = new Date();
  b.name = fileName;
  return <File>blob;
  }

  static calulateNavigationPos(name,counter)
  {
    var pos = 0
    if (name == "course"){
      pos = 0
    }
    if (name == "textQuestions"){
      pos += counter + 1 ;
    }
    if (name == "multipleChoiceQuestionDTOs"){
      pos += QuestionDataService.survey.textQuestions.length + counter;
    }
    if (name == "send-view"){
      pos += QuestionDataService.survey.textQuestions.length + QuestionDataService.survey.multipleChoiceQuestionDTOs.length + 1;
    }
	//alert('counter: ' + counter + ' pos: ' + pos);
    return pos
  }
}
