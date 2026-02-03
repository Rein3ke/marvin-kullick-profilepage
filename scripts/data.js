const DATABASE_URL = new URL("./database.json", import.meta.url);

let cachePromise = null;

async function loadDatabase() {
  if (!cachePromise) {
    cachePromise = fetch(DATABASE_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load database.json (${response.status})`);
      }
      return response.json();
    });
  }
  return cachePromise;
}

export async function getSkills() {
  const data = await loadDatabase();
  return Array.isArray(data.skills) ? data.skills : [];
}

export async function getEvents() {
  const data = await loadDatabase();
  return Array.isArray(data.events) ? data.events : [];
}

export { loadDatabase };
