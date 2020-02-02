import {SimplyNote} from './simply-note'
import $ from "jquery";
import {Utils} from "./utils";

class App {
    constructor() {
        const div = $('#field');
        this.simplyNote = new SimplyNote(div, 800, 800);
        this.initEvents();
    }

    simplyNote: SimplyNote;

    initEvents() {
        $("#addButton").on("click", this.addNewNote.bind(this));
        $("#saveButton").on("click", this.saveNotes.bind(this));
        $("#loadButton").on("click", this.loadNotes.bind(this));
    }

    addNewNote() {
        const xPos = Utils.getIntValueFromHtmlElement('#xPosInput');
        const yPos = Utils.getIntValueFromHtmlElement('#yPosInput');
        const height = Utils.getIntValueFromHtmlElement('#heightInput');
        const width = Utils.getIntValueFromHtmlElement('#widthInput');
        this.simplyNote.addNote({xPos, yPos, width, height})
    }

    saveNotes() {
        this.simplyNote.saveInLocalStorage();
    }

    loadNotes() {
        this.simplyNote.loadFromLocalStorage();
    }
}

export const app = new App();
