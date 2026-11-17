import { addColumn, getColumnsByProjectId, removeColumn } from "./column.js";
import { getProjects, addProject, getProject } from "./project.js";
import { addTask, getTasks, updateTask } from "./task.js";

export function renderProjects() {
    const projectsDiv = document.getElementById("projects");
    projectsDiv.textContent = "";

    const projects = getProjects();

    projects.forEach((project) => {
        const projectBtn = document.createElement("button");
        projectBtn.textContent = project.title;
        projectBtn.dataset.id = project.id;

        projectBtn.addEventListener("click", (event) => {
            const projectId = event.currentTarget.dataset.id;
            renderProjects();
            setupContentHeader(projectId);
            setupKanban(projectId);
        });

        projectsDiv.appendChild(projectBtn);
    });
}

export function setupNewProjectBtn() {
    const projectsDiv = document.getElementById("projects");
    const newProjectBtn = document.getElementById("new-project-btn");
    const newProjectForm = createNewProjectForm();
    const projectTitleInput = newProjectForm.querySelector("input");

    newProjectBtn.addEventListener("click", () => {
        projectsDiv.appendChild(newProjectForm);
        projectTitleInput.focus();
    });

    newProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(newProjectForm);
        const projectTitle = formData.get("new-project-title").trim();

        if (!projectTitle) {
            return;
        }

        addProject(projectTitle);

        renderProjects();
        newProjectForm.reset();
    });

    newProjectForm.addEventListener("reset", () => {
        newProjectForm.remove();
    });
}

function createNewProjectForm() {
    const newProjectForm = document.createElement("form");
    newProjectForm.id = "new-project-form";

    const projectTitleInput = document.createElement("input");
    projectTitleInput.id = "new-project-title";
    projectTitleInput.name = "new-project-title";
    projectTitleInput.placeholder = "Project title...";
    projectTitleInput.required = true;

    const formActions = document.createElement("div");

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Create";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "reset";
    cancelBtn.textContent = "Cancel";

    formActions.appendChild(submitBtn);
    formActions.appendChild(cancelBtn);
    newProjectForm.appendChild(projectTitleInput);
    newProjectForm.appendChild(formActions);

    return newProjectForm;
}

function setupContentHeader(projectId) {
    const project = getProject(projectId);

    const contentHeader = document.getElementById("content-header");
    contentHeader.textContent = "";

    const heading = document.createElement("h1");
    heading.textContent = project.title;

    const newColumnBtn = document.createElement("button");
    newColumnBtn.textContent = "+ New column";
    newColumnBtn.dataset.projectId = project.id;

    newColumnBtn.addEventListener("click", () => {
        // prompt is temporary, remove later
        const columnName = prompt("Column name:");

        addColumn(columnName, project.id);

        setupKanban(projectId);
    });


    contentHeader.appendChild(heading);
    contentHeader.appendChild(newColumnBtn);
}

function setupKanban(projectId) {
    const kanbanDiv = document.getElementById("kanban");
    kanbanDiv.textContent = "";

    const columns = getColumnsByProjectId(projectId);

    columns.forEach((column) => {
        kanbanDiv.appendChild(createColumn(column));
    });
}

function createColumn(column) {
    const columnDiv = document.createElement("div");
    columnDiv.classList.add("column");

    const columnHeader = document.createElement("h2");
    columnHeader.textContent = column.title;

    const columnActionsDiv = document.createElement("div");
    columnActionsDiv.classList.add("column-actions");

    const newTaskBtn = document.createElement("button");
    newTaskBtn.textContent = "+ New task";
    newTaskBtn.addEventListener("click", () => {
        // prompt is temporary, remove later
        const title = prompt("Task title:");
        const description = prompt("Task description:");

        addTask(title, description, column.id);
        renderTasks(tasksDiv, column.id);
    });

    const removeColumnBtn = document.createElement("button");
    removeColumnBtn.textContent = "Remove column"

    removeColumnBtn.addEventListener("click", () => {
        removeColumn(column.id);
        setupKanban(column.projectId);
    });

    const tasksDiv = document.createElement("div");
    tasksDiv.classList.add("tasks");

    columnDiv.appendChild(columnHeader);
    columnDiv.appendChild(tasksDiv);
    columnActionsDiv.appendChild(newTaskBtn);
    columnActionsDiv.appendChild(removeColumnBtn);
    columnDiv.appendChild(columnActionsDiv);

    renderTasks(tasksDiv, column.id);

    return columnDiv;
}

function renderTasks(tasksDiv, columnId) {
    tasksDiv.textContent = "";

    const tasks = getTasks().filter((task) => task.columnId === columnId);

    tasks.forEach((task) => {
        tasksDiv.appendChild(createTaskCard(task));
    });
}

function createTaskCard(task) {
    const taskCard = document.createElement("div");
    taskCard.classList.add("task-card");

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description;

    const toggleDoneInput = createToggleDoneInput(task, taskCard);

    const taskContent = document.createElement("div");

    if (task.done) {
        taskCard.classList.add("completed-task-card");
        toggleDoneInput.checked = true;
    }

    taskCard.appendChild(toggleDoneInput);

    taskContent.appendChild(title);
    taskContent.appendChild(description);

    taskCard.appendChild(taskContent);

    return taskCard;
}

function createToggleDoneInput(task, taskCard) {
    const toggleDoneBtn = document.createElement("input");
    toggleDoneBtn.type = "checkbox";

    toggleDoneBtn.addEventListener("click", () => {
        task.toggleDone();

        if (task.done) {
            taskCard.classList.add("completed-task-card");
        } else {
            taskCard.classList.remove("completed-task-card");
        }

        updateTask(task);
    });

    return toggleDoneBtn;
}
