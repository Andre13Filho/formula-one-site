
const TEAMS = [
  { name: "Red Bull Racing",   logo: "red-bull.png" },
  { name: "Mercedes",          logo: "mercedes.png" },
  { name: "Ferrari",           logo: "ferrari.png" },
  { name: "McLaren",           logo: "mclaren.png" },
  { name: "Aston Martin",      logo: "aston-martin.png" },
  { name: "Williams",          logo: "williams.png" },
  { name: "Haas F1 Team",      logo: "haas.png" },
  { name: "Kick Sauber",       logo: "sauber.png" },
  { name: "Alpine",            logo: "alpine.png" },
  { name: "Racing Bulls",      logo: "racing-bulls.png" },
];

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("teams-grid");
  if (!grid) return;

  TEAMS.forEach((team) => {
  const card = document.createElement("div");
  card.className = "team-card";
  card.style.cursor = "pointer";

  const img = document.createElement("img");
  img.src = `../style/images/teams/${team.logo}`;
  img.alt = team.name;

  const title = document.createElement("h3");
  title.textContent = team.name;

  card.appendChild(img);
  card.appendChild(title);

  card.addEventListener("click", () => {
    window.location.href = `team.html?team=${encodeURIComponent(team.name)}`;
  });

  grid.appendChild(card);
});
});
