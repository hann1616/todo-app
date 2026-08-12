const deleteCompletedBtn = document.getElementById("deleteCompletedBtn");
const searchInput = document.getElementById("searchInput");
const counter = document.getElementById("counter");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const message = document.getElementById("message");
const themeBtn = document.getElementById("themeBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load tasks
renderTasks();

// Delete completed tasks
deleteCompletedBtn.addEventListener("click", () => {
    const completedTasks = tasks.filter(task => task.completed);

    if (completedTasks.length === 0) {
        alert("There are no completed tasks.");
        return;
    }

    if (confirm("Delete all completed tasks?")) {
        tasks = tasks.filter(task => !task.completed);

        saveTasks();
        renderTasks();
    }
});

// Add task
addBtn.addEventListener("click", addTask);

// Search tasks
searchInput.addEventListener("input", renderTasks);

// Press Enter to add task
taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Dark Mode
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️ Light Mode";
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
    }
});

// Add Task Function
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        message.textContent = "Please enter a task.";
        return;
    }

    message.textContent = "";

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();

    taskInput.value = "";

    renderTasks();
}

// Render Tasks
function renderTasks() {
    taskList.innerHTML = "";

    // Update Counter
    const completed = tasks.filter(task => task.completed).length;
    counter.textContent = `${completed} / ${tasks.length} Completed`;

    // Empty List
    if (tasks.length === 0) {
        taskList.innerHTML = "<p>No tasks yet.</p>";
        return;
    }

    const searchText = searchInput.value.toLowerCase();

    const filteredTasks = tasks.filter(task =>
        task.text.toLowerCase().includes(searchText)
    );

    // No search results
    if (filteredTasks.length === 0) {
        taskList.innerHTML = "<p>No matching tasks found.</p>";
        return;
    }

    filteredTasks.forEach((task) => {
        const index = tasks.indexOf(task);

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <div class="actions">
                <button class="complete">✓</button>
                <button class="edit">Edit</button>
                <button class="delete">✕</button>
            </div>
        `;

        // Complete
        li.querySelector(".complete").addEventListener("click", () => {
            tasks[index].completed = !tasks[index].completed;

            saveTasks();
            renderTasks();
        });

        // Edit
        li.querySelector(".edit").addEventListener("click", () => {
            const newTask = prompt("Edit your task:", task.text);

            if (newTask === null) return;

            if (newTask.trim() === "") {
                alert("Task cannot be empty.");
                return;
            }

            tasks[index].text = newTask.trim();

            saveTasks();
            renderTasks();
        });

        // Delete
        li.querySelector(".delete").addEventListener("click", () => {
            tasks.splice(index, 1);

            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });
}

// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}