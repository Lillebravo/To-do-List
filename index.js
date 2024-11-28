const changeNameDiv = document.querySelector(".inputNameField");
const changeNameButton = document.querySelector("#changeName");
const saveNameButton = document.querySelector("#saveName");
const addButton = document.querySelector("#addButton");

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

  newName.textContent = inputName.value;
  inputName.value = "";

  changeVisibleItems(changeNameDiv, changeNameButton);
}

function addNewTask() {
  const input = document.querySelector("#inputTask");
  const list = document.querySelector(".listOfTasks");

  if (isFormValid(input)) {
    const newTask = document.createElement("li");
    newTask.textContent = input.value;
    list.appendChild(newTask);
    input.value = "";
  } else {
    alert("You haven´t written any task");
  }
}

function isFormValid(input) {
  return input.value.trim() !== "";
}
