import { addColumn, getColumnsByProjectId } from "./column.js";
import { getProjects, addProject, getProject } from "./project.js";

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
        const columnDiv = document.createElement("div");
        columnDiv.classList.add("column");

        const columnHeader = document.createElement("h1");
        columnHeader.textContent = column.title;

        columnDiv.appendChild(columnHeader);
        kanbanDiv.appendChild(columnDiv);
    });
}