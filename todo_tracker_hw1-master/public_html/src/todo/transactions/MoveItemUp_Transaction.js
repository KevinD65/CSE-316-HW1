'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class UpArrow_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemID) {
        super();
        this.model = initModel;
        this.id = itemID;
    }

    doTransaction() {
        // Move item up
        this.moveUp = this.model.moveItemUp(this.id);
    }

    undoTransaction() {
        //move the item back down
        this.model.moveItemDown(this.id - 1);
    }
}