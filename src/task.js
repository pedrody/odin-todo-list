import { StorageController } from "./storage.js";

const KEY = "tasks";

export class Task {
    constructor(
        title,
        description,
        columnId,
        id = crypto.randomUUID(),
        done = false,
        dueDate = null,
        priority = 0,
        checklist = []
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.columnId = columnId;
        this.done = done;
        this.dueDate = dueDate;
        this.priority = priority;
        this.checklist = checklist;
    }

    static fromJSON({
        id, title, description, columnId,
        done, dueDate, priority, checklist
    }) {
        return new Task(title, description, columnId, id, done, dueDate, priority, checklist);
    }

    toggleDone() {
        this.done = !this.done;
    }
}

export function getTasks() {
    return StorageController.get(KEY, Task.fromJSON);
}

export function addTask(title, description, columnId) {
    const tasks = getTasks();
    tasks.push(new Task(title, description, columnId));
    StorageController.add(KEY, tasks);
}