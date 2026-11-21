import { addColumn, Column } from "./column.js";
import { addProject, Project } from "./project.js";
import { addTask, Task } from "./task.js";

const KEY = "hasVisited";

export function seedDefaultData() {
    if (localStorage.getItem(KEY)) {
        return;
    }

    const project = new Project("My project");
    const todo = new Column("Todo", project.id);
    const doing = new Column("Doing", project.id);
    const done = new Column("Done", project.id);
    const task = new Task("First task", "This is my first task", todo.id);

    addProject(project);
    addColumn(todo);
    addColumn(doing);
    addColumn(done);
    addTask(task);

    localStorage.setItem(KEY, "true");
}