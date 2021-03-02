'use strict'

/**
 * ToDoView
 * 
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");

        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button");
        listElement.appendChild(document.createTextNode(newList.name));
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        let thisModel = this.model;
        listElement.onmousedown = function() {
            thisController.handleLoadList(newList.id, "YES");
        }
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR. HIGHLIGHTS THE CURRENTLY SELECTED LIST.
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
            if(i == 0){
                document.getElementById("todo-list-" + list.id).style.backgroundColor = 'rgb(255,200,25)';
            }
            else{
                document.getElementById("todo-list-" + list.id).style.backgroundColor = 'none';
            }
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW. ASSIGNS EVENT HANDLERS TO EACH ELEMENT.
    viewList(list) {
        document.getElementById("add-list-button").style.display = "block";
        document.getElementById("undo-button").style.display = "block";
        document.getElementById("redo-button").style.display = "block";


        let myController = this.controller;
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i];

            let listItemElement = "<div id='todo-list-item-" + i/*listItem.id*/ + "' class='list-item-card'>"
                                + "<div class='task-col' id = 'description" + i + "'>" + listItem.getDescription() + "</div>"
                                + "<div class='due-date-col' id = 'date" + i + "'>" + listItem.getDueDate() + "</div>"
                                + "<div class='status-col' id = 'status" + i + "'>" + listItem.getStatus() + "</div>"
                                + "<div class='list-controls-col'>"
                                + " <div id = 'upArrow" + i + "' class='list-item-control material-icons'>keyboard_arrow_up</div>"
                                + " <div id = 'downArrow" + i + "' class='list-item-control material-icons'>keyboard_arrow_down</div>"
                                + " <div id = 'deleteButton" + i + "' class='list-item-control material-icons'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
            
        }
        
        //ASSIGNS EVENT HANDLERS TO EACH BUTTON
        for(let j = 0; j < list.items.length; j++){
            let listItem = list.items[j];

            document.getElementById("todo-list-item-" + j).onmouseover = function(event){
                document.getElementById("todo-list-item-" + j).style.backgroundColor = '#f9f7f111';
                document.getElementById("todo-list-item-" + j).onmouseout = function(event){
                    document.getElementById("todo-list-item-" + j).style.backgroundColor = '#40454e';
                }
            }
            document.getElementById("upArrow" + j).onmouseover = function(event){
                document.getElementById("upArrow" + j).style.backgroundColor = '#d9d6cc';
                document.getElementById("upArrow" + j).onmouseout = function(event){
                    document.getElementById("upArrow" + j).style.backgroundColor = '#40454e';
                }
            }
            document.getElementById("downArrow" + j).onmouseover = function(event){
                document.getElementById("downArrow" + j).style.backgroundColor = '#d9d6cc';
                document.getElementById("downArrow" + j).onmouseout = function(event){
                    document.getElementById("downArrow" + j).style.backgroundColor = '#40454e';
                }
            }
            document.getElementById("deleteButton" + j).onmouseover = function(event){
                document.getElementById("deleteButton" + j).style.backgroundColor = '#d9d6cc';
                document.getElementById("deleteButton" + j).onmouseout = function(event){
                    document.getElementById("deleteButton" + j).style.backgroundColor = '#40454e';
                }
            }

            document.getElementById("description" + j).onclick = function(event){
                let oldElement = document.getElementById("description" + j);
                let newElement = document.createElement("input");
                oldElement.replaceWith(newElement);
                newElement.setAttribute("id", "description" + j);
                newElement.type = "text";
                newElement.value = listItem.description;
                newElement.style.flexBasis = 'auto';
                newElement.focus();
                document.getElementById("add-list-button").style.color = 'grey';
                //When user clicks off of the element, change it back into a div
                document.getElementById("description" + j).onblur = function(event){
                    document.getElementById("add-list-button").style.color = 'white';
                    myController.handleEditTask(j, event.target.value, listItem.description);
                    let oldElement = document.getElementById("description" + j);
                    let newElement = document.createElement("div");
                    newElement.id = "description" + j;
                    newElement.classList.add("task-col");
                    let updatedText = document.createTextNode(listItem.getDescription());
                    newElement.appendChild(updatedText);
                    oldElement.replaceWith(newElement);
                    myController.handleLoadList(list.id, "NO");
                }
            }
                
            document.getElementById("date" + j).onclick = function(event){
                let oldElement = document.getElementById("date" + j);
                let newElement = document.createElement("input");
                oldElement.replaceWith(newElement);
                newElement.setAttribute("id", "date" + j);
                newElement.type = "date";
                newElement.defaultValue = listItem.getDueDate();
                newElement.focus();
                document.getElementById("add-list-button").style.color = 'grey';
                document.getElementById("date" + j).onblur = function(event){
                    myController.handleEditDate(j, event.target.value, listItem.getDueDate());
                    document.getElementById("add-list-button").style.color = 'white';
                    oldElement = document.getElementById("date" + j);
                    newElement = document.createElement("div");
                    newElement.id = "date" + j;
                    newElement.classList.add("due-date-col");
                    let updatedDate = document.createTextNode(listItem.getDueDate());
                    newElement.appendChild(updatedDate);
                    oldElement.replaceWith(newElement);
                    myController.handleLoadList(list.id, "NO");
                }
            }

            document.getElementById("status" + j).onclick = function(event){
                let oldElement = document.getElementById("status" + j);
                let newElement = document.createElement("select");
                oldElement.replaceWith(newElement);
                newElement.setAttribute("id", "status" + j);
                let complete = document.createElement("option");
                complete.setAttribute("value", "Complete");
                complete.innerText = "Complete";
                let incomplete = document.createElement("option");
                incomplete.setAttribute("value", "Incomplete");
                incomplete.innerText = "Incomplete";
                newElement.appendChild(complete);
                newElement.appendChild(incomplete);
                console.log(newElement);
                document.getElementById("add-list-button").style.color = 'grey';
                document.getElementById("status" + j).onblur = function(event){
                    myController.handleEditStatus(j, event.target.value, listItem.getStatus());
                    document.getElementById("add-list-button").style.color = 'white';
                    oldElement = document.getElementById("status" + j);
                    newElement = document.createElement("div");
                    newElement.id = "status" + j;
                    let updatedStatus = document.createTextNode(listItem.getStatus());
                    newElement.appendChild(updatedStatus);
                    oldElement.replaceWith(newElement);
                    myController.handleLoadList(list.id, "NO");
                }
            }

            if(j > 0){
                document.getElementById("upArrow" + j).style.color = 'white';
                document.getElementById("upArrow" + j).onclick = function(event){
                    myController.handleUpArrow(j);
                }
            }
            else{
                document.getElementById("upArrow" + j).style.color = 'grey';
            }

            if(j < list.items.length - 1){
                document.getElementById("downArrow" + j).style.color = 'white';
                document.getElementById("downArrow" + j).onclick = function(event){
                    myController.handleDownArrow(j);
                }
            }
            else{
                document.getElementById("downArrow" + j).style.color = 'grey';
            }

            document.getElementById("deleteButton" + j).onclick = function(event){
                myController.handleDelete(j);
            }
        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }

}