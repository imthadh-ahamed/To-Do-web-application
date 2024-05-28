document.addEventListener("DOMContentLoaded", () => {
  const taskList = document.getElementById("task-list");
  const taskForm = document.getElementById("task-form");
  const addTaskButton = document.getElementById("add-task-button");
  const saveTaskButton = document.getElementById("save-task-button");
  const cancelTaskButton = document.getElementById("cancel-task-button");
  const searchBar = document.getElementById("search-bar");
  const sortButton = document.getElementById("sort-button");
  let isEditing = false;
  let currentTaskId = null;

  addTaskButton.addEventListener("click", () => {
    taskForm.classList.toggle("hidden");
  });

  cancelTaskButton.addEventListener("click", () => {
    taskForm.classList.add("hidden");
    clearForm();
  });

  saveTaskButton.addEventListener("click", async () => {
    const title = document.getElementById("task-title").value;
    const description = document.getElementById("task-description").value;

    if (isEditing) {
      await updateTask(currentTaskId, title, description);
    } else {
      await createTask(title, description);
    }

    taskForm.classList.add("hidden");
    clearForm();
    loadTasks();
  });

  searchBar.addEventListener("input", async () => {
    const query = searchBar.value;
    const tasks = await searchTasks(query);
    displayTasks(tasks);
  });

  sortButton.addEventListener("click", async () => {
    const tasks = await getTasks();
    tasks.sort((a, b) => a.title.localeCompare(b.title));
    displayTasks(tasks);
  });

  async function loadTasks() {
    const tasks = await getTasks();
    displayTasks(tasks);
  }

  function displayTasks(tasks) {
    taskList.innerHTML = "";
    tasks.forEach((task) => {
      const taskItem = document.createElement("div");
      taskItem.classList.add("task-item");
      taskItem.innerHTML = `
        <div>
          <h3>${task.title}</h3>
          <p>${task.description}</p>
        </div>
        <div>
          <button onclick="editTask('${task._id}')">Edit</button>
          <button onclick="deleteTask('${task._id}')">Delete</button>
        </div>
      `;
      taskList.appendChild(taskItem);
    });
  }

  async function createTask(title, description) {
    await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
  }

  async function updateTask(taskId, title, description) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });
  }

  async function deleteTask(taskId) {
    await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
    });
    loadTasks();
  }

  async function getTasks() {
    const response = await fetch("/api/tasks");
    return await response.json();
  }

  async function searchTasks(query) {
    const tasks = await getTasks();
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  window.editTask = (taskId) => {
    currentTaskId = taskId;
    isEditing = true;
    fetch(`/api/tasks/${taskId}`)
      .then((response) => response.json())
      .then((task) => {
        document.getElementById("task-title").value = task.title;
        document.getElementById("task-description").value = task.description;
        taskForm.classList.remove("hidden");
      });
  };

  window.deleteTask = (taskId) => {
    deleteTask(taskId);
  };

  function clearForm() {
    document.getElementById("task-title").value = "";
    document.getElementById("task-description").value = "";
    isEditing = false;
    currentTaskId = null;
  }

  loadTasks();
});
