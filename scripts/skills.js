import { getSkills } from "./data.js";

const identitySkillListElement = document.getElementById("identity-skills-list");

export async function initSkills() {
    if (!identitySkillListElement) return;

    const skills = (await getSkills()).slice();
    if (skills.length === 0) return;

    skills.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    skills.forEach((skill) => {
        const skillElement = document.createElement("li");
        skillElement.classList.add(`level-${skill.level}`);
        skillElement.textContent = skill.name;
        identitySkillListElement.appendChild(skillElement);
    });
}
