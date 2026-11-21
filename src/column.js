import { StorageController } from "./storage.js";
import { getTasks, removeTasksByColumnId } from "./task.js";

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

export function getColumn(id) {
    const columns = getColumns();

    return columns.find((c) => c.id === id);
}

export function getColumns() {
    return StorageController.get(KEY, Column.fromJSON);
}

export function getColumnsByProjectId(projectId) {
    return getColumns().filter((column) => column.projectId === projectId);
}

export function addColumn(column) {
    const columns = getColumns();
    columns.push(column);
    StorageController.add(KEY, columns);
}

export function removeColumn(columnId) {
    const columns = getColumns();
    const filteredColumns = columns.filter((column) => column.id !== columnId);

    StorageController.add(KEY, filteredColumns);
    removeTasksByColumnId(columnId);
}

export function updateColumn(id, column) {
    const columns = getColumns();
    const columnsUpdated = columns.map((c) => c.id === id ? column : c);

    StorageController.add(KEY, columnsUpdated);
}



