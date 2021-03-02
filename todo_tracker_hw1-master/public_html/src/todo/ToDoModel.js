'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import EditItem_Transaction from './transactions/EditItem_Transaction.js'
import ToDoView from './ToDoView.js'
import EditDate_Transaction from './transactions/EditDate_Transaction.js'
import EditStatus_Transaction from './transactions/EditStatus_Transaction.js'
import UpArrow_Transaction from './transactions/MoveItemUp_Transaction.js'
import RemoveItemTransaction from './transactions/RemoveItem_Transaction.js'
import DownArrow_Transaction from './transactions/MoveItemDown_Transaction.js'
import RemoveItem_Transaction from './transactions/RemoveItem_Transaction.js'

/**
 * ToDoModel
 * 
 * This class manages all the app data.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem);
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);

        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    /**
     * Load the items for the listId list into the UI.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) { //searching for the selected list to load
            if (this.toDoLists[i].id === listId){
                listIndex = i;
                //this.tps.clearAllTransactions();
            }
        }
        if (listIndex >= 0) {
            //REORDER THE toDOLists SO THAT THE CLICKED LIST APPEARS AT THE BEGINNING
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
            
            let temp = this.toDoLists[listIndex];
            for(let j = listIndex - 1; j >= 0; j--){
                this.toDoLists[j+1] = this.toDoLists[j]; //shift each element right once
            }
            this.toDoLists[0] = temp; //place the selected list at the front of the 
            this.view.refreshLists(this.toDoLists); //refeshes the view of all the lists
        }
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
    }   

    /**
     * Finds and then removes the current list. Provides confirmation prior to deletion.
     */
    removeCurrentList() {
        var deleteConfirmation = document.getElementById("deleteConfirmation");
        var confirm = document.getElementsByClassName("Yes")[0];
        var deny = document.getElementsByClassName("No")[0];
        deleteConfirmation.style.display = "block";

        confirm.addEventListener("click", ()=> {
            deleteConfirmation.style.display = "none";
            let indexOfList = -1;
            for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
                console.log("hello world");
                if (this.toDoLists[i].id === this.currentList.id) {
                    indexOfList = i;
                }
            }
            this.toDoLists.splice(indexOfList, 1); //at position indexOfList, remove 1 item (removes the unwanted list from the list of all lists)
            this.currentList = null; //nullifies the current list since it just got deleted
            this.view.clearItemsList(); //removes all of the unwanted list's content
            this.view.refreshLists(this.toDoLists); //refeshes the view of all the lists
            }
        );

        deny.onclick = function(){
            deleteConfirmation.style.display = "none";
        }
    }

    /**
     * Edits the task
     */
    editTask(itemID, forward) {
        var currentItem = this.currentList.getItemAtIndex(itemID); //retrieves the item to edit from the current list
        currentItem.setDescription(forward);
        this.view.viewList(this.currentList);
    }

    addEditTaskTransaction(itemID, forward, revert) {
        let transaction = new EditItem_Transaction(this, itemID, forward, revert);
        this.tps.addTransaction(transaction);
    }

    /**
     * Edits the date
     * @param {*} itemID 
     * @param {*} dateToChangeTo 
     */
    editDate(itemID, dateToChangeTo){
        var currentItem = this.currentList.getItemAtIndex(itemID); //retrieves the item to edit from the current list
        currentItem.setDueDate(dateToChangeTo);
        this.view.viewList(this.currentList);
    }

    addEditDateTransaction(itemID, newDate, oldDate){
        let transaction = new EditDate_Transaction(this, itemID, newDate, oldDate);
        this.tps.addTransaction(transaction);
    }

    /**
     * Edits the status
     * @param {*} itemID 
     * @param {*} stateToChangeTo 
     */
    editStatus(itemID, stateToChangeTo){
        var currentItem = this.currentList.getItemAtIndex(itemID); //retrieves the item to edit from the current list
        currentItem.setStatus(stateToChangeTo);
        this.view.viewList(this.currentList);
    }
    
    addEditStatusTransaction(itemID, newStatus, oldStatus){
        let transaction = new EditStatus_Transaction(this, itemID, newStatus, oldStatus);
        this.tps.addTransaction(transaction);
    }

    moveItemUp(itemID){
        var aboveItem = this.currentList.getItemAtIndex(itemID - 1);
        var item = this.currentList.getItemAtIndex(itemID);
        this.currentList.items.splice(itemID, 1, aboveItem);
        this.currentList.items.splice(itemID - 1, 1, item);
        this.view.viewList(this.currentList);
    }

    addMoveItemUpTransaction(itemID){
        let transaction = new UpArrow_Transaction(this, itemID);
        this.tps.addTransaction(transaction);
    }

    moveItemDown(itemID){
        var belowItem = this.currentList.getItemAtIndex(itemID + 1);
        var item = this.currentList.getItemAtIndex(itemID);
        this.currentList.items.splice(itemID, 1, belowItem);
        this.currentList.items.splice(itemID + 1, 1, item);
        this.view.viewList(this.currentList);
    }

    addMoveItemDownTransaction(itemID){
        let transaction = new DownArrow_Transaction(this, itemID);
        this.tps.addTransaction(transaction);
    }

    /**
     * Removes an item from the list of items
     * @param {*} itemID 
     */
    removeAnItem(itemID) {
        this.currentList.removeItem(this.currentList.items[itemID]);
        this.view.viewList(this.currentList);
    }

    removeItemTransaction(itemID){
        let transaction = new RemoveItem_Transaction(this, itemID);
        this.tps.addTransaction(transaction);
    }

    addItemBack(itemID, item){
        for(let i = this.currentList.items.length; i > itemID; i--){
            this.currentList.items[i] = this.currentList.items[i - 1];
        }
        this.currentList.items[itemID] = item;
        this.view.viewList(this.currentList);
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
    } 
}