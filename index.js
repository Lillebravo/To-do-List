const changeNameDiv = document.querySelector(".inputNameField");
const changeNameButton = document.querySelector("#changeName");
const saveNameButton = document.querySelector("#saveName");
const addButton = document.querySelector("#addButton");
const list = document.querySelector(".listOfTasks");
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

function addNewTask() {
  const input = document.querySelector("#inputTask");

  if (isInputValid(input)) {
    const newTask = document.createElement("li");
    const taskWrapper = document.createElement("div");
    taskWrapper.classList.add("task-wrapper");

    const taskText = document.createElement("span");
    taskText.textContent = input.value;
    taskWrapper.appendChild(taskText);
    
    addOperatingButtons(taskWrapper);
    
    taskText.addEventListener("click", () => selectTask(taskWrapper));

    list.appendChild(taskWrapper);
    input.value = "";
  } else {
    alert("You haven't written any task");
  }
}

function selectTask(taskWrapper) {
  if (selectedTask) {
    selectedTask.querySelector("span:first-child").style.backgroundColor = "";
    selectedTask.querySelector(".remove-task").style.display = "none";
  }

  selectedTask = taskWrapper;
  taskWrapper.querySelector("span:first-child").style.backgroundColor = "grey";
  taskWrapper.querySelector(".remove-task").style.display = "inline-block";
  taskWrapper.querySelector(".move-up-task").style.display = "inline-block";
  taskWrapper.querySelector(".move-down-task").style.display = "inline-block";
}

function removeTask(taskWrapper) {
  taskWrapper.remove();
  selectedTask = null;
}

function moveUpTask() {

}

function moveDownTask() {

}

function addOperatingButtons(taskWrapper) {
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

    taskWrapper.appendChild(removeButton);
    taskWrapper.appendChild(moveUpButton);
    taskWrapper.appendChild(moveDownButton);

    removeButton.addEventListener("click", () => removeTask(taskWrapper));
    moveUpButton.addEventListener("click", () => moveUpTask());
    moveDownButton.addEventListener("click", () => moveDownTask());
}

function isInputValid(input) {
  return input.value.trim() !== "";
}