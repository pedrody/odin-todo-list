import { getColumn, getColumnsByProjectId, removeColumn } from "./column.js";
import { StorageController } from "./storage.js";
import { getTask } from "./task.js";

const KEY = "projects";

export class Project {
    constructor(title, id = crypto.randomUUID()) {
        this.id = id;
        this.title = title;
    }

    static fromJSON({ id, title }) {
        return new Project(title, id);
    }
}

export function getProjects() {
    return StorageController.get(KEY, Project.fromJSON);
}

export function addProject(project) {
    const projects = getProjects();
    projects.push(project);
    StorageController.add(KEY, projects);
}

export function removeProject(id) {
    const columns = getColumnsByProjectId(id);
    columns.forEach(col => {
        removeColumn(col.id);
    });

    StorageController.remove(KEY, id, Project.fromJSON);
}

export function getProject(id) {
    const projects = StorageController.get(KEY, Project.fromJSON);

    return projects.find((p) => p.id === id);
}

export function updateProject(id, newProject) {
    const projects = getProjects();

    const projectsUpdated = projects.map((project) => project.id === id ? newProject : project);

    StorageController.add(KEY, projectsUpdated);
}

export function getProjectByTaskId(taskId) {
    const task = getTask(taskId);
    const column = getColumn(task.columnId);
    const project = getProject(column.projectId);

    return project;
}
