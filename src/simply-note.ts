import $ from "jquery";
import _ from "underscore";
import {Utils} from "./utils";
import './simply-note-style.css'

export type Note = {
    width: number,
    height: number,
    xPos: number,
    yPos: number,
    zIndex?: number,
    text?: string
}

/**
 * Minimum screen size
 * and an error message if it does not match the size of the screen
 */
const screenSize = {
    height: 768,
    width: 1024,
};
const errorMessage = `your screen does not meet the required sizes: ${screenSize.width} x ${screenSize.height}`;

export class SimplyNote {
    constructor(htmlElement: JQuery<HTMLElement>, height: number, width: number) {
        if (!this.isNecessaryScreenSize()) {
            htmlElement.append(errorMessage);
            return;
        }
        htmlElement.addClass('simply-field');
        htmlElement.height(height);
        htmlElement.width(width);
        this.field = htmlElement;
    }
    field: JQuery<HTMLElement>

    addNote(note: Note) {
        const htmlNote = $("<div></div>");
        this._addDraggable(htmlNote);

        htmlNote.height(note.height);
        htmlNote.width(note.width);

        htmlNote.addClass('simply-note simply-note_standard')
        htmlNote.css("left", note.xPos);
        htmlNote.css("top", note.yPos);

        htmlNote.append(this._createTextArea(note));
        this.field.append(htmlNote);

        //Add an observer to the Note if it goes outside of the work area
        this._addObserverIntersection(htmlNote);
    }

    private _addObserverIntersection(note: JQuery<HTMLElement>) {
        const options = {
            root: this.field.get(0),
            rootMargin: '0px',
            threshold: 1.0
        }
        const observer = new IntersectionObserver(this._intersectionCallBack.bind(null, note), options);
        observer.observe(note.get(0));
    }

    private _intersectionCallBack(note: any, entries: any) {
        note.toggleClass("simply-note_trash", !entries[entries.length - 1].isIntersecting);
    }

    private _createTextArea(note: Note): JQuery<HTMLElement> {
        const textArea = $(`<textarea></textarea>`);
        textArea.addClass('simply-note__textarea')
        textArea.val(note.text);
        return textArea;
    }

    private isNecessaryScreenSize() {
        return window.screen.availHeight >= screenSize.height && window.screen.availWidth >= screenSize.width;
    }
    
    private _setOnTopElement(elem: JQuery<HTMLElement>) {
        const htmlElem = elem.get(0);
        const elements = this.field.children().toArray();
        const index = elements.indexOf(htmlElem);
        elements.splice(index, 1);
        elements.push(htmlElem);
        this.field.append(elements)
    }

    private _addDraggable(elem: JQuery<HTMLElement>) {
        // we set 'mousedown' handler only for note element, and 'mouseup' handler for root document
        // this is important if we are to move the mouse too quickly
        const root = $(document);
        let difPositionX = 0, difPositionY = 0, startPositionX = 0, startPositionY = 0;
        elem.on("mousedown", (e: any) => {
            e.preventDefault();
            startPositionX = e.clientX;
            startPositionY = e.clientY;

            // for dragging element set it on top
            this._setOnTopElement(elem);

            root.on("mouseup", () => {
                root.off("mouseup");
                root.off("mousemove");
                this._clearTrashZone();

                //focus textArea if it is clicked
                elem.children().first().trigger('focus');
            });

            root.on("mousemove", (e: any) => {
                e.preventDefault();
                // calculate the new cursor position:
                difPositionX = startPositionX - e.clientX;
                difPositionY = startPositionY - e.clientY;
                startPositionX = e.clientX;
                startPositionY = e.clientY;
                // set note new position
                elem.offset({
                        top: elem.offset().top - difPositionY,
                        left: elem.offset().left - difPositionX
                    }
                );
            });
        });
    }

    private _clearTrashZone() {
        this.field.children('.simply-note_trash').remove()
    }

    saveInLocalStorage() {
        const notes = _.map(this.field.children(), item => Utils.mapDivToNote(item));
        Utils.saveItemToLocalstorage('notes', notes);
        alert('Saved')
    }

    loadFromLocalStorage() {
        const notes = Utils.getItemFromLocalstorage('notes');
        if (!notes) {
            return;
        }
        this.field.empty();
        _.forEach(notes, item => this.addNote(item as Note));
    }

}
