var database_path = "scripts/database.json";

var identity_skill_list_element = document.getElementById("identity-skills-list");

var skills = [];

function readDatabase() {
    var request = new XMLHttpRequest();
    request.open("GET", database_path, false);
    request.send(null);
    return request.responseText;
}

function createSkillset() {
    var database = JSON.parse(readDatabase()).skills;
    for (var i = 0; i < database.length; i++) {
        skills.push(database[i]);
    }

    // sort skills by name
    skills.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });
}

function drawSkillset() {
    if (skills.length == 0) return;

    skills.forEach(skill => {
        var skillElement = document.createElement("li");
        skillElement.classList.add(`level-${skill.level}`);

        skillElement.innerHTML = `
            ${skill.name}
        `;

        identity_skill_list_element.appendChild(skillElement);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    createSkillset();
    drawSkillset();
});