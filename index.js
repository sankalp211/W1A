const options = document.querySelectorAll(".todo-option");
const form = document.querySelector("form");
const allTab = document.getElementById("all");
const activeTab = document.getElementById("active");
const completedTab = document.getElementById("complete")
const deleteAllButton = document.getElementById("erase-button");

var tasks = [];
var task;
var nextId = 1;
var complete = false;
var currentOption = "all";

const syncStorage = () => {
  localStorage.setItem("todo", JSON.stringify(tasks));
};

const fragment = document.createDocumentFragment();

// FUNCTIONS
const addTask = (task) => {
  const taskObj = {
    id: nextId,
    task: task,
    completed: false,
  };
  nextId++;
  localStorage.setItem("nextId", nextId);
  tasks = [...tasks, taskObj];
  loadCurrentOption();
  syncStorage();
};

const loadCurrentOption = () => {
  currentOption == "all"
    ? displayAllItems(tasks)
    : currentOption == "active"
    ? displayActiveItems(tasks)
    : displayCompletedItems(tasks);
};

const generateAllItems = (arr) => {
  let returnString = '<ul class="task-list">';
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const isChecked = item.isCompleted ? "checked" : "";
    const itemStyle = item.isCompleted ? "text-decoration: line-through;" : "";
    returnString += `<li class="todo-items">
        <input type="checkbox" class="task-item-checkbox" data-id="${item.id}" onclick="handleCheckboxClick(event,'all')" ${isChecked} />
        <span class= "task-label" style="${itemStyle}">${item.task}</span>
      </li>`;
  }
  returnString += '</ul>'
  return returnString;
};

const generateActiveItems = (arr) => {
  let returnString = '<ul class="task-list">';
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].isCompleted) {
      const item = arr[i];
      const isChecked = item.isCompleted ? "checked" : "";
      const itemStyle = item.isCompleted
        ? "text-decoration: line-through;"
        : "";
      returnString += `<li class="todo-items">
        <input type="checkbox" class="task-item-checkbox" data-id="${item.id}" onclick="handleCheckboxClick(event,'active')" ${isChecked} />
        <span class= "task-label" style="${itemStyle}">${item.task}</span>
      </li>`;
    }
  }
  returnString += "</ul>"
  return returnString;
};

const generateCompletedItems = (arr) => {
  let returnString = '<ul class="task-list">';
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isCompleted) {
      const item = arr[i];
      returnString += `<li class="todo-items">
        <div class="todo-items-completed">
          <span class= "task-label" style="text-decoration: line-through;">${item.task}</span>
          <i class="ri-delete-bin-6-line" data-id="${item.id}" onclick="handleDeleteItemClick(event)"></i>
        </div>
      </li>`;
    }
  }
  returnString += "</ul>";
  return returnString;
};

const displayAllItems = (arr) => {
  document.getElementById("tasks-list").innerHTML = `
<ul class="todo-item-list">
${generateAllItems(arr)}
</ul>`;
};

const displayActiveItems = (arr) => {
  document.getElementById("tasks-list").innerHTML = `
<ul class="todo-item-list">
${generateActiveItems(arr)}
</ul>`;
};

const displayCompletedItems = (arr) => {
  document.getElementById("tasks-list").innerHTML = `
    <div style="display:flex;justify-content:left;width=100%;">
      <ul class="todo-item-list">
        ${generateCompletedItems(arr)}
      </ul>
    </div>`;
};

function handleCheckboxClick(event, calledFrom) {
  const checkbox = event.target;
  const itemId = checkbox.getAttribute("data-id");
  const item = tasks.find((item) => item.id == itemId);

  if (item) {
    item.isCompleted = !item.isCompleted;
    localStorage.setItem("todo", JSON.stringify(tasks));
    if (calledFrom === "all") {
      handleAllClick();
    } else if (calledFrom === "active") {
      handleActiveClick();
    }
  }
}

function handleAllClick() {
  options.forEach((options) =>
      options.classList.remove("todo-option--active")
    );
    form.classList.add("todo-form");
    form.classList.remove("todo-form--hidden");
    allTab.classList.add("todo-option--active")
  displayAllItems(tasks);
  deleteAllButton.classList.remove("erase-button--active")
}

function handleActiveClick() {
  options.forEach((options) =>
      options.classList.remove("todo-option--active")
    );
    form.classList.add("todo-form");
  form.classList.remove("todo-form--hidden");
    activeTab.classList.add("todo-option--active")
  displayActiveItems(tasks);
  deleteAllButton.classList.remove("erase-button--active")
}

function handleCompletedClick() {
  options.forEach((options) =>
      options.classList.remove("todo-option--active")
    );
    completedTab.classList.add("todo-option--active")
  form.classList.remove("todo-form");
  form.classList.add("todo-form--hidden");
  if (tasks.length <= 1) {
    deleteAllButton.classList.remove("erase-button--active")
  } else {
    deleteAllButton.classList.add("erase-button--active")
  }
  
  currentOption = "complete";
  displayCompletedItems(tasks);
}

function handleDeleteItemClick(event) {
  const icon = event.target;
  const itemId = icon.getAttribute("data-id");

  const itemIndex = tasks.findIndex((item) => item.id == itemId);
  if (itemIndex !== -1) {
    tasks.splice(itemIndex, 1);
    localStorage.setItem("todo", JSON.stringify(tasks));
    handleCompletedClick();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  task = form.task.value;

  if (task.trim().length > 0) {
    addTask(task);
    form.reset();
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("erase-button")) {
    handleDeleteAllClick();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("todo")) || [];
  nextId = localStorage.getItem("nextId") || 1;
  loadCurrentOption();
});

function handleDeleteAllClick() {
  tasks = tasks.filter((item) => !item.isCompleted);
  syncStorage()
  displayCompletedItems(tasks );
}

allTab.addEventListener("click", handleAllClick);
activeTab.addEventListener("click", handleActiveClick);
completedTab.addEventListener("click", handleCompletedClick);