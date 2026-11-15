import "./styles.css";
import { Task } from "./task.js";
import { ChecklistItem } from "./checklistItem.js";
import { Column } from "./column.js";

const myColumn = new Column("My first column", crypto.randomUUID());

const myTask = new Task(
    "my first task",
    "my first task description",
    myColumn.id
);

myTask.checklist.push(new ChecklistItem("first step", true));
myTask.checklist.push(new ChecklistItem("second step"));

console.log(myTask);
console.log(myColumn);