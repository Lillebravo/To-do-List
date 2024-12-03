//Declarations
let ownerName = document.querySelector("#ownerName");
const changeNameDiv = document.querySelector(".inputNameField");
const changeNameButton = document.querySelector("#changeName");
const saveNameButton = document.querySelector("#saveName");
const addButton = document.querySelector("#addButton");
const list = document.querySelector(".listOfTasks");
const tasksHeader = document.querySelector("#tasksHeader");
const completedTasksHeader = document.querySelector("#completedTasksHeader");
const sortButton = document.querySelector("#sortButton");

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

sortButton.addEventListener("click", () => sortTasks());

document.addEventListener("DOMContentLoaded", loadData);

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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}, ${String(
      date.getHours()
    ).padStart(2, "0")}.${String(date.getMinutes()).padStart(2, "0")}`;
  }

  createTaskElement() {
    const newTask = document.createElement("li");
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task-wrapper");

    const taskText = document.createElement("span");
    const formattedTaskText = `${this.text} , By ${
      this.author
    } on ${this.formatTimestamp()}`;
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
    removeButton.setAttribute("data-tooltip", "Delete this task?");
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
    editButton.addEventListener("click", () => this.editTask(taskWrapper));
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
    let newTaskSpan = taskWrapper.querySelector("span");
    let newTaskText = prompt("What should the task be changed to?");
    if (isInputValid(newTaskText) && !isInputDuplicate(newTaskText)) {
      this.text = newTaskText;
      this.author = ownerName.innerHTML;
      this.timestamp = Date.now();

      newTaskSpan.textContent = `${this.text} , By ${
        this.author
      } on ${this.formatTimestamp()}`;

      saveTasks();
    } else if (isInputDuplicate(newTaskText)) {
      alert("That task already exists");
    }
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
    const taskText = li.querySelector(
      ".task-wrapper span:first-child"
    ).textContent;
    const [originalText, authorInfo] = taskText.split(" , By ");
    const [author, timestampText] = authorInfo.split(" on ");

    const originalTimestamp = new Date(
      timestampText.replace(".", ":")
    ).getTime();

    return {
      text: originalText,
      timestamp: originalTimestamp,
      author: author,
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

    storedTasks.forEach((taskData) => {
      const task = new Task(taskData.text, taskData.timestamp, taskData.author);
      list.appendChild(task.element);
    });
  }
}

function addNewTask() {
  const input = document.querySelector("#inputTask");

  if (isInputValid(input) && !isInputDuplicate(input)) {
    tasksHeader.style.display = "block";
    list.style.display = "block";

    const newTask = new Task(input.value);
    list.appendChild(newTask.element);
    input.value = "";

    saveTasks(); // Save tasks to local storage
  } else if (isInputDuplicate(input)) {
    input.value = "";
    alert("That task already exists");
  }
}

function sortTasks() {
  const selectedSort = document.querySelector("#sortSelector");
  const tasks = Array.from(list.children);

  if (selectedSort.value === "selectSort") {
    alert("You have to select a sorting method");
    return;
  }

  tasks.sort((a, b) => {
    const taskAText = a.querySelector(
      ".task-wrapper span:first-child"
    ).textContent;
    const taskBText = b.querySelector(
      ".task-wrapper span:first-child"
    ).textContent;

    if (selectedSort.value === "timeStamp") {
      // Extract timestamp string and parse it
      const timestampAStr = taskAText.split(" on ")[1];
      const timestampBStr = taskBText.split(" on ")[1];

      // Replace '.' with ':' to match the date format
      const timestampA = new Date(timestampAStr.replace(".", ":"));
      const timestampB = new Date(timestampBStr.replace(".", ":"));

      return timestampA - timestampB;
    } else if (selectedSort.value === "author") {
      const authorA = taskAText.split(" , By ")[1].split(" on ")[0];
      const authorB = taskBText.split(" , By ")[1].split(" on ")[0];
      return authorA.localeCompare(authorB);
    }
  });

  // Clear the current list
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  // Add the newly sorted tasks to the list
  tasks.forEach((task) => list.appendChild(task));

  saveTasks();
}

function changeVisibleItems(itemCurrentlyVisible, itemToMakeVisible) {
  itemCurrentlyVisible.style.display = "none";
  itemToMakeVisible.style.display = "block";
}

function setNewName() {
  const inputName = document.querySelector("#inputName");

  if (inputName.value === ownerName.innerHTML) {
    alert("That is the same name!");
    inputName.value = "";
    changeVisibleItems(changeNameDiv, changeNameButton);
  } else if (isInputValid(inputName)) {
    ownerName.innerHTML = inputName.value;
    localStorage.setItem("ownerName", ownerName.innerHTML);
    inputName.value = "";
    changeVisibleItems(changeNameDiv, changeNameButton);
  }
}

function isInputValid(input) {
  let isValid = true;

  for (let i = 0; i < list.children.length; i++) {
    const element = list.children[i];

    if (input instanceof HTMLElement) {
      if (input.value === "" || input.value === null) {
        isValid = false;
        alert("You didn´t write anything");
        break;
      }
    } else {
      if (input === "" || input === null) {
        isValid = false;
        alert("You didn´t write anything");
        break;
      }
    }
  }

  return isValid;
}

function isInputDuplicate(input) {
  let isDuplicate = false;

  for (let i = 0; i < list.children.length; i++) {
    const element = list.children[i];

    if (input instanceof HTMLElement) {
      if (
        input.value.trim() ===
        element
          .querySelector("span:first-child")
          .textContent.split(" , By ")[0]
          .trim()
      ) {
        isDuplicate = true;
        break;
      }
    } else {
      if (
        input.trim() ===
        element
          .querySelector("span:first-child")
          .textContent.split(" , By ")[0]
          .trim()
      ) {
        isDuplicate = true;
        break;
      }
    }
  }

  return isDuplicate;
}
