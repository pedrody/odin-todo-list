import { StorageController } from "./storage.js";

const KEY = "columns";

export class Column {
    constructor(title, projectId, id = crypto.randomUUID()) {
        this.id = id;
        this.title = title;
        this.projectId = projectId;
    }

    static fromJSON({ id, title, projectId }) {
        return new Column(title, projectId, id);
    }
}

export function getColumns() {
    return StorageController.get(KEY, Column.fromJSON);
}

export function getColumnsByProjectId(projectId) {
    return getColumns().filter((column) => column.projectId === projectId);
}

export function addColumn(title, projectId) {
    const columns = getColumns();
    columns.push(new Column(title, projectId));
    StorageController.add(KEY, columns);
}
