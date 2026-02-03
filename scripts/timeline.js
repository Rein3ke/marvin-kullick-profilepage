import { getEvents } from "./data.js";

const timelineEventsElement = document.getElementById("timeline-events");
const timelineLegendListElement = document.getElementById("timeline-legend-list");

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

function parseDate(dateString) {
	if (!dateString) return null;
	const date = new Date(dateString);
	return Number.isNaN(date.getTime()) ? null : date;
}

function getReadableDate(event) {
	const startYear = event.start ? event.start.getFullYear() : "";
	const endYear = event.end ? event.end.getFullYear() : "Heute";

	switch (event.type) {
		case "internship":
			return startYear || "";
		case "workplace":
		case "education":
			if (!startYear) return endYear || "";
			return `${startYear} - ${endYear}`;
		default:
			if (startYear && endYear) {
				return `${startYear} - ${endYear}`;
			}
			return startYear || endYear || "";
	}
}

function buildEventElement(event) {
	const eventElement = document.createElement("div");
	eventElement.id = event.id;
	eventElement.className = `timeline-event ${event.cssClass}`;

	const typeIcon = document.createElement("span");
	typeIcon.className = `material-icons ${event.cssClass}`;
	typeIcon.textContent = event.icon;
	eventElement.appendChild(typeIcon);

	if (event.url) {
		const link = document.createElement("a");
		link.className = "timeline-event-link";
		link.href = event.url;
		link.target = "_blank";
		link.rel = "noopener noreferrer";
		link.innerHTML = '<span class="material-icons">link</span>';
		eventElement.appendChild(link);
	}

	const content = document.createElement("div");
	content.className = "timeline-event-content";

	const date = document.createElement("p");
	date.className = "timeline-event-content-date";
	const readableDate = getReadableDate(event);
	date.textContent = readableDate ? `${readableDate}${event.location ? `, ${event.location}` : ""}` : event.location || "";

	const title = document.createElement("h2");
	title.textContent = event.name || "";

	const description = document.createElement("p");
	description.innerHTML = event.description || "";

	content.appendChild(date);
	content.appendChild(title);
	content.appendChild(description);
	eventElement.appendChild(content);

	return { eventElement, content };
}

const TOGGLE_HEIGHT_THRESHOLD_PX = 200;

function getExpandedHeight(eventElement) {
	const previousHeight = eventElement.style.height;
	eventElement.style.height = "auto";
	const expandedHeight = eventElement.scrollHeight;
	eventElement.style.height = previousHeight;
	return expandedHeight;
}

function addOverflowToggle(eventElement, eventId) {
	const expandedHeight = getExpandedHeight(eventElement);
	const isOverflowing = expandedHeight > TOGGLE_HEIGHT_THRESHOLD_PX;
	if (!isOverflowing) {
		eventElement.classList.add("not-expandable");
		return;
	}

	const toggleIcon = document.createElement("span");
	toggleIcon.id = `${eventId}-toggleIcon`;
	toggleIcon.className = "material-icons";
	toggleIcon.textContent = "expand_more";
	toggleIcon.addEventListener("click", () => {
		const isExpanded = eventElement.classList.toggle("expanded");
		toggleIcon.textContent = isExpanded ? "expand_less" : "expand_more";
	});

	eventElement.appendChild(toggleIcon);
}

function renderTimeline(events) {
	events.forEach((event) => {
		const { eventElement, content } = buildEventElement(event);
		timelineEventsElement.appendChild(eventElement);
		addOverflowToggle(eventElement, event.id);
	});
}

function renderLegend(events) {
	events.forEach((event) => {
		const legendElement = document.createElement("li");
		legendElement.className = "timeline-legend-item";
		legendElement.addEventListener("click", () => {
			const element = document.getElementById(event.id);
			if (element) {
				element.scrollIntoView({ behavior: "smooth" });
			}
		});
		legendElement.innerHTML = `
            <span class="timeline-legend-item-date">${event.start ? event.start.getFullYear() : ""}</span>
            <div class="timeline-legend-item-container">
                <span class="material-icons">${event.icon}</span>
                <span>${event.name}</span>
            </div>
        `;
		timelineLegendListElement.appendChild(legendElement);
	});
}

export async function initTimeline() {
	if (!timelineEventsElement || !timelineLegendListElement) return;

	const rawEvents = await getEvents();
	if (rawEvents.length === 0) return;

	const events = rawEvents.map((event, index) => ({
		...event,
		id: `event-${index}`,
		start: parseDate(event.start),
		end: parseDate(event.end),
		icon: getMaterialIconByEventType(event.type),
		cssClass: getCssClassByEventType(event.type),
	}));

	events.sort((a, b) => {
		const aTime = a.start ? a.start.getTime() : Number.POSITIVE_INFINITY;
		const bTime = b.start ? b.start.getTime() : Number.POSITIVE_INFINITY;
		return aTime - bTime;
	});

	renderTimeline(events);
	renderLegend(events);
}
