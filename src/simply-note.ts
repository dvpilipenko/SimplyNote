import $ from "jquery";
import _ from "underscore";
import {Utils} from "./utils";

export type Note = {
    width: number,
    height: number,
    xPos: number,
    yPos: number,
    zIndex?: number,
    text?: string
}

/**
 * noteColor - basic color added Note
 * noteBorderColor - border Note
 * noteColorInTrashZone - color that will indicate the way out of the zone
 */
const colors = {
    noteColor: 'yellow',
    noteBorderColor: 'green',
    noteColorInTrashZone: 'red',
};

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
        htmlElement.css('border', `2px double red`);
        htmlElement.css('position', `absolute`);
        htmlElement.css('overflow', `visible`);
        htmlElement.height(height);
        htmlElement.width(width);
        this.field = {htmlElement, height, width};
    }

    field: { htmlElement: JQuery<HTMLElement>, height: number, width: number };

    addNote(note: Note) {
        const htmlNote = $("<div></div>");
        this._addDraggable(htmlNote);

        htmlNote.height(note.height);
        htmlNote.width(note.width);

        htmlNote.css("left", note.xPos);
        htmlNote.css("top", note.yPos);
        htmlNote.css('border', `1px solid ${colors.noteBorderColor}`);
        htmlNote.css('background', colors.noteColor);
        htmlNote.css('position', `absolute`);
        htmlNote.css('overflow', `hidden`);
        htmlNote.css('zIndex', note.zIndex ? note.zIndex : this._getMaxZIndex() + 1);

        htmlNote.append(this._createTextArea(note));
        this.field.htmlElement.append(htmlNote);
    }

    private _createTextArea(note: Note): JQuery<HTMLElement> {
        const textArea = $(`<textarea></textarea>`);
        textArea.val(note.text);
        textArea.css('background-color', `transparent`);
        textArea.css('height', `inherit`);
        textArea.css('width', `inherit`);
        textArea.css('border', `none`);
        textArea.css('outline', `none`);
        textArea.css('resize', `none`);
        textArea.css('overflow-y', `hidden`);
        return textArea;
    }

    private isNecessaryScreenSize() {
        return window.screen.availHeight >= screenSize.height && window.screen.availWidth >= screenSize.width;
    }

    private _addDraggable(elem: JQuery<HTMLElement>) {
        const indicateTrashZone = this._getIndicatorForTrashZone(elem);
        // we set 'mousedown' handler only for note element, and 'mouseup' handler for root document
        // this is important if we are to move the mouse too quickly
        const root = $(document);
        let difPositionX = 0, difPositionY = 0, startPositionX = 0, startPositionY = 0;
        elem.on("mousedown", (e: any) => {
            e.preventDefault();
            startPositionX = e.clientX;
            startPositionY = e.clientY;

            // for dragging element we are setting max zIndex + 1 that would raise it above all
            elem.css('zIndex', this._getMaxZIndex() + 1);

            root.on("mouseup", () => {
                root.off("mouseup");
                root.off("mousemove");
                if (this._inTrashZone(elem)) {
                    elem.remove();
                }
                this._optimizeZIndex();

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
                //when the note is out of field, to paint it in the appropriate color
                indicateTrashZone();
            });

        });
    }

    private _getIndicatorForTrashZone(elem: JQuery<HTMLElement>) {
        return _.debounce(() => {
            elem.css('background', this._inTrashZone(elem) ?
                colors.noteColorInTrashZone : colors.noteColor);
        }, 50);
    }

    private _inTrashZone(elem: JQuery<HTMLElement>) {
        const offset = elem.offset();
        return offset.left > this.field.width || offset.top > this.field.height || offset.top < 0 || offset.left < 0;
    }

    /**
     * Optimize ZIndex, necessary because often dragging them could theoretically increase to infinity
     */
    private _optimizeZIndex() {
        let zIndex = 1;
        const sortedByZIndex = _.sortBy(this.field.htmlElement.children(), item => parseInt(item.style.zIndex));
        sortedByZIndex.forEach(item => item.style.zIndex = (zIndex++).toString())
    }

    private _getMaxZIndex(): number {
        const elem = _.max(this.field.htmlElement.children(), item => parseInt(item.style.zIndex));
        return !_.isEmpty(elem) ? parseInt(elem.style.zIndex) : 0;
    }

    saveInLocalStorage() {
        const notes = _.map(this.field.htmlElement.children(), item => Utils.mapDivToNote(item));
        Utils.saveItemToLocalstorage('notes', notes);
        alert('Saved')
    }

    loadFromLocalStorage() {
        const notes = Utils.getItemFromLocalstorage('notes');
        if (!notes) {
            return;
        }
        this.field.htmlElement.empty();
        _.forEach(notes, item => this.addNote(item as Note));
    }

}
