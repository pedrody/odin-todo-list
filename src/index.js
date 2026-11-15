import "./styles.css";
import { Task } from "./task.js";

const myTask = new Task(
    "my first task",
    "my first task description",
    crypto.randomUUID()
);

console.log(myTask);