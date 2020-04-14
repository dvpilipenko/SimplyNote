import $ from "jquery";
import {Note} from "./simply-note";

export class Utils {
    static getIntValueFromHtmlElement(id: string): number {
        return Number($(id).val() as string);
    }

    static mapDivToNote(item: HTMLElement): Note {
        return {
            width: Number(item.style.width),
            height: Number(item.style.height),
            yPos: Number(item.style.top),
            xPos: Number(item.style.left),
            zIndex: Number(item.style.zIndex),
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