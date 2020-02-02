import $ from "jquery";
import {Note} from "./simply-note";

export class Utils {
    static getIntValueFromHtmlElement(id: string): number {
        return parseInt($(id).val() as string);
    }

    static mapDivToNote(item: HTMLElement): Note {
        return {
            width: parseInt(item.style.width),
            height: parseInt(item.style.height),
            yPos: parseInt(item.style.top),
            xPos: parseInt(item.style.left),
            zIndex: parseInt(item.style.zIndex),
            text: (item.children[0] as HTMLTextAreaElement).value
        }
    }

    static getItemFromLocalstorage(key: string) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : undefined;
    }

    static saveItemToLocalstorage(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }
}