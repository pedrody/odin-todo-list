export class Task {
    constructor(
        title,
        description,
        columnId,
        done = false
    ) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.columnId = columnId;
        this.done = done;
        this.dueDate = null;
        this.priority = 0;
        this.checklist = [];
    }

    toggleDone() {
        this.done = !this.done;
    }
}