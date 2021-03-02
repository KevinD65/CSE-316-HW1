'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class RemoveItem_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemID) {
        super();
        this.model = initModel;
        this.id = itemID;
    }

    doTransaction() {
        // remove item from list
        this.itemRemoved = this.model.currentList.getItemAtIndex(this.id);
        this.model.removeAnItem(this.id);
    }

    undoTransaction() {
        // re-add item to list
        this.model.addItemBack(this.id, this.itemRemoved);
    }
}