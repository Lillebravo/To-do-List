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

class Task {
  constructor(text, timestamp = Date.now()) {
    this.text = text;
    this.timestamp = timestamp;
    this.element = this.createTaskElement();
    this.author = ownerName;
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
    removeButton.textContent = "delete";
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
    taskWrapper.closest("li").remove();

    if (list.children.length === 0) {
      list.style.display = "none";
      document.querySelector("#tasksHeader").style.display = "none";
    }
    saveTasks();
  }

  moveUpTask(taskWrapper) {
    const currentLi = taskWrapper.closest("li");
    const previousLi = currentLi.previousElementSibling;

    if (previousLi) {
      list.insertBefore(currentLi, previousLi);
    }

    saveTasks();
  }

  moveDownTask(taskWrapper) {
    const currentLi = taskWrapper.closest("li");
    const nextLi = currentLi.nextElementSibling;

    if (nextLi) {
      list.insertBefore(nextLi, currentLi);
    }
    saveTasks();
  }

  completeTask(taskWrapper) {
    const completedTasksList = document.querySelector(".completedTasks");

    completedTasksHeader.style.display = "block";
    completedTasksList.style.display = "block";

    const completedTask = document.createElement("li");
    completedTask.textContent = taskWrapper.querySelector("span").textContent;
    completedTasksList.appendChild(completedTask);

    this.removeTask(taskWrapper);
    saveTasks();
  }
}

changeNameButton.addEventListener("click", () => {
  changeVisibleItems(changeNameButton, changeNameDiv);
});

saveNameButton.addEventListener("click", () => {
  setNewName();
});

addButton.addEventListener("click", () => {
  addNewTask();
});

function saveTasks() {
  const tasks = Array.from(list.children).map(li => {
    const taskText = li.querySelector(".task-wrapper span:first-child").textContent;
    return { text: taskText, timestamp: Date.now(), author: ownerName.innerHTML };
  });
  localStorage.setItem("todos", JSON.stringify(tasks));
}

function loadData() {
  ownerName.innerHTML = localStorage.getItem("ownerName") || "No-one";
  const storedTasks = JSON.parse(localStorage.getItem("todos") || "[]");
  
  if (storedTasks.length > 0) {
    tasksHeader.style.display = "block";
    list.style.display = "block";

    storedTasks.forEach(taskData => {
      const task = new Task(taskData.text, taskData.timestamp, taskData.author);
      list.appendChild(task.element);
    });
  }
}

function addNewTask() {
  const input = document.querySelector("#inputTask");

  if (isInputValid(input)) {
    tasksHeader.style.display = "block";
    list.style.display = "block";

    const newTask = new Task(input.value);
    list.appendChild(newTask.element);
    input.value = "";

    saveTasks(); // Save tasks to local storage
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

function isInputValid(input) {
  return input.value.trim() !== "";
}

document.addEventListener('DOMContentLoaded', loadData);

// An author and timestamp should be visible on every todo.

// You should be able to edit a todo in place.

// You should be able to sort the todos after timestamp or author. Timestamp should be the default sorting.
