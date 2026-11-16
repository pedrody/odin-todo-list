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
    const newProjectBtn = document.getElementById("new-project-btn");

    newProjectBtn.addEventListener("click", () => {
        // prompt is temporary
        const projectTitle = prompt("Project title: ");
        addProject(projectTitle);
        renderProjects();
    });
}
