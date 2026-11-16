import { getProjects, removeProject, addProject } from "./project.js";

export function renderProjects() {
    const projectsDiv = document.getElementById("projects");
    projectsDiv.textContent = "";

    const projects = getProjects();

    projects.forEach((project) => {
        const projectBtn = document.createElement("button");
        projectBtn.textContent = project.title;
        projectBtn.dataset.id = project.id;

        // delete just to test
        projectBtn.addEventListener("click", (event) => {
            const id = event.currentTarget.dataset.id;

            removeProject(id);
            renderProjects();
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
