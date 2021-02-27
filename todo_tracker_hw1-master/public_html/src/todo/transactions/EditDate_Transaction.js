'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class EditDate_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemID, newDate, oldDate) {
        super();
        this.model = initModel;
        this.id = itemID;
        this.updatedDate = newDate;
        this.previousDate = oldDate;
    }

    doTransaction() {
        //Edit the date
        this.itemEdited = this.model.editDate(this.id, this.updatedDate);
    }

    undoTransaction() {
        //Undo edit of the date
        this.model.removeItem(this.id, this.previousDate);
    }
}