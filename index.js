const changeNameDiv = document.querySelector(".inputNameField");
const changeNameButton = document.querySelector("#changeName");
const saveNameButton = document.querySelector("#saveName");
const addButton = document.querySelector("#addButton");
const list = document.querySelector(".listOfTasks");
const tasksHeader = document.querySelector("#tasksHeader");
const completedTasksHeader = document.querySelector("#completedTasksHeader");
tasksHeader.style.display = "none";
let selectedTask = null;

changeNameButton.addEventListener("click", () => {
  changeVisibleItems(changeNameButton, changeNameDiv);
});

saveNameButton.addEventListener("click", () => {
  setNewName();
});

addButton.addEventListener("click", () => {
  addNewTask();
});

function changeVisibleItems(itemCurrentlyVisible, itemToMakeVisible) {
  itemCurrentlyVisible.style.display = "none";
  itemToMakeVisible.style.display = "block";
}

function setNewName() {
  const inputName = document.querySelector("#inputName");
  const newName = document.querySelector("#ownerName");

  if (isInputValid(inputName)) {
    newName.textContent = inputName.value;
    inputName.value = "";
    changeVisibleItems(changeNameDiv, changeNameButton);
  }
}

function selectTask(taskWrapper) {
  if (selectedTask) {
    selectedTask.querySelector("span:first-child").style.backgroundColor = "";
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

function addNewTask() {
  const input = document.querySelector("#inputTask");

  if (isInputValid(input)) {
    tasksHeader.style.display = "block";
    list.style.display = "block";

    const newTask = document.createElement("li");
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task-wrapper");

    const taskText = document.createElement("span");
    taskText.textContent = input.value;
    taskWrapper.appendChild(taskText);

    addOperatingButtons(taskWrapper);

    taskText.addEventListener("click", () => selectTask(taskWrapper));

    newTask.appendChild(taskWrapper);
    list.appendChild(newTask);
    input.value = "";
  } else {
    alert("You haven't written any task");
  }
}

function removeTask(taskWrapper) {
  taskWrapper.closest("li").remove();
  selectedTask = null;

  if (list.children.length == 0) {
    list.style.display = "none";
    tasksHeader.style.display = "none";
  }
}

function moveUpTask(taskWrapper) {
  const currentLi = taskWrapper.closest("li");
  const previousLi = currentLi.previousElementSibling;

  if (previousLi) {
    list.insertBefore(currentLi, previousLi);
  }
}

function moveDownTask(taskWrapper) {
  const currentLi = taskWrapper.closest("li");
  const nextLi = currentLi.nextElementSibling;

  if (nextLi) {
    list.insertBefore(nextLi, currentLi);
  }
}

function completeTask(taskWrapper) {
  selectedTask = null;
  completedTasksHeader.style.display = "block";
  const completedTasksList = document.querySelector(".completedTasks");
  completedTasksList.style.display = "block";

  const completedTask = document.createElement("li");
  completedTask.textContent = taskWrapper.querySelector("span").textContent;
  completedTasksList.appendChild(completedTask);
  removeTask(taskWrapper);
}

function addOperatingButtons(taskWrapper) {
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

  checkBox.addEventListener("click", () => completeTask(taskWrapper));
  removeButton.addEventListener("click", () => removeTask(taskWrapper));
  moveUpButton.addEventListener("click", () => moveUpTask(taskWrapper));
  moveDownButton.addEventListener("click", () => moveDownTask(taskWrapper));
}

function isInputValid(input) {
  return input.value.trim() !== "";
}
