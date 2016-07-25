import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import {Headers} from '@angular/http';
import {MultipartItem} from "./plugins/multipart-upload/multipart-item";
import {MultipartUploader} from "./plugins/multipart-upload/multipart-uploader";
declare var JSZip:any;

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
	private voteToken:string = null;
	private deviceID:string = null;
	private address:string = "";
	private studyPath:string = null;
	private textAnswers = [];
	private multipleChoiceAnswers = [];
	private imageAnswers:any = [];
	private files:File[] = [];
	private questions:string = undefined;

	constructor(private http:Http){
		this.generateDeviceIdIfNotExists();
	}

	startQuestionRequest(){
		return this.http.post(this.address + "/v1/questions", {"voteToken":this.voteToken, "deviceID":this.deviceID},{})
		.map(res => res.text());
	}

	getQuestions(){
		if(this.questions){
			return this.questions;
		}else{
			return "{}";
		}
	}

	getQuestionTest(){
		return '{"studyPaths":["Betriebswirtschaftslehre","Security Management","Technologie- und Innovationsmanagement","Wirtschaftsinformatik"],"textQuestions":[{"questionID":19,"questionText":"Was fanden Sie positiv?","onlyNumbers":false,"maxLength":1000},{"questionID":20,"questionText":"Was fanden Sie negativ?","onlyNumbers":false,"maxLength":1000}],"multipleChoiceQuestionDTOs":[{"question":"Haben Sie die Veranstaltung regelmässig besucht?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Haben Sie Interesse an diesem Fach?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, sehr","grade":1},{"choiceText":"durchaus","grade":2},{"choiceText":"mittelmäßig","grade":3},{"choiceText":"eher nicht","grade":4},{"choiceText":"überhaupt nicht","grade":5}]},{"question":"Wie empfanden Sie das Niveau der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"zu hoch","grade":3},{"choiceText":"hoch","grade":2},{"choiceText":"angemessen","grade":1},{"choiceText":"niedrig","grade":2},{"choiceText":"zu niedrig","grade":3}]},{"question":"Wie waren Sprache und Ausdrucksweise des Dozenten/der Dozentin?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr laut, sehr deutlich","grade":1},{"choiceText":"laut, präzise","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"leise, eher undeutlich","grade":4},{"choiceText":"zu leise, undeutlich","grade":5}]},{"question":"Kann er/sie schwierige Sachverhalte verständlich erklären?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, hervorragend","grade":1},{"choiceText":"ja, fast immer","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"manchmal klappt es","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"Versuchte der/die Dozent(in) festzustellen, ob die Studenten der LV folgen können?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer Dialog mit Studenten","grade":1},{"choiceText":"überwiegend Dialog","grade":2},{"choiceText":"gute Mischung","grade":3},{"choiceText":"zu oft Monolog","grade":4},{"choiceText":"nein, nur Monolog","grade":5}]},{"question":"Ging der/die Dozent(in) auf Fragen innerhalb der LV ein?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War er/sie auch ausserhalb der LV zu diesen Themen ansprechbar?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"ja, wenn Zeit war","grade":2},{"choiceText":"in der Regel ja","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nein, nie","grade":5}]},{"question":"War der/die Dozent(in) gut vorbereitet?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"ja, immer","grade":1},{"choiceText":"sehr häufig","grade":2},{"choiceText":"oft","grade":3},{"choiceText":"selten","grade":4},{"choiceText":"nie","grade":5}]},{"question":"Welche Gesamtnote geben Sie dem/der Dozenten(in)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Welche Gesamtnote geben Sie den Lehrunterlagen?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie war die Vorgehensweise und Stoffpräsentation in der LV?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr klar","grade":1},{"choiceText":"gut strukturiert","grade":2},{"choiceText":"verständlich","grade":3},{"choiceText":"sprunghaft","grade":4},{"choiceText":"Roter Faden fehlte","grade":5}]},{"question":"Wie war die Stoffmenge im Verhältnis zur verfügbaren Zeit?","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"sehr viel Stoff","grade":1},{"choiceText":"viel Stoff","grade":2},{"choiceText":"optimal","grade":3},{"choiceText":"wenig Stoff","grade":4},{"choiceText":"sehr wenig Stoff","grade":5}]},{"question":"Die Übung war nützlich. Sie war sehr gut geeignet, die Vorlesungsinhalte zu verdeutlichen und zu vertiefen.","choices":[{"choiceText":"k.A","grade":0},{"choiceText":"stimme zu","grade":1},{"choiceText":"stimme eher zu","grade":2},{"choiceText":"unentschieden","grade":3},{"choiceText":"stimme eher nicht zu","grade":4},{"choiceText":"stimme nicht zu","grade":5}]},{"question":"Wie beurteilen Sie die Ausstattung des Übungs- oder Laborraumes?","choices":[{"choiceText":"keine Ü/L vorhanden","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]},{"question":"Wie beurteilen Sie den Medieneinsatz (Beamer, Tafel, Overhead-Projektor, usw.)?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"viel zu viele Medien eingesetzt","grade":5},{"choiceText":"etwas zu viele Medien eingesetzt","grade":3},{"choiceText":"Medieneinsatz adäquat","grade":1},{"choiceText":"etwas zu wenige Medien eingesetzt","grade":3},{"choiceText":"viel zu wenig Medien eingesetzt","grade":5}]},{"question":"Wie beurteilen Sie Ihren persönlichen Lernerfolg in dieser Lehrveranstaltung?","choices":[{"choiceText":"weiss ich nicht","grade":0},{"choiceText":"habe sehr viel gelernt","grade":1},{"choiceText":"habe viel gelernt","grade":2},{"choiceText":"habe etwas gelernt","grade":3},{"choiceText":"habe wenig gelernt","grade":4},{"choiceText":"habe sehr wenig gelernt","grade":5}]},{"question":"Welche Gesamtnote geben Sie der Lehrveranstaltung?","choices":[{"choiceText":"keine Angabe","grade":0},{"choiceText":"sehr gut","grade":1},{"choiceText":"gut","grade":2},{"choiceText":"befriedigend","grade":3},{"choiceText":"ausreichend","grade":4},{"choiceText":"ungenügend","grade":5}]}],"textQuestionsFirst":false}';
	}

	generateMultipartItem(){
		var uploader = new MultipartUploader(this.address);
		var multipartItem = new MultipartItem(uploader);
		uploader = new MultipartUploader(this.address + "/v1/answers");
		uploader.url = this.address + "/v1/answers";
		multipartItem = new MultipartItem(uploader);
		multipartItem.url = this.address + "/v1/answers";
		var body = JSON.stringify({"voteToken":this.voteToken, "studyPath":this.studyPath, "textAnswers":this.textAnswers, "mcAnswers":this.multipleChoiceAnswers, "deviceID":this.deviceID});
		if (multipartItem == null){
			multipartItem = new MultipartItem(uploader);
		}
		if (multipartItem.formData == null){
			multipartItem.formData = new FormData();
		}
		multipartItem.formData.append("answers-dto",  body);
		return multipartItem;
	}

	sendAnswers(){
		var multipartItem = this.generateMultipartItem();
		if(this.files == null || this.files == undefined || this.files.length == 0){
			var blob = new Blob();
			multipartItem.formData.append("images",  blob);
			multipartItem.upload();
		}else{
			var blob:Blob;
			var zip = new JSZip();
			var img = zip.folder("images");
			for(let i = 0; i < this.files.length; i++){
				img.file(i + ".png", this.files[i]);
			}
			zip.generateAsync({type : "blob"}).then(function(content){
				var blob:Blob = content;
				multipartItem.formData.append("images", blob);
				multipartItem.upload();

			});
		}
		return multipartItem;
	}

	addImageAnswer(id:any, thumbUrl:string, file:File){
		this.imageAnswers.push({"id":id, "thumbUrl":thumbUrl, "file":file});
		this.files.push(file);
	}

	addTextAnswer(questionID: number, questionText:string, answerText:string){
		// addTextAnswer(3,"Welche Verbesserungsvorschläge würden Sie machen?","Antwort");
    //erase array entry if the question is answered a second time
    for (var givenAnswer of this.textAnswers) {
      if (givenAnswer['questionID'] === questionID) {
        let index = this.textAnswers.indexOf(givenAnswer);
        this.textAnswers.splice(index, 1);
      }
    }
		this.textAnswers.push({"questionID":questionID, "questionText":questionText, "answerText":answerText});
	}

	addMultipleChoiceAnswer(questionText:string, choiceText:string, grade:number){
		// addMultipleChoiceAnswer("Ging er/sie auf Fragen innerhalb der LV ein?", "oft",2);
    //erase entry if question is answered a second time
    for (var givenAnswer of this.multipleChoiceAnswers) {
      if (givenAnswer['questionText'] === questionText) {
        let index = this.multipleChoiceAnswers.indexOf(givenAnswer);
        this.multipleChoiceAnswers.splice(index, 1);
      }
    }
		this.multipleChoiceAnswers.push({"questionText":questionText, "choice":{"choiceText":choiceText,"grade":grade}});
	}

	setVoteToken(voteToken:string){
		if(voteToken != undefined && voteToken != null && this.voteToken == null)
		this.voteToken = voteToken;
	}

	generateDeviceIdIfNotExists(){
		if(this.deviceID == null){
			var d = new Date().getTime();
			var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
				var r = (d + Math.random()*16)%16 | 0;
				d = Math.floor(d/16);
				return (c=='x' ? r : (r&0x3|0x8)).toString(16);
			});
			this.deviceID = uuid;
		}
		return this.deviceID;
	}

	setStudyPath(studyPath: string){
		this.studyPath = studyPath;
	}

	setAddress(address:string){
		if(address != undefined && address != null && this.address == "") {
			this.address = address;
		}
	}

	setQuestions(questions:string){
		this.questions = questions;
	}

	getMultipleChoiceAnswersSize(){
		return this.multipleChoiceAnswers.length;
	}

	getTextAnswersSize(){
		return this.textAnswers.length;
	}

  getMultipleChoiceAnswers(){
    return this.multipleChoiceAnswers;
  }

  getTextAnswers(){
    return this.textAnswers;
  }

  getImages(){
    return this.imageAnswers;
  }

	getImageObject(id:any){
		let image:any = undefined;
		for(let i = 0; i < this.imageAnswers.length; i++){
			let currentImageAnswer:any = this.imageAnswers[i];
			if(id == currentImageAnswer.id){
				image = currentImageAnswer;
			}
		}
		return image;
	}

	deleteImage(id:any){
		let image:any = undefined;
		for(let i = 0; i < this.imageAnswers.length; i++){
			if(id == this.imageAnswers[i].id){
				this.imageAnswers.splice(i, 1);
				this.files.splice(i, 1);
			}
		}
	}

	getTextAnswer(questionId:any){
		for (var givenAnswer of this.textAnswers) {
			if (givenAnswer['questionID'] === questionId) {
				return givenAnswer;
			}
		}
		return "";
	}

	deleteTextAnswer(questionId:any){
		let i = 0;
		for (var givenAnswer of this.textAnswers) {
			if (givenAnswer['questionID'] === questionId) {
				this.textAnswers.splice(i, 1);
			}
			i++;
		}
		return "";
	}

  checkUserLogin(){
    if(this.voteToken) {
      return true;
    }
  }

  logError(err) {
	console.error('There was an error: ' + err);
  }
}
