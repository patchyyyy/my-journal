const PASSWORD = "mypassword123"; // Change this to your own

function unlockJournal() {
  const input = document.getElementById("password-input").value;
  if (input === PASSWORD) {
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("journal-app").style.display = "block";
    renderEntries();
    renderCalendar();
  } else {
    document.getElementById("password-error").textContent = "Wrong password!";
  }
}

function saveEntry() {
  const text = document.getElementById("entry-text").value.trim();
  const tags = document.getElementById("entry-tags").value.trim();
  if (!text) return;

  const entry = {
    date: new Date().toISOString().split("T")[0],
    text,
    tags: tags.split(",").map(t => t.trim()).filter(Boolean)
  };

  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  entries.unshift(entry);
  localStorage.setItem("journalEntries", JSON.stringify(entries));

  document.getElementById("entry-text").value = "";
  document.getElementById("entry-tags").value = "";
  renderEntries();
  renderCalendar();
}

function renderEntries(filterDate = "", filterTag = "") {
  const container = document.getElementById("entries");
  container.innerHTML = "";

  let entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");

  const filtered = entries.filter(entry => {
    return (!filterDate || entry.date === filterDate) &&
           (!filterTag || entry.tags.includes(filterTag));
  });

  if (filtered.length === 0) {
    container.innerHTML = "<p>No entries found.</p>";
    return;
  }

  filtered.forEach((entry, index) => {
    const div = document.createElement("div");

    div.innerHTML = `
      <strong>${entry.date}</strong><br/>
      ${entry.text.replace(/\n/g, "<br/>")}<br/>
      <small>Tags: ${entry.tags.join(", ")}</small><br/>
      <button onclick="deleteEntry(${index})">🗑️ Delete</button>
    `;

    container.appendChild(div);
  });
}

function deleteEntry(indexToDelete) {
  let entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
  
  // Get filtered list first to match UI
  const date = document.getElementById("search-date").value;
  const tag = document.getElementById("search-tag").value.trim();

  const filtered = entries.filter(entry => {
    return (!date || entry.date === date) &&
           (!tag || entry.tags.includes(tag));
  });

  const entryToDelete = filtered[indexToDelete];

  // Remove the exact matching entry
  entries = entries.filter(entry =>
    !(entry.date === entryToDelete.date &&
      entry.text === entryToDelete.text &&
      JSON.stringify(entry.tags) === JSON.stringify(entryToDelete.tags))
  );

  localStorage.setItem("journalEntries", JSON.stringify(entries));
  renderEntries(date, tag);
  renderCalendar();
  
  if (confirm("Delete this entry?")) {
  // deletion logic
  }
}


function renderCalendar() {
  const calendar = document.getElementById("calendar");
  const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");

  const dates = new Set(entries.map(e => e.date));
  calendar.innerHTML = "";

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
    const hasEntry = dates.has(dateStr);
    const span = document.createElement("span");
    span.textContent = i;
    span.style.margin = "4px";
    span.style.padding = "5px";
    span.style.borderRadius = "50%";
    span.style.backgroundColor = hasEntry ? "#4caf50" : "#333";
    span.style.color = "#fff";
    span.style.display = "inline-block";
    span.style.cursor = "pointer";
    span.onclick = () => renderEntries(dateStr);
    calendar.appendChild(span);
  }
}

function searchEntries() {
  const date = document.getElementById("search-date").value;
  const tag = document.getElementById("search-tag").value.trim();
  renderEntries(date, tag);
}
