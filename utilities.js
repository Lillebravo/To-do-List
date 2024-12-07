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

  export function saveTasks(list) {
    const tasks = Array.from(list.children).map((li) => {
      const taskText = li.querySelector(
        ".task-wrapper span:first-child"
      ).textContent;
      
      // Split the task text to extract original components
      const [originalText, authorInfo] = taskText.split(" , By ");
      const [author, timestampText] = authorInfo.split(" on ");
  
      // Attempt to parse the timestamp in multiple formats
      let originalTimestamp;
      try {
        // Try parsing the timestamp directly
        originalTimestamp = Date.parse(timestampText.replace(".", ":"));
        
        // If parsing fails, try alternative parsing methods
        if (isNaN(originalTimestamp)) {
          // Split the timestamp components manually
          const [datePart, timePart] = timestampText.split(", ");
          const [year, month, day] = datePart.split("-").map(Number);
          const [hours, minutes] = timePart.replace(".", ":").split(":").map(Number);
          
          // Create a new Date object with parsed components
          originalTimestamp = new Date(year, month - 1, day, hours, minutes).getTime();
        }
      } catch (error) {
        // Fallback to current timestamp if all parsing methods fail
        originalTimestamp = Date.now();
      }
  
      return {
        text: originalText,
        timestamp: originalTimestamp || Date.now(),
        author: author,
      };
    });
  
    localStorage.setItem("todos", JSON.stringify(tasks));
  }

  export function loadData(ownerName, tasksHeader, list) {
    ownerName.innerHTML = localStorage.getItem("ownerName") || "No-one";
    const storedTasks = JSON.parse(localStorage.getItem("todos") || "[]");
  
    if (storedTasks.length > 0) {
      tasksHeader.style.display = "block";
      list.style.display = "block";
  
      return storedTasks.map(taskData => {
        // Ensure timestamp is a valid number
        const timestamp = typeof taskData.timestamp === 'number' 
          ? taskData.timestamp 
          : (Date.parse(taskData.timestamp) || Date.now());
  
        return {
          text: taskData.text,
          timestamp: timestamp,
          author: taskData.author
        };
      });
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
