'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class DownArrow_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemID) {
        super();
        this.model = initModel;
        this.id = itemID;
    }

    doTransaction() {
        // Move item down
        this.moveDown = this.model.moveItemDown(this.id);
    }

    undoTransaction() {
        //move the item back up
        this.model.moveItemUp(this.id + 1);
    }
}