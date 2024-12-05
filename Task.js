import { isInputValid, isInputDuplicate, saveTasks } from "./utilities.js";

export class Task {
  constructor(text, timestamp = Date.now(), author = null) {
    this.text = text;
    this.timestamp = timestamp;
    this.author = author || this.getOwnerName();
    this.element = this.createTaskElement();
  }

  getOwnerName() {
    const ownerNameElement = document.querySelector("#ownerName");
    return ownerNameElement ? ownerNameElement.innerHTML : "No-one";
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
    const completedTasksHeader = document.querySelector(
      "#completedTasksHeader"
    );
    const list = document.querySelector(".listOfTasks");

    completedTasksHeader.style.display = "block";
    completedTasksList.style.display = "block";

    const completedTask = document.createElement("li");
    completedTask.textContent = taskWrapper.querySelector("span").textContent;
    completedTasksList.appendChild(completedTask);

    this.removeTask(taskWrapper);
    saveTasks(list);
  }

  removeTask(taskWrapper) {
    const list = document.querySelector(".listOfTasks");
    taskWrapper.closest("li").remove();

    if (list.children.length === 0) {
      list.style.display = "none";
      document.querySelector("#tasksHeader").style.display = "none";
    }
    saveTasks(list);
  }

  editTask(taskWrapper) {
    const list = document.querySelector(".listOfTasks");
    let newTaskSpan = taskWrapper.querySelector("span");
    let newTaskText = prompt("What should the task be changed to?");

    if (
      isInputValid(newTaskText) &&
      !isInputDuplicate(newTaskText, list)
    ) {
      this.text = newTaskText;
      this.author = this.getOwnerName();
      this.timestamp = Date.now();

      newTaskSpan.textContent = `${this.text} , By ${
        this.author
      } on ${this.formatTimestamp()}`;

      saveTasks(list);
    } else if (isInputDuplicate(newTaskText, list)) {
      alert("That task already exists");
    }
  }

  moveUpTask(taskWrapper) {
    const list = document.querySelector(".listOfTasks");
    const currentLi = taskWrapper.closest("li");
    const previousLi = currentLi.previousElementSibling;

    if (previousLi) {
      list.insertBefore(currentLi, previousLi);
    }

    saveTasks(list);
  }

  moveDownTask(taskWrapper) {
    const list = document.querySelector(".listOfTasks");
    const currentLi = taskWrapper.closest("li");
    const nextLi = currentLi.nextElementSibling;

    if (nextLi) {
      list.insertBefore(nextLi, currentLi);
    }
    saveTasks(list);
  }
}