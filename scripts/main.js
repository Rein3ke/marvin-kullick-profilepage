import { initSkills } from "./skills.js";
import { initTimeline } from "./timeline.js";
import { initScrollToTop } from "./scroll-to-top.js";

document.addEventListener("DOMContentLoaded", () => {
    initSkills();
    initTimeline();
    initScrollToTop();
});
