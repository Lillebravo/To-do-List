export function changeVisibleItems(itemCurrentlyVisible, itemToMakeVisible) {
  itemCurrentlyVisible.style.display = "none";
  itemToMakeVisible.style.display = "block";
}

export function isInputValid(input) {
  const inputValue =
    input instanceof HTMLElement ? input.value.trim() : input.trim();
  if (input.value === "" || input.value === null) {
    alert("You didn't write anything");
    return false;
  }
  return true;
}

export function isInputDuplicate(input, list) {
  const inputValue =
    input instanceof HTMLElement ? input.value.trim() : input.trim();

  return Array.from(list.children).some(
    (element) =>
      inputValue ===
      element
        .querySelector("span:first-child")
        .textContent.split(" , By ")[0]
        .trim()
  );
}

export function saveTasks(list) {
  const tasks = Array.from(list.children).map((li) => {
    const taskText = li.querySelector(
      ".task-wrapper span:first-child"
    ).textContent;

    // Split the task text to extract original components
    const [originalText, authorInfo] = taskText.split(" , By ");
    const [author, timestampText] = authorInfo.split(" on ");

    // Parse the timestamp directly from the task text
    const originalTimestamp = Date.parse(timestampText.replace(".", ":"));

    return {
      text: originalText,
      timestamp: isNaN(originalTimestamp) ? Date.now() : originalTimestamp,
      author: author,
    };
  });

  localStorage.setItem("todos", JSON.stringify(tasks));
}

export function setNewName(
  inputName,
  ownerName,
  changeNameDiv,
  changeNameButton
) {
  if (inputName.value === ownerName.innerHTML) {
    alert("That is the same name!");
    inputName.value = "";
    changeVisibleItems(changeNameDiv, changeNameButton);
    return;
  }

  if (isInputValid(inputName)) {
    ownerName.innerHTML = inputName.value;
    localStorage.setItem("ownerName", ownerName.innerHTML);
    inputName.value = "";
    changeVisibleItems(changeNameDiv, changeNameButton);
  }
}

export function loadData(ownerName, tasksHeader, list) {
  ownerName.innerHTML = localStorage.getItem("ownerName") || "No-one";
  const storedTasks = JSON.parse(localStorage.getItem("todos") || "[]");

  if (storedTasks.length > 0) {
    tasksHeader.style.display = "block";
    list.style.display = "block";

    return storedTasks;
  }
  return [];
}

export function sortTasks(list, selectedSort) {
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
      const timestampAStr = taskAText.split(" on ")[1];
      const timestampBStr = taskBText.split(" on ")[1];

      const timestampA = new Date(timestampAStr.replace(".", ":"));
      const timestampB = new Date(timestampBStr.replace(".", ":"));

      return timestampA - timestampB;
    } else if (selectedSort.value === "author") {
      const authorA = taskAText.split(" , By ")[1].split(" on ")[0];
      const authorB = taskBText.split(" , By ")[1].split(" on ")[0];
      return authorA.localeCompare(authorB);
    }
  });

  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  tasks.forEach((task) => list.appendChild(task));

  saveTasks(list);
}
