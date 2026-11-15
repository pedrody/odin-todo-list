export class Column {
    constructor(title, projectId) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.projectId = projectId;
    }
}