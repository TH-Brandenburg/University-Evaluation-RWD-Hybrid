import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import {MultipartItem} from "./plugins/multipart-upload/multipart-item";
import {MultipartUploader} from "./plugins/multipart-upload/multipart-uploader";
import 'rxjs/add/operator/map';
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
	grade: number;
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
	
	static getAllAnswered(){
		if(this.survey.multipleChoiceQuestionDTOs.length === this.surveyAnswers.multipleChoiceAnswers.length){
			var a = true;
			var i = 0;
			while(i < this.surveyAnswers.multipleChoiceAnswers.length) {
				if (this.surveyAnswers.multipleChoiceAnswers[i] == null) a = false;
				i++;
			}
		 	return a;
		 }
		 return false;
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
		.timeout(5000, new Error('getQuestions timed out!'))
		.map(res => res.json())
		.subscribe(
		  data => QuestionDataService.handleGetQuestionSuccess(data),
		  err => QuestionDataService.handleGetQuestionError(err),
		  () => console.log('Request questions completed')
		);
	}

	private static  handleGetQuestionError(err) {
		//console.log(err._body.constructor.name);
		let errBody = err._body;
		if (typeof errBody == 'string' || errBody instanceof String) {
			let errData:RequestResponse = <RequestResponse>(JSON.parse(errBody));
			QuestionDataService.getQuestionsFailedCallback(errData);
		} else {
			QuestionDataService.getQuestionsFailedCallback(<RequestResponse>{"message": "Server not responding", "type": -1});
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
		uploader.timeout = 5000;
		multipartItem = new MultipartItem(uploader);
		multipartItem.url = url;
		var body = JSON.stringify({"voteToken":QuestionDataService.voteToken, "studyPath":QuestionDataService.studyPath, "textAnswers":QuestionDataService.surveyAnswers.textAnswers, "mcAnswers":QuestionDataService.surveyAnswers.multipleChoiceAnswers, "deviceID":QuestionDataService.deviceID});
	  	//console.log(body);
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
  if(QuestionDataService.answerFiles.length == 0){
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

	static addTextAnswer(index: number, answerText:string) {
		//get question text
		let questionText = QuestionDataService.survey.textQuestions[index].questionText;
		//get question id
		let questionID = QuestionDataService.survey.textQuestions[index].questionID;

		QuestionDataService.surveyAnswers.textAnswers[index] = <TextAnswerDTO>{
			"questionID":questionID, "questionText":questionText, "answerText":answerText
		};
	}

	static getTextAnswer(index: number){
		if(QuestionDataService.surveyAnswers.textAnswers[index])
			return QuestionDataService.surveyAnswers.textAnswers[index].answerText;
		else
			return "";
	}

	static addMultipleChoiceAnswer(index: number, grade:number) {
		//get question text
		let questionText = QuestionDataService.survey.multipleChoiceQuestionDTOs[index].question;
		//get choice text
		let choiceText;
		for (let choice of QuestionDataService.survey.multipleChoiceQuestionDTOs[index].choices) {
			if (choice['grade'] === grade) {
				choiceText = choice.choiceText;
			}
		}

		QuestionDataService.surveyAnswers.multipleChoiceAnswers[index]= <MultipleChoiceAnswerDTO>{"questionText":questionText, "choice":<ChoiceDTO>{"choiceText":choiceText,"grade":grade}};
	}

	static getMultipleChoiceAnswer(index: number) {
		let multipleChoiceAnswer = QuestionDataService.surveyAnswers.multipleChoiceAnswers[index];
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
	static testSetAnswerData() {
		//Mltpl Choice Answers
		for (let i = 0; i < QuestionDataService.survey.multipleChoiceQuestionDTOs.length; i++) {
			QuestionDataService.addMultipleChoiceAnswer(i, 0); // 0 = "keine Angabe" Antwort
		}
		// Text Answers
		let b64image = "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";
		for (let i = 0; i < QuestionDataService.survey.textQuestions.length; i++) {
			QuestionDataService.answerFiles.push(b64image);
			QuestionDataService.addTextAnswer(i,"this is text answer "+i+" with a picture attached");
		}
	}

	// TEST METHOD
	static testGetQuestion(voteToken, address) {
		QuestionDataService.voteToken = voteToken;
		QuestionDataService.address = address;
		// getQuestion() POST-Request test:
		QuestionDataService.getQuestionsFailedCallback = (data: RequestResponse) => {
			console.log('getQuestion failed', data);
		};
		QuestionDataService.getQuestionsSucceedCallback = (data: QuestionsDTO) => {
			console.log('getQuestion succeed', data);
			QuestionDataService.studyPath = QuestionDataService.survey.studyPaths[0];
		};
		QuestionDataService.getQuestions();
	}

	// TEST METHOD
	static testGetQuestionSendAnswers(voteToken, address) {
		QuestionDataService.voteToken = voteToken;
		QuestionDataService.address = address;

		// getQuestion() POST-Request test:
		QuestionDataService.getQuestionsFailedCallback = (data: RequestResponse) => {
			console.log('getQuestion failed', data);
		};
		QuestionDataService.getQuestionsSucceedCallback = (data: QuestionsDTO) => {
			console.log('getQuestion succeed', data);
			QuestionDataService.studyPath = QuestionDataService.survey.studyPaths[0];
			// sendAnswers() POST-Request test:
			QuestionDataService.sendAnswersFailedCallback = (data: RequestResponse) => {
				console.log('sendAnswers failed', data);
			};
			QuestionDataService.sendAnswersSucceedCallback = (successMsg: RequestResponse) => {
				console.log('sendAnswers succeed', successMsg.message);
			};
			QuestionDataService.testSetAnswerData();
			QuestionDataService.sendAnswers();
		};
		QuestionDataService.getQuestions();
	}
}
