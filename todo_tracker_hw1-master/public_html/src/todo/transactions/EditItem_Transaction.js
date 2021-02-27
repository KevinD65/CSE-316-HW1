'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class EditItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemID, newText, oldText) {
        super();
        this.model = initModel;
        this.id = itemID;
        this.forward = newText;
        this.revert = oldText;
    }

    doTransaction() {
        // edit the text (needs id to identify correct item to alter)
        this.model.editTask(this.id, this.forward);
    }

    undoTransaction() {
        //set the text to its previous value (nees id to identify correct item to alter)
        this.model.editTask(this.id, this.revert);
    }
}