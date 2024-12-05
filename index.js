import { Task } from "./Task.js";
import {
  changeVisibleItems,
  setNewName,
  loadData,
  sortTasks,
  isInputValid,
  isInputDuplicate,
  saveTasks,
} from "./utilities.js";

// Declarations
let ownerName = document.querySelector("#ownerName");
const changeNameDiv = document.querySelector(".inputNameField");
const changeNameButton = document.querySelector("#changeName");
const saveNameButton = document.querySelector("#saveName");
const addButton = document.querySelector("#addButton");
const list = document.querySelector(".listOfTasks");
const tasksHeader = document.querySelector("#tasksHeader");
const completedTasksHeader = document.querySelector("#completedTasksHeader");
const sortButton = document.querySelector("#sortButton");
const inputTask = document.querySelector("#inputTask");
const inputName = document.querySelector("#inputName");
const sortSelector = document.querySelector("#sortSelector");

tasksHeader.style.display = "none";
let selectedTask = null;

// Event Listeners
changeNameButton.addEventListener("click", () => {
  changeVisibleItems(changeNameButton, changeNameDiv);
});

saveNameButton.addEventListener("click", () => {
  setNewName(inputName, ownerName, changeNameDiv, changeNameButton);
});

addButton.addEventListener("click", () => {
  addNewTask();
});

sortButton.addEventListener("click", () => sortTasks(list, sortSelector));

document.addEventListener("DOMContentLoaded", () => {
  const storedTasks = loadData(ownerName, tasksHeader, list);

  if (storedTasks.length > 0) {
    storedTasks.forEach((taskData) => {
      const timeStamp = taskData.timeStamp || Date.now();
      const task = new Task(taskData.text, timeStamp, taskData.author);
      list.appendChild(task.element);
    });
  }
});

// Functions
function addNewTask() {
  if (isInputValid(inputTask) && !isInputDuplicate(inputTask, list)) {
    tasksHeader.style.display = "block";
    list.style.display = "block";

    const newTask = new Task(inputTask.value);
    list.appendChild(newTask.element);
    inputTask.value = "";

    saveTasks(list);
  } else if (isInputDuplicate(inputTask, list)) {
    inputTask.value = "";
    alert("That task already exists");
  }
}
