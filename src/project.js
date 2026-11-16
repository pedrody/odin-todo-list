import { StorageController } from "./storage.js";

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

export function addProject(title) {
    const projects = getProjects();
    projects.push(new Project(title));
    StorageController.add(KEY, projects);
}

export function removeProject(id) {
    StorageController.remove(KEY, id, Project.fromJSON);
}

export function getProject(id) {
    const projects = StorageController.get(KEY, Project.fromJSON);

    return projects.find((p) => p.id === id);
}