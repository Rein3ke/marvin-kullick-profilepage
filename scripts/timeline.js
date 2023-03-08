// after website load create timeline based on database.json file
// and add it to the page

var database_path = "scripts/database.json";

var timeline_element = document.getElementById("timeline");
var timeline_events_element = document.getElementById("timeline-events");
var timeline_legend_element = document.getElementById("timeline-legend");
var timeline_legend_list_element = document.getElementById("timeline-legend-list");

var events = [];

function getEventById(id) {
    return events.find(event => event.id == id);
}

function readDatabase() {
    var request = new XMLHttpRequest();
    request.open("GET", database_path, false);
    request.send(null);
    return request.responseText;
}

function createTimeline() {
    var database = JSON.parse(readDatabase()).events;
    for (var i = 0; i < database.length; i++) {
        events.push(database[i]);
        database[i].id = i;
    }

    // transform event dates to Date objects
    events.forEach(eventData => {
        eventData.start = getDateFromString(eventData.start);
        eventData.end = getDateFromString(eventData.end);
    });
}

function drawTimeline() {
    if (events.length == 0) return; // guard clause - if there are no events, do nothing

    // draw timeline
    events.forEach(eventData => {
        var eventElement = document.createElement("div");
        eventElement.className = `timeline-event ${getCssClassByEventType(eventData.type)}`;
        eventElement.innerHTML = `
            <span class="material-icons ${getCssClassByEventType(eventData.type)}">${getMaterialIconByEventType(eventData.type)}</span>
            <p class="timeline-event-date">${getReadableDate(eventData)}</p>
            <h2 id="${eventData.id}">${eventData.name}</h2>
            <p>${eventData.description}</p>
            <div id="${eventData.id}-toggleBox" class="timeline-event-togglebox">
                <p>${eventData.description}</p>
            </div>
            <span id="${eventData.id}-toggleIcon" class="material-icons" onclick="toggleVisibility('${eventData.id}')">expand_more</span>
        `;
        timeline_events_element.appendChild(eventElement);
    });

    // draw legend
    events.forEach(eventData => {
        var legendElement = document.createElement("li");
        legendElement.className = "timeline-legend-item";
        legendElement.onclick = () => {
            var element = document.getElementById(eventData.id);
            element.scrollIntoView({ behavior: "smooth"});
        };
        legendElement.innerHTML = `
            <span class="timeline-legend-item-date">${eventData.start.getFullYear()}</span>
            <div class="timeline-legend-item-container">
                <span class="material-icons">${getMaterialIconByEventType(eventData.type)}</span>
                <span>${eventData.name}</span>
            </div>
        `;
        timeline_legend_list_element.appendChild(legendElement);
    });
}

// get material icon name by event type
function getMaterialIconByEventType(type) {
    switch (type) {
        case "workplace":
            return "work";
        case "education":
            return "school";
        case "project":
            return "code";
        case "internship":
            return "history_edu";
        default:
            return "event";
    }
}

function getCssClassByEventType(type) {
    switch (type) {
        case "workplace":
            return "event-type--workplace";
        case "education":
            return "event-type--education";
        case "project":
            return "event-type--project";
        case "internship":
            return "event-type--internship";
        default:
            return "event-type";
    }
}

function sortTimelineEventsByStartDate() {
    events.sort((a, b) => {
        return a.start - b.start;
    });
}

function sortTimelineEventsByEndDate() {
    events.sort((a, b) => {
        return a.end - b.end;
    });
}

function getReadableDate(event) {
    switch (event.type) {
        case "workplace":
        case "education":
            return `${event.start.getFullYear()} - ${event.end.getFullYear()}`;
        case "internship":
            return `${event.start.getFullYear()}`;
        default:
            break;
    }
}

function getDateFromString(dateString) {
    var date = new Date(dateString);
    return date;
}

function toggleVisibility(eventId) {
    var element = document.getElementById(`${eventId}-toggleBox`);
    var icon = document.getElementById(`${eventId}-toggleIcon`);

    if (!element.classList.contains("visible")) {
        element.classList.add("visible");
        icon.innerHTML = "expand_less";
    } else {
        element.classList.remove("visible");
        icon.innerHTML = "expand_more";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    createTimeline();
    sortTimelineEventsByStartDate();
    drawTimeline();
});