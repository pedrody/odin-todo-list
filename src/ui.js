import trashIcon from "./trash.svg";
import pencilIcon from "./pencil.svg";
import { addColumn, getColumnsByProjectId, removeColumn, updateColumn } from "./column.js";
import { getProjects, addProject, getProject, removeProject, updateProject, getProjectByTaskId } from "./project.js";
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

function createEditProjectForm(project) {
    const editProjectForm = document.createElement("form");
    editProjectForm.id = "edit-project-form";

    const newProjectTitleInput = document.createElement("input");
    newProjectTitleInput.id = "new-project-title";
    newProjectTitleInput.name = "new-project-title";
    newProjectTitleInput.placeholder = "New project title...";
    newProjectTitleInput.value = project.title;
    newProjectTitleInput.required = true;

    const formActions = document.createElement("div");

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Confirm";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "reset";
    cancelBtn.textContent = "Cancel";

    editProjectForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(editProjectForm);
        const newProjectTitle = formData.get("new-project-title").trim();

        if (!newProjectTitle) {
            return;
        }

        project.title = newProjectTitle;
        updateProject(project.id, project);

        editProjectForm.reset();
        renderProjects();
        setupContentHeader(project.id);
    });

    editProjectForm.addEventListener("reset", () => {
        setupContentHeader(project.id);
    });

    formActions.appendChild(submitBtn);
    formActions.appendChild(cancelBtn);
    editProjectForm.appendChild(newProjectTitleInput);
    editProjectForm.appendChild(formActions);

    return editProjectForm;
}

function renderHomepage() {
    const contentHeader = document.getElementById("content-header");
    contentHeader.textContent = "";

    const kanbanDiv = document.getElementById("kanban");
    kanbanDiv.textContent = "";

    const contentHeading = document.createElement("h1");

    contentHeading.textContent = "Odin Todo List";
    contentHeader.appendChild(contentHeading);
}

function createNewColumnForm(projectId) {
    const form = document.createElement("form");
    form.id = "new-column-form";

    const titleInput = document.createElement("input");
    titleInput.id = "new-column-input";
    titleInput.name = "new-column-input";
    titleInput.placeholder = "Column title...";
    titleInput.required = true;

    const formActions = document.createElement("div");

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Create";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "reset";
    cancelBtn.textContent = "Cancel";

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get("new-column-input");

        if (!title) {
            return;
        }

        addColumn(title, projectId);
        setupKanban(projectId);
    });

    form.addEventListener("reset", () => {
        form.remove();
    });

    formActions.appendChild(submitBtn);
    formActions.appendChild(cancelBtn);
    form.appendChild(titleInput);
    form.appendChild(formActions);

    return form;
}

function createNewTaskForm(tasksDiv, columnId, newTaskBtn, removeColumnBtn) {
    const form = document.createElement("form");
    form.id = "new-task-form";

    const titleInput = document.createElement("input");
    titleInput.id = "task-title";
    titleInput.name = "task-title";
    titleInput.placeholder = "Title...";
    titleInput.required = true;

    const descriptionInput = document.createElement("textarea");
    descriptionInput.rows = 4;
    descriptionInput.id = "task-description";
    descriptionInput.name = "task-description";
    descriptionInput.placeholder = "Description...";

    const formActions = document.createElement("div");

    const createBtn = document.createElement("button");
    createBtn.type = "submit";
    createBtn.textContent = "Create";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "reset";
    cancelBtn.textContent = "Cancel";

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get("task-title");
        const description = formData.get("task-description");

        if (!title) {
            return;
        }

        addTask(title, description, columnId);
        renderTasks(tasksDiv, columnId);
        form.reset();
    });

    form.addEventListener("reset", () => {
        form.remove();

        newTaskBtn.hidden = false;
        removeColumnBtn.hidden = false;
    });

    form.appendChild(titleInput);
    form.appendChild(descriptionInput);
    formActions.appendChild(createBtn);
    formActions.appendChild(cancelBtn);
    form.appendChild(formActions);

    return form;
}

function setupContentHeader(projectId) {
    const project = getProject(projectId);

    const contentHeader = document.getElementById("content-header");
    contentHeader.textContent = "";

    const projectInfoDiv = document.createElement("div");
    projectInfoDiv.classList.add("project-info");

    const heading = document.createElement("h1");
    heading.textContent = project.title;

    const pencilImg = document.createElement("img");
    pencilImg.classList.add("project-action-btn");
    pencilImg.src = pencilIcon;
    pencilImg.dataset.projectId = projectId;

    const trashImg = document.createElement("img");
    trashImg.classList.add("project-action-btn");
    trashImg.src = trashIcon;
    trashImg.dataset.projectId = projectId;

    trashImg.addEventListener("click", () => {
        removeProject(projectId);
        renderProjects();
        renderHomepage();
    });

    const newColumnBtn = document.createElement("button");
    newColumnBtn.textContent = "+ New column";
    newColumnBtn.dataset.projectId = project.id;

    newColumnBtn.addEventListener("click", () => {
        const kanbanDiv = document.getElementById("kanban");
        const form = createNewColumnForm(projectId);
        const input = form.querySelector("input");

        kanbanDiv.appendChild(form);
        input.focus();
    });

    pencilImg.addEventListener("click", () => {
        heading.remove();
        pencilImg.remove();
        trashImg.remove();

        const form = createEditProjectForm(getProject(projectId));
        projectInfoDiv.appendChild(form);
        form.querySelector("input").focus();
    });

    projectInfoDiv.appendChild(heading);
    projectInfoDiv.appendChild(pencilImg);
    projectInfoDiv.appendChild(trashImg);
    contentHeader.appendChild(projectInfoDiv);
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

    const columnInfo = document.createElement("div");
    columnInfo.classList.add("column-info");

    const columnHeader = document.createElement("h2");
    columnHeader.textContent = column.title;

    const editBtn = document.createElement("button");
    const editImg = document.createElement("img");
    editImg.src = pencilIcon;
    editBtn.hidden = true;
    editBtn.appendChild(editImg);

    const columnActionsDiv = document.createElement("div");
    columnActionsDiv.classList.add("column-actions");

    const newTaskBtn = document.createElement("button");
    newTaskBtn.textContent = "+ New task";
    newTaskBtn.addEventListener("click", () => {
        newTaskBtn.hidden = true;
        removeColumnBtn.hidden = true;

        const form = createNewTaskForm(tasksDiv, column.id, newTaskBtn, removeColumnBtn);
        tasksDiv.insertBefore(form, tasksDiv.firstChild);
        form.querySelector("#task-title").focus();
    });

    const removeColumnBtn = document.createElement("button");
    removeColumnBtn.textContent = "Remove column"

    removeColumnBtn.addEventListener("click", () => {
        removeColumn(column.id);
        setupKanban(column.projectId);
    });

    columnInfo.addEventListener("mouseover", () => {
        editBtn.hidden = false;
    });

    columnInfo.addEventListener("mouseout", () => {
        editBtn.hidden = true;
    });

    editBtn.addEventListener("click", () => {
        columnInfo.hidden = true;

        const form = createUpdateColumnForm(column, columnInfo);
        columnDiv.insertBefore(form, columnDiv.firstChild);
        form.querySelector("input").focus();
    });

    const tasksDiv = document.createElement("div");
    tasksDiv.classList.add("tasks");

    columnInfo.appendChild(columnHeader);
    columnInfo.appendChild(editBtn);
    columnDiv.appendChild(columnInfo);
    columnDiv.appendChild(tasksDiv);
    columnActionsDiv.appendChild(newTaskBtn);
    columnActionsDiv.appendChild(removeColumnBtn);
    columnDiv.appendChild(columnActionsDiv);

    renderTasks(tasksDiv, column.id);

    return columnDiv;
}

function createUpdateColumnForm(column, columnInfoDiv) {
    const form = document.createElement("form");
    form.id = "update-column-form";
    const input = document.createElement("input");
    input.id = "title";
    input.name = "title";
    input.required = true;
    input.placeholder = "New title..."

    const formActionsDiv = document.createElement("div");

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "submit";
    confirmBtn.textContent = "Confirm";
    const cancelBtn = document.createElement("button");
    cancelBtn.type = "reset";
    cancelBtn.textContent = "Cancel";

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const title = formData.get("title").trim();

        if (!title) {
            return;
        }

        column.title = title;
        updateColumn(column.id, column);
        setupKanban(column.projectId);

        form.reset();
    });

    form.addEventListener("reset", () => {
        form.remove();
        columnInfoDiv.hidden = false;
    });

    formActionsDiv.appendChild(confirmBtn);
    formActionsDiv.appendChild(cancelBtn);
    form.appendChild(input);
    form.appendChild(formActionsDiv);

    return form;
}

function renderTasks(tasksDiv, columnId) {
    tasksDiv.textContent = "";

    const tasks = getTasks().filter((task) => task.columnId === columnId);

    tasks.forEach((task) => {
        tasksDiv.appendChild(createTaskCard(task));
    });
}

function openTaskModal(task) {
    const dialog = document.createElement("dialog");
    dialog.classList.add("task-modal");

    const form = document.createElement("form");

    const heading = document.createElement("h1");
    heading.textContent = task.title;

    const title = document.createElement("input");
    title.id = "task-title";
    title.name = "task-title";
    title.value = task.title;
    title.disabled = true;
    title.required = true;

    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Title:";
    titleLabel.htmlFor = title.id;

    const description = document.createElement("textarea");
    description.id = "task-description";
    description.name = "task-description";
    description.value = task.description;
    description.disabled = true;

    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description:";
    descriptionLabel.htmlFor = description.id;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.type = "button";

    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save";
    saveBtn.type = "submit";
    saveBtn.hidden = true;

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Close";
    closeBtn.type = "button";

    closeBtn.addEventListener("click", () => {
        dialog.close();
    });

    editBtn.addEventListener("click", () => {
        title.disabled = false;
        description.disabled = false;

        editBtn.hidden = true;
        saveBtn.hidden = false;
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!title.value.trim()) {
            title.focus();
            return;
        }

        task.title = title.value;
        task.description = description.value;

        title.disabled = true;
        description.disabled = true;

        saveBtn.hidden = true;
        editBtn.hidden = false;

        updateTask(task);
        const project = getProjectByTaskId(task.id);
        setupKanban(project.id);
    });

    form.appendChild(titleLabel);
    form.appendChild(title);
    form.appendChild(descriptionLabel);
    form.appendChild(description);
    form.appendChild(editBtn);
    form.appendChild(saveBtn);
    form.appendChild(closeBtn);
    dialog.appendChild(heading);
    dialog.appendChild(form);
    document.body.appendChild(dialog);

    dialog.showModal();
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

    taskCard.addEventListener("click", () => {
        openTaskModal(task);
    });

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
