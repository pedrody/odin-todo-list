import "./styles.css";
import { Task } from "./task.js";
import { ChecklistItem } from "./checklistItem.js";
import { Column } from "./column.js";
import { Project } from "./project.js";

const myProject = new Project("My first project");

const myColumn = new Column("My first column", myProject.id);

const myTask = new Task(
    "my first task",
    "my first task description",
    myColumn.id
);

myTask.checklist.push(new ChecklistItem("first step", true));
myTask.checklist.push(new ChecklistItem("second step"));

console.log(myTask);
console.log(myColumn);
console.log(myProject)