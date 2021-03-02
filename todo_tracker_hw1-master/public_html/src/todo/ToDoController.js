'use strict'

/**
 * ToDoController
 * 
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            if(document.getElementById("add-list-button").style.color != 'grey'){
                appModel.addNewList();
                appModel.tps.clearAllTransactions();
            }
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            appModel.removeCurrentList();
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
    }

    //PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON AN ITEM TASK TO EDIT
    handleEditTask(itemId, forward, revert){
        this.model.addEditTaskTransaction(itemId, forward, revert);
    }

    handleEditDate(itemId, newDate, oldDate){
        this.model.addEditDateTransaction(itemId, newDate, oldDate);
    }

    handleEditStatus(itemId, newStatus, oldStatus){
        this.model.addEditStatusTransaction(itemId, newStatus, oldStatus);
    }

    handleUpArrow(itemId){
        this.model.addMoveItemUpTransaction(itemId);
    }

    handleDownArrow(itemId){
        this.model.addMoveItemDownTransaction(itemId);
    }

    handleDelete(itemId){
        this.model.removeItemTransaction(itemId);
    }
}