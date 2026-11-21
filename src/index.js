import { seedDefaultData } from "./seed.js";
import "./styles.css";
import { renderProjects, setupNewProjectBtn } from "./ui.js";

seedDefaultData();
renderProjects();
setupNewProjectBtn();