let ownerName = document.querySelector("#ownerName");
const changeNameDiv = document.querySelector(".inputNameField");
const changeNameButton = document.querySelector("#changeName");
const saveNameButton = document.querySelector("#saveName");
const addButton = document.querySelector("#addButton");
const list = document.querySelector(".listOfTasks");
const tasksHeader = document.querySelector("#tasksHeader");
const completedTasksHeader = document.querySelector("#completedTasksHeader");
tasksHeader.style.display = "none";
let selectedTask = null;
ownerName.innerHTML = localStorage.getItem("ownerName") || null;

changeNameButton.addEventListener("click", () => {
  changeVisibleItems(changeNameButton, changeNameDiv);
});

saveNameButton.addEventListener("click", () => {
  setNewName();
});

addButton.addEventListener("click", () => {
  addNewTask();
});

class Task {
  constructor(text) {
    this.text = text;
    this.element = this.createTaskElement();
  }

  createTaskElement() {
    const newTask = document.createElement("li");
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task-wrapper");

    const taskText = document.createElement("span");
    taskText.textContent = this.text;
    taskWrapper.appendChild(taskText);

    this.addOperatingButtons(taskWrapper);

    taskText.addEventListener("click", () => this.selectTask(taskWrapper));

    newTask.appendChild(taskWrapper);
    return newTask;
  }

  addOperatingButtons(taskWrapper) {
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.classList.add("taskCompleted");
    checkBox.style.display = "none";

    const removeButton = document.createElement("span");
    removeButton.classList.add("material-symbols-outlined", "remove-task");
    removeButton.textContent = "remove";
    removeButton.style.display = "none";
    removeButton.style.color = "red";

    const moveUpButton = document.createElement("span");
    moveUpButton.classList.add("material-symbols-outlined", "move-up-task");
    moveUpButton.textContent = "arrow_upward";
    moveUpButton.style.display = "none";

    const moveDownButton = document.createElement("span");
    moveDownButton.classList.add("material-symbols-outlined", "move-down-task");
    moveDownButton.textContent = "arrow_downward";
    moveDownButton.style.display = "none";

    taskWrapper.appendChild(checkBox);
    taskWrapper.appendChild(removeButton);
    taskWrapper.appendChild(moveUpButton);
    taskWrapper.appendChild(moveDownButton);

    checkBox.addEventListener("click", () => this.completeTask(taskWrapper));
    removeButton.addEventListener("click", () => this.removeTask(taskWrapper));
    moveUpButton.addEventListener("click", () => this.moveUpTask(taskWrapper));
    moveDownButton.addEventListener("click", () =>
      this.moveDownTask(taskWrapper)
    );
  }

  selectTask(taskWrapper) {
    const existingSelectedTask = document.querySelector(".selectedTask");
    if (existingSelectedTask) {
      existingSelectedTask.classList.remove("selectedTask");
      existingSelectedTask
        .closest(".task-wrapper")
        .querySelectorAll(
          ".taskCompleted, .remove-task, .move-up-task, .move-down-task"
        )
        .forEach((el) => {
          el.style.display = "none";
        });
    }

    taskWrapper.querySelector("span:first-child").classList.add("selectedTask");
    taskWrapper
      .querySelectorAll(
        ".taskCompleted, .remove-task, .move-up-task, .move-down-task"
      )
      .forEach((el) => {
        el.style.display = "inline-block";
      });
  }

  removeTask(taskWrapper) {
    const list = document.querySelector(".listOfTasks");
    taskWrapper.closest("li").remove();

    if (list.children.length === 0) {
      list.style.display = "none";
      document.querySelector("#tasksHeader").style.display = "none";
    }
  }

  moveUpTask(taskWrapper) {
    const list = document.querySelector(".listOfTasks");
    const currentLi = taskWrapper.closest("li");
    const previousLi = currentLi.previousElementSibling;

    if (previousLi) {
      list.insertBefore(currentLi, previousLi);
    }
  }

  moveDownTask(taskWrapper) {
    const list = document.querySelector(".listOfTasks");
    const currentLi = taskWrapper.closest("li");
    const nextLi = currentLi.nextElementSibling;

    if (nextLi) {
      list.insertBefore(nextLi, currentLi);
    }
  }

  completeTask(taskWrapper) {
    const completedTasksList = document.querySelector(".completedTasks");
    const completedTasksHeader = document.querySelector(
      "#completedTasksHeader"
    );

    completedTasksHeader.style.display = "block";
    completedTasksList.style.display = "block";

    const completedTask = document.createElement("li");
    completedTask.textContent = taskWrapper.querySelector("span").textContent;
    completedTasksList.appendChild(completedTask);

    this.removeTask(taskWrapper);
  }
}

function addNewTask() {
  const input = document.querySelector("#inputTask");

  if (isInputValid(input)) {
    const tasksHeader = document.querySelector("#tasksHeader");
    const list = document.querySelector(".listOfTasks");

    tasksHeader.style.display = "block";
    list.style.display = "block";

    const newTask = new Task(input.value);
    list.appendChild(newTask.element);
    input.value = "";
  } else {
    alert("You haven't written any task");
  }
}

function changeVisibleItems(itemCurrentlyVisible, itemToMakeVisible) {
  itemCurrentlyVisible.style.display = "none";
  itemToMakeVisible.style.display = "block";
}

function setNewName() {
  const inputName = document.querySelector("#inputName");

  if (isInputValid(inputName)) {
    ownerName.innerHTML = inputName.value;
    localStorage.setItem("ownerName", ownerName.innerHTML);
    inputName.value = "";
    changeVisibleItems(changeNameDiv, changeNameButton);
  }
}

function selectTask(taskWrapper) {
  if (selectedTask) {
    selectedTask
      .querySelector("span:first-child")
      .classList.remove("selectedTask");
    selectedTask.querySelector(".remove-task").style.display = "none";
    selectedTask.querySelector(".move-up-task").style.display = "none";
    selectedTask.querySelector(".move-down-task").style.display = "none";
    selectedTask.querySelector(".taskCompleted").style.display = "none";
  }

  selectedTask = taskWrapper;
  taskWrapper.querySelector("span:first-child").classList.add("selectedTask");
  taskWrapper.querySelector(".taskCompleted").style.display = "inline-block";
  taskWrapper.querySelector(".remove-task").style.display = "inline-block";
  taskWrapper.querySelector(".move-up-task").style.display = "inline-block";
  taskWrapper.querySelector(".move-down-task").style.display = "inline-block";
}

function isInputValid(input) {
  return input.value.trim() !== "";
}

/* function initialiseProgram() {

}

initialiseProgram(); */

// Store the todos in local storage

// An author and timestamp should be visible on every todo.

// You should be able to edit a todo in place.

// You should be able to sort the todos after timestamp or author. Timestamp should be the default sorting.
