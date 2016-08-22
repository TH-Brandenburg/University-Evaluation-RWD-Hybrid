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
declare var JSZip:any;


export class Course {
    course: String;
    id: Number;
}

// HTTP Request Response Class
export class RequestResponse {
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
	private static voteToken = null;
	private static deviceID = null;
	private static address = null;
	private static studyPath = null;
	private static api = "v1";
	private static http:Http;
	private static surveyAnswers: AnswersDTO = new AnswersDTO();

	// Public
	static answerFiles: String[] = [];
	static survey: QuestionsDTO = new QuestionsDTO();

	// Callbacks
	static getQuestionsFailedCallback: (data: RequestResponse) => void;
	static getQuestionsSucceedCallback: (data: QuestionsDTO) => void;
	static sendAnswersFailedCallback: (data: RequestResponse) => void;
	static sendAnswersSucceedCallback: (successMsg: RequestResponse) => void;


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
		try {
			var barcodeDTO = JSON.parse(barcodeString);
			QuestionDataService.voteToken = barcodeDTO.voteToken;
			QuestionDataService.address = barcodeDTO.host;
			return true;
		} catch(e) {
			return false;
		}
	}

	static getQuestions(){
		QuestionDataService.generateDeviceIdIfNotExists();
		let headers = new Headers();
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
			QuestionDataService.getQuestionsFailedCallback(<RequestResponse>{"message": "Server not responding", "type": -1});
		} else {
			let errData:RequestResponse = <RequestResponse>(JSON.parse(err._body));
			QuestionDataService.getQuestionsFailedCallback(errData);
		}
	}

	private static  handleGetQuestionSuccess(data) {
		let questionsDTO = <QuestionsDTO>data;
		QuestionDataService.survey = questionsDTO;
		QuestionDataService.getQuestionsSucceedCallback(questionsDTO);
	}

  static generateMultipartItem(){
		var uploader = new MultipartUploader(QuestionDataService.address);
		var multipartItem = new MultipartItem(uploader);
	  	let url = QuestionDataService.address + "/" + QuestionDataService.api + "/answers";
		uploader = new MultipartUploader(url);
		uploader.url = url;
		multipartItem = new MultipartItem(uploader);
		multipartItem.url = url;
		var body = JSON.stringify({"voteToken":QuestionDataService.voteToken, "studyPath":QuestionDataService.studyPath, "textAnswers":QuestionDataService.surveyAnswers.textAnswers, "mcAnswers":QuestionDataService.surveyAnswers.multipleChoiceAnswers, "deviceID":QuestionDataService.deviceID});
		if (multipartItem == null){
			multipartItem = new MultipartItem(uploader);
		}
		if (multipartItem.formData == null){
			multipartItem.formData = new FormData();
		}
	  	multipartItem.callback = QuestionDataService.handleUploadCallback;
		multipartItem.formData.append("answers-dto",  body);
		return multipartItem;
}

static sendAnswers(){
  var multipartItem = QuestionDataService.generateMultipartItem();
  if(QuestionDataService.answerFiles == null || QuestionDataService.answerFiles == undefined || QuestionDataService.answerFiles.length == 0){
    var blob = new Blob();
    multipartItem.formData.append("images",  blob);
    multipartItem.upload();
  }else{
    var blob:Blob;
    var zip = new JSZip();
    var img = zip.folder("images");
    for(let i = 0; i < QuestionDataService.answerFiles.length; i++){
      img.file(i + ".png", QuestionDataService.answerFiles[i]);
    }
    zip.generateAsync({type : "blob"}).then(function(content){
      var blob:Blob = content;
      multipartItem.formData.append("images", blob);
	  multipartItem.callback = (data) => { QuestionDataService.handleUploadCallback(data) };
      multipartItem.upload();
    });
  }
  return multipartItem;
}

	private static handleUploadCallback = (data) => {
		console.log("handleUploadCallback:", data);
		if (data){
			let response:RequestResponse = <RequestResponse>(JSON.parse(data));
			if(response.type == 2) { //type 2 is de.thb.ue.dto.util.ErrorType.ANSWERS_SUCCESSFULLY_ADDED
				QuestionDataService.sendAnswersSucceedCallback(response);
			} else {
				QuestionDataService.sendAnswersFailedCallback(response);
			}
		}else{
			QuestionDataService.sendAnswersFailedCallback(<RequestResponse>{"message": "Server not responding", "type": -1});
		}
	}

	private static generateDeviceIdIfNotExists() {
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

	private static convertImage(base64str,fileName){
		let binary = atob(base64str.replace(/\s/g, ''));
		let len = binary.length;
		let buffer = new ArrayBuffer(len);
		let view = new Uint8Array(buffer);
		for (let i = 0; i < len; i++) {
			 view[i] = binary.charCodeAt(i);
		}
		let blob = new Blob( [view], { type: "application/pdf" });
		return blob
	}

	static calulateNavigationPos(name,counter)
	{
		let pos = 0;
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

	// TEST METHOD
	static setTestData(){
		let dataString = '{"studyPaths":["Betriebswirtschaftslehre","Security Management","Technologie- und Innovationsmanagement","Wirtschaftsinformatik"],"textQuestions":[{"questionID":19,"questionText":"Was fanden Sie positiv?","onlyNumbers":false,"maxLength":1000},{"questionID":20,"questionText":"Was fanden Sie negativ?","onlyNumbers":false,"maxLength":1000}],"multipleChoiceQuestionDTOs":[{"question":"Haben Sie die Veranstaltung regelmässig besucht?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Haben Sie Interesse an diesem Fach?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, sehr","grade":1},{"choiceText":"durchaus","grade":2},{"choiceText":"mittelmäßig","grade":3},{"choiceText":"eher nicht","grade":4},{"choiceText":"überhaupt nicht","grade":5}]},{"question":"Wie empfanden Sie das Niveau der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"zu hoch","grade":3},{"choiceText":"hoch","grade":2},{"choiceText":"angemessen","grade":1},{"choiceText":"niedrig","grade":2},{"choiceText":"zu niedrig","grade":3}]},{"question":"Wie waren Sprache und Ausdrucksweise des Dozenten/der Dozentin?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr laut, sehr deutlich","grade":1},{"choiceText":"laut, präzise","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"leise, eher undeutlich","grade":4},{"choiceText":"zu leise, undeutlich","grade":5}]},{"question":"Kann er/sie schwierige Sachverhalte verständlich erklären?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, hervorragend","grade":1},{"choiceText":"ja, fast immer","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"manchmal klappt es","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"Versuchte der/die Dozent(in) festzustellen, ob die Studenten der LV folgen können?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer Dialog mit Studenten","grade":1},{"choiceText":"überwiegend Dialog","grade":2},{"choiceText":"gute Mischung","grade":3},{"choiceText":"zu oft Monolog","grade":4},{"choiceText":"nein, nur Monolog","grade":5}]},{"question":"Ging der/die Dozent(in) auf Fragen innerhalb der LV ein?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War er/sie auch ausserhalb der LV zu diesen Themen ansprechbar?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War der/die Dozent(in) gut vorbereitet?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Welche Gesamtnote geben Sie dem/der Dozenten(in)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Welche Gesamtnote geben Sie den Lehrunterlagen?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie war die Vorgehensweise und Stoffpräsentation in der LV?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr klar","grade":1},{"choiceText":"gut strukturiert","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"sprunghaft","grade":4},{"choiceText":"Roter Faden fehlte","grade":5}]},{"question":"Wie war die Stoffmenge im Verhältnis zur verfügbaren Zeit?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Stoff","grade":1},{"choiceText":"viel Stoff","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Stoff","grade":4},{"choiceText":"sehr wenig Stoff","grade":5}]},{"question":"Die Übung war nützlich. Sie war sehr gut geeignet, die Vorlesungsinhalte zu verdeutlichen und zu vertiefen.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Wie beurteilen Sie die Ausstattung des Übungs- oder Laborraumes?","choices":[{"choiceText":"keine Ü/L vorhanden","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie beurteilen Sie Ihren persönlichen Lernerfolg in dieser Lehrveranstaltung?","choices":[{"choiceText":"weiss ich nicht","grade":0},{"choiceText":"habe sehr viel gelernt","grade":1},{"choiceText":"habe viel gelernt","grade":2},{"choiceText":"habe etwas gelernt","grade":3},{"choiceText":"habe wenig gelernt","grade":4},{"choiceText":"habe sehr wenig gelernt","grade":5}]},{"question":"Welche Gesamtnote geben Sie der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]}],"textQuestionsFirst":false}';
		QuestionDataService.survey = <QuestionsDTO>JSON.parse(dataString);
	}

	// TEST METHOD
	static testGetQuestionSendAnswers(voteToken, address) {
		QuestionDataService.voteToken = voteToken;
		QuestionDataService.address = address;
		QuestionDataService.studyPath = "Technologie- und Innovationsmanagement";

		// getQuestion() POST-Request test:
		QuestionDataService.getQuestionsFailedCallback = (data: RequestResponse) => {
			console.log('getQuestion failed', data);
		};
		QuestionDataService.getQuestionsSucceedCallback = (data: QuestionsDTO) => {
			console.log('getQuestion succeed', data);
			// sendAnswers() POST-Request test:
			QuestionDataService.sendAnswersFailedCallback = (data: RequestResponse) => {
				console.log('sendAnswers failed', data);
			};
			QuestionDataService.sendAnswersSucceedCallback = (successMsg: RequestResponse) => {
				console.log('sendAnswers succeed', successMsg.message);
			};
			QuestionDataService.sendAnswers();
		};
		QuestionDataService.getQuestions();
	}
}
