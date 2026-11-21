import { StorageController } from "./storage.js";
import { parseISO, startOfDay, isBefore, isToday, isTomorrow } from "date-fns";

const KEY = "tasks";

export class Task {
    constructor(
        title,
        description,
        columnId,
        id = crypto.randomUUID(),
        done = false,
        dueDate = null,
        priority = 0
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.columnId = columnId;
        this.done = done;
        this.dueDate = dueDate;
        this.priority = priority;
    }

    static fromJSON({
        id, title, description, columnId,
        done, dueDate, priority
    }) {
        return new Task(title, description, columnId, id, done, dueDate, priority);
    }

    toggleDone() {
        this.done = !this.done;
    }

    getDueDate() {
        return this.dueDate ? parseISO(this.dueDate) : null;
    }

    isOverdue() {
        const dueDate = this.getDueDate();

        return dueDate !== null && isBefore(dueDate, startOfDay(new Date()));
    }

    isDueToday() {
        const dueDate = this.getDueDate();

        return dueDate !== null && isToday(dueDate);
    }

    isDueTomorrow() {
        const dueDate = this.getDueDate();

        return dueDate !== null && isTomorrow(dueDate);
    }
}

export function getTask(id) {
    const tasks = getTasks();

    return tasks.find((t) => t.id === id);
}

export function getTasks() {
    return StorageController.get(KEY, Task.fromJSON);
}

export function addTask(task) {
    const tasks = getTasks();
    tasks.unshift(task);
    StorageController.add(KEY, tasks);
}

export function updateTask(taskToUpdate) {
    const tasks = getTasks();

    const updatedTasks = tasks.map((task) =>
        task.id === taskToUpdate.id ? taskToUpdate : task
    );

    StorageController.add(KEY, updatedTasks);
}

export function removeTasksByColumnId(columnId) {
    const tasks = getTasks();
    const filteredTasks = tasks.filter((task) => task.columnId !== columnId);
    StorageController.add(KEY, filteredTasks);
}

export function removeTask(id) {
    const tasks = getTasks().filter((t) => t.id !== id);

    StorageController.add(KEY, tasks);
}
