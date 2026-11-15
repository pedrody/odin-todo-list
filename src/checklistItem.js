export class ChecklistItem {
    constructor(title, done = false) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.done = done;
    }

    toggleDone() {
        this.done = !this.done;
    }
}