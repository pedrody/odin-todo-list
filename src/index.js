import "./styles.css";
import { Task } from "./task.js";
import { ChecklistItem } from "./checklistItem.js";

const myTask = new Task(
    "my first task",
    "my first task description",
    crypto.randomUUID()
);

myTask.checklist.push(new ChecklistItem("first step", true));
myTask.checklist.push(new ChecklistItem("second step"));

console.log(myTask);