const BASE_URL = "https://api.openf1.org/v1";

function getYearFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const y = Number(params.get("year"));
  return Number.isFinite(y) ? y : new Date().getFullYear();
}


async function getDriverMapForYear(year) {
  const sessionsRes = await fetch(
    `${BASE_URL}/sessions?year=${year}&session_name=Race`
  );
  if (!sessionsRes.ok) return {};
  const sessions = await sessionsRes.json();
  if (!sessions.length) return {};

  sessions.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
  const lastSessionKey = sessions[sessions.length - 1].session_key;

  const driversRes = await fetch(
    `${BASE_URL}/drivers?session_key=${lastSessionKey}`
  );
  if (!driversRes.ok) return {};

  const drivers = await driversRes.json();
  const map = {};
  drivers.forEach((d) => {
    map[d.driver_number] = d.full_name;
  });
  return map;
}

async function loadSeasonPage() {
  const year = getYearFromUrl();
  const titleEl = document.getElementById("season-title");
  const subtitleEl = document.getElementById("season-subtitle");
  const body = document.getElementById("season-races-body");

  titleEl.textContent = `Temporada ${year}`;
  subtitleEl.textContent = "Carregando corridas...";
  body.innerHTML = `
    <tr><td colspan="4">Carregando corridas...</td></tr>
  `;

  try {
    
    const [sessionsRes, driverMap] = await Promise.all([
      fetch(`${BASE_URL}/sessions?year=${year}&session_name=Race`),
      getDriverMapForYear(year),
    ]);
    if (!sessionsRes.ok) {
      throw new Error("Erro ao buscar sessões: " + sessionsRes.status);
    }
    const sessions = await sessionsRes.json();
    if (!sessions.length) {
      subtitleEl.textContent = "Nenhuma corrida encontrada.";
      body.innerHTML = `<tr><td colspan="4">Sem dados para esta temporada.</td></tr>`;
      return;
    }

    
    sessions.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

    const rows = [];
    await Promise.all(
      sessions.map(async (s, index) => {
        
        const res = await fetch(
          `${BASE_URL}/session_result?session_key=${s.session_key}&position=1`
        );
        if (!res.ok) return;
        const result = await res.json();
        const winnerRow = result[0];

        const winnerNumber = winnerRow?.driver_number;
        const winnerName =
          (winnerNumber && driverMap[winnerNumber]) ||
          winnerRow?.full_name ||
          winnerRow?.broadcast_name ||
          (winnerNumber ? `#${winnerNumber}` : "-");

        rows.push({
          round: index + 1,
          date: s.date_start ? s.date_start.slice(0, 10) : "-",
          gp:
            s.meeting_official_name ||
            s.meeting_name ||
            `GP ${s.meeting_key}`,
          winner: winnerName,
          meeting_key: s.meeting_key,
        });
      })
    );

    subtitleEl.textContent = `Total de corridas: ${rows.length}`;
    body.innerHTML = "";

    rows.forEach((row) => {
      const tr = document.createElement("tr");
      tr.style.cursor = "pointer";

      const roundCell = document.createElement("td");
      roundCell.textContent = row.round;

      const dateCell = document.createElement("td");
      dateCell.textContent = row.date;

      const gpCell = document.createElement("td");
      gpCell.textContent = row.gp;

      const winnerCell = document.createElement("td");
      winnerCell.textContent = row.winner;

      tr.appendChild(roundCell);
      tr.appendChild(dateCell);
      tr.appendChild(gpCell);
      tr.appendChild(winnerCell);

      tr.addEventListener("click", () => {
        window.location.href = `../pages/race.html?meeting_key=${row.meeting_key}`;
      });

      body.appendChild(tr);
    });
  } catch (e) {
    console.error(e);
    subtitleEl.textContent = "Erro ao carregar temporada.";
    body.innerHTML = `<tr><td colspan="4">Erro ao carregar corridas.</td></tr>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadSeasonPage().catch(console.error);
});
