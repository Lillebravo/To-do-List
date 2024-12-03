//Declarations
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

// Event Listeners
changeNameButton.addEventListener("click", () => {
  changeVisibleItems(changeNameButton, changeNameDiv);
});

saveNameButton.addEventListener("click", () => {
  setNewName();
});

addButton.addEventListener("click", () => {
  addNewTask();
});

document.addEventListener('DOMContentLoaded', loadData);

// Classes and methods
class Task {
  constructor(text, timestamp = Date.now(), author = null) {
    this.text = text;
    this.timestamp = timestamp;
    this.author = author || ownerName.innerHTML;
    this.element = this.createTaskElement();
  }

  formatTimestamp() {
    const date = new Date(this.timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}, ${String(date.getHours()).padStart(2, '0')}.${String(date.getMinutes()).padStart(2, '0')}`;
  }

  createTaskElement() {
    const newTask = document.createElement("li");
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task-wrapper");

    const taskText = document.createElement("span");
    const formattedTaskText = `${this.text} , By ${this.author} on ${this.formatTimestamp()}`;
    taskText.textContent = formattedTaskText;
    taskWrapper.appendChild(taskText);

    this.addOperatingButtons(taskWrapper);

    taskText.addEventListener("click", () => this.selectTask(taskWrapper));

    newTask.appendChild(taskWrapper);
    return newTask;
  }

  addOperatingButtons(taskWrapper) {
    // Checkbox
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.classList.add("taskCompleted");
    checkBox.style.display = "none";

    // Remove button
    const removeButton = document.createElement("span");
    removeButton.classList.add("material-symbols-outlined", "remove-task");
    removeButton.textContent = "delete";
    removeButton.style.display = "none";
    removeButton.style.color = "red";

    // Edit button
    const editButton = document.createElement("span");
    editButton.classList.add("material-symbols-outlined", "edit-task");
    editButton.textContent = "edit";
    editButton.style.display = "none";

    // Move up button
    const moveUpButton = document.createElement("span");
    moveUpButton.classList.add("material-symbols-outlined", "move-up-task");
    moveUpButton.textContent = "arrow_upward";
    moveUpButton.style.display = "none";

    // Move down button
    const moveDownButton = document.createElement("span");
    moveDownButton.classList.add("material-symbols-outlined", "move-down-task");
    moveDownButton.textContent = "arrow_downward";
    moveDownButton.style.display = "none";

    taskWrapper.appendChild(checkBox);
    taskWrapper.appendChild(removeButton);
    taskWrapper.appendChild(editButton);
    taskWrapper.appendChild(moveUpButton);
    taskWrapper.appendChild(moveDownButton);

    checkBox.addEventListener("click", () => this.completeTask(taskWrapper));
    removeButton.addEventListener("click", () => this.removeTask(taskWrapper));
    editButton.addEventListener("click", this.editTask(taskWrapper));
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
          ".taskCompleted, .remove-task, .edit-task, .move-up-task, .move-down-task"
        )
        .forEach((el) => {
          el.style.display = "none";
        });
    }

    taskWrapper.querySelector("span:first-child").classList.add("selectedTask");
    taskWrapper
      .querySelectorAll(
        ".taskCompleted, .remove-task, .edit-task, .move-up-task, .move-down-task"
      )
      .forEach((el) => {
        el.style.display = "inline-block";
      });
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

  removeTask(taskWrapper) {
    taskWrapper.closest("li").remove();

    if (list.children.length === 0) {
      list.style.display = "none";
      document.querySelector("#tasksHeader").style.display = "none";
    }
    saveTasks();
  }

  editTask(taskWrapper) {
    
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
}

// Functions
function saveTasks() {
  const tasks = Array.from(list.children).map((li) => {
    const taskText = li.querySelector(".task-wrapper span:first-child").textContent;
    const [originalText, authorInfo] = taskText.split(' , By ');
    const [author, timestampText] = authorInfo.split(' on ');
    
    const originalTimestamp = new Date(timestampText.replace('.', ':')).getTime();
    
    return { 
      text: originalText, 
      timestamp: originalTimestamp,
      author: author
    };
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

// You should be able to edit a todo in place.

// You should be able to sort the todos after timestamp or author. Timestamp should be the default sorting.