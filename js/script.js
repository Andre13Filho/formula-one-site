// ---------------------------------------------------------
// 0. Config
// ---------------------------------------------------------
const BASE_URL = "https://api.openf1.org/v1";
const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];


// ---------------------------------------------------------
// 1. Calendar (/meetings)
// ---------------------------------------------------------
async function loadRealF1Calendar(year = 2025) {
  const tableBody = document.getElementById("calendar-body");

  tableBody.innerHTML = `
    <tr>
      <td colspan="4">Carregando calendário...</td>
    </tr>
  `;

  try {
    const response = await fetch(
      `${BASE_URL}/meetings?year=${year}`
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar meetings: " + response.status);
    }

    let meetings = await response.json();

    meetings.sort((a, b) => {
      const da = a.date_start ? new Date(a.date_start) : new Date(0);
      const db = b.date_start ? new Date(b.date_start) : new Date(0);
      return da - db;
    });

    tableBody.innerHTML = "";

    if (meetings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">Nenhuma corrida encontrada para ${year}.</td>
        </tr>
      `;
      return;
    }

    meetings.forEach((m, index) => {
      const tr = document.createElement("tr");

      const roundCell = document.createElement("td");
      roundCell.textContent = index + 1;

      const dateCell = document.createElement("td");
      const dateStr = m.date_start ? m.date_start.slice(0, 10) : "-";
      dateCell.textContent = dateStr;

      const gpCell = document.createElement("td");
      gpCell.textContent = m.meeting_official_name || m.meeting_name || "-";

      const circuitCell = document.createElement("td");
      circuitCell.textContent =
        m.location || m.circuit_short_name || m.country_name || "-";

      tr.appendChild(roundCell);
      tr.appendChild(dateCell);
      tr.appendChild(gpCell);
      tr.appendChild(circuitCell);

      // linha inteira clicável → página da corrida
      tr.style.cursor = "pointer";
      tr.addEventListener("click", () => {
        window.location.href = `pages/race.html?meeting_key=${m.meeting_key}`;
      });

      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="4">Erro ao carregar calendário. Veja o console.</td>
      </tr>
    `;
  }
}


// ---------------------------------------------------------
// 2. Standings core logic (/sessions + /session_result)
// ---------------------------------------------------------
async function getSeasonDriverStandings(year = 2025) {
  const sessionsRes = await fetch(
    `${BASE_URL}/sessions?year=${year}&session_name=Race`
  );
  if (!sessionsRes.ok) {
    throw new Error("Erro ao buscar sessões Race: " + sessionsRes.status);
  }
  const sessions = await sessionsRes.json();

  const standingsMap = {}; // driver_number -> { driver_number, points, races }

  const promises = sessions.map(async (session) => {
    const sessionKey = session.session_key;

    const res = await fetch(
      `${BASE_URL}/session_result?session_key=${sessionKey}`
    );

    if (!res.ok) {
      console.warn("Erro ao buscar session_result para", sessionKey);
      return;
    }

    const results = await res.json();

    results.forEach((row) => {
      const pos = row.position;
      const driverNumber = row.driver_number;

      if (pos >= 1 && pos <= 10) {
        const points = RACE_POINTS[pos - 1];

        if (!standingsMap[driverNumber]) {
          standingsMap[driverNumber] = {
            driver_number: driverNumber,
            points: 0,
            races: 0,
          };
        }

        standingsMap[driverNumber].points += points;
        standingsMap[driverNumber].races += 1;
      }
    });
  });

  await Promise.all(promises);

  const standings = Object.values(standingsMap).sort(
    (a, b) => b.points - a.points
  );

  return standings;
}


// ---------------------------------------------------------
// 3. Driver map with names (/drivers)
//    Simplified: just use latest session, no extra /sessions call
// ---------------------------------------------------------
async function getDriverMap() {
  const driversRes = await fetch(
    `${BASE_URL}/drivers?session_key=latest`
  );
  if (!driversRes.ok) {
    throw new Error("Erro ao buscar drivers: " + driversRes.status);
  }
  const drivers = await driversRes.json();

  const map = {};
  drivers.forEach((d) => {
    map[d.driver_number] = {
      full_name: d.full_name,
      acronym: d.name_acronym,
      team_name: d.team_name,
      team_colour: d.team_colour,
    };
  });

  return map;
}


// ---------------------------------------------------------
// 4. Render standings table
// ---------------------------------------------------------
async function loadSeasonStandingsTable(year = 2025) {
  const tableBody = document.getElementById("standings-body");

  tableBody.innerHTML = `
    <tr>
      <td colspan="3">Carregando classificação...</td>
    </tr>
  `;

  try {
    const [standings, driverMap] = await Promise.all([
      getSeasonDriverStandings(year),
      getDriverMap(),
    ]);

    tableBody.innerHTML = "";

    if (standings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3">Nenhum dado de classificação encontrado.</td>
        </tr>
      `;
      return;
    }

    standings.forEach((driver, index) => {
      const tr = document.createElement("tr");

      // POS
      const posCell = document.createElement("td");
      posCell.textContent = index + 1;

      // PILOTO (com link)
      const nameCell = document.createElement("td");
      const info = driverMap[driver.driver_number];
      const displayName = info ? info.full_name : driver.driver_number;

      nameCell.textContent = ""; // garante vazio

      const driverLink = document.createElement("a");
      driverLink.href = `pages/driver.html?driver_number=${driver.driver_number}`;
      driverLink.textContent = displayName;
      driverLink.style.textDecoration = "none";
      driverLink.style.color = "inherit";


      nameCell.appendChild(driverLink);

      // PTS
      const ptsCell = document.createElement("td");
      ptsCell.textContent = driver.points;

      // Monta a linha completa
      tr.appendChild(posCell);
      tr.appendChild(nameCell);
      tr.appendChild(ptsCell);

      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error(error);
    tableBody.innerHTML = `
      <tr>
        <td colspan="3">Erro ao carregar classificação. Veja o console.</td>
      </tr>
    `;
  }
}


// ---------------------------------------------------------
// 5. Boot
// ---------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadRealF1Calendar(2025);
  loadSeasonStandingsTable(2025);
});
