'use strict'

// IMPORT ALL THE THINGS NEEDED FROM OTHER JAVASCRIPT SOURCE FILES
import { jsTPS_Transaction } from "../../common/jsTPS.js"

// THIS TRANSACTION IS FOR ADDING A NEW ITEM TO A TODO LIST
export default class EditStatus_Transaction extends jsTPS_Transaction {
    constructor(initModel, itemID, newState, oldState) {
        super();
        this.id = itemID;
        this.updatedState = newState;
        this.previousState = oldState;
        this.model = initModel;
    }

    doTransaction() {
        // update the state
        this.state = this.model.editStatus(this.id, this.updatedState);
    }

    undoTransaction() {
        //undo the update to the state
        this.model.editStatus(this.id, this.previousState);
    }
}