let tasks = [];

function addTask() {
    const title = document.getElementById("taskTitle").value;
    const priority = document.getElementById("priority").value;
    const deadline = document.getElementById("deadline").value;

    if (!title || !deadline) {
        alert("Please enter title and deadline.");
        return;
    }

    tasks.push({
        id: Date.now(),
        title,
        priority,
        deadline,
        completed: false
    });

    document.getElementById("taskTitle").value = "";
    document.getElementById("deadline").value = "";
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const statusFilter = document.getElementById("statusFilter").value;
    const priorityFilter = document.getElementById("priorityFilter").value;

    const now = new Date();

    tasks
        .filter(task => {
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "completed" && task.completed) ||
                (statusFilter === "pending" && !task.completed);
            const matchPriority =
                priorityFilter === "all" || task.priority === priorityFilter;
            return matchStatus && matchPriority;
        })
        .forEach(task => {
            const taskEl = document.createElement("div");
            taskEl.className = "task";

            const taskDate = new Date(task.deadline);
            let statusText = "";

            if (task.completed) {
                statusText = `<span class="meta">Completed</span>`;
            } else if (taskDate < now) {
                statusText = `<span class="meta overdue">Overdue</span>`;
            } else {
                const daysLeft = Math.ceil(
                    (taskDate - now) / (1000 * 60 * 60 * 24)
                );
                statusText = `<span class="meta upcoming">Due in ${daysLeft} days</span>`;
            }

            taskEl.innerHTML = `
        <div class="task-info">
          <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id})" />
          <div>
            <div>${task.title}</div>
            <div class="meta">
              <span class="priority">${task.priority}</span> |
              ${task.deadline} |
              ${statusText}
            </div>
          </div>
        </div>
        <div class="task-actions">
          <i onclick="editTask(${task.id})">✏️</i>
          <i onclick="deleteTask(${task.id})">🗑️</i>
        </div>
      `;

            taskList.appendChild(taskEl);
        });
}

function toggleComplete(id) {
    tasks = tasks.map(task =>
        task.id === id ? {
            ...task,
            completed: !task.completed
        } : task
    );
    renderTasks();
}

function deleteTask(id) {
    if (confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        document.getElementById("taskTitle").value = task.title;
        document.getElementById("priority").value = task.priority;
        document.getElementById("deadline").value = task.deadline;
        deleteTask(id);
    }
}

function filterTasks() {
    renderTasks();
}

renderTasks();
