


const BASE_URL = "https://api.openf1.org/v1";





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





async function getSeasonDriverStandings(year = 2025) {
  try {
    const now = new Date();

    
    const meetingsResp = await fetch(`${BASE_URL}/meetings?year=${year}`);
    if (!meetingsResp.ok) {
      throw new Error(`Erro ao buscar meetings: ${meetingsResp.status}`);
    }
    const meetings = await meetingsResp.json();

    
    const completedRaces = meetings.filter(
      (m) => m.date_start && new Date(m.date_start) < now
    );

    const driverPointsMap = {}; 

    for (const meeting of completedRaces) {
      let sessions = [];
      try {
        const sessionsResp = await fetch(
          `${BASE_URL}/sessions?meeting_key=${meeting.meeting_key}`
        );
        if (!sessionsResp.ok) {
          throw new Error(`status ${sessionsResp.status}`);
        }
        sessions = await sessionsResp.json();
      } catch (sessionError) {
        console.error(
          `Erro ao buscar sessões para meeting ${meeting.meeting_key}:`,
          sessionError
        );
        continue;
      }

      
      const scoringSessions = sessions.filter((session) => {
        const isScoringSession =
          session.session_type === "Race" &&
          (session.session_name === "Race" || session.session_name === "Sprint");
        if (!isScoringSession) return false;

        if (!session.date_end) return true;
        return new Date(session.date_end) < now;
      });

      for (const session of scoringSessions) {
        try {
          const resultsResp = await fetch(
            `${BASE_URL}/session_result?session_key=${session.session_key}`
          );
          if (!resultsResp.ok) {
            throw new Error(`status ${resultsResp.status}`);
          }
          const results = await resultsResp.json();
          if (!results.length) continue;

          results.forEach((result) => {
            const points = Number(result.points);
            if (!points) return; 

            const driverNumber = result.driver_number;
            if (!driverPointsMap[driverNumber]) {
              driverPointsMap[driverNumber] = {
                driver_number: driverNumber,
                points: 0,
                races: 0,
              };
            }

            driverPointsMap[driverNumber].points += points;
            driverPointsMap[driverNumber].races += 1;
          });
        } catch (sessionResultError) {
          console.error(
            `Erro ao buscar session_result ${session.session_key}:`,
            sessionResultError
          );
        }
      }
    }

    return Object.values(driverPointsMap).sort((a, b) => b.points - a.points);
  } catch (error) {
    console.error("Erro em getSeasonDriverStandings:", error);
    return [];
  }
}







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

      
      const posCell = document.createElement("td");
      posCell.textContent = index + 1;

      
      const nameCell = document.createElement("td");
      const info = driverMap[driver.driver_number];
      const displayName = info ? info.full_name : driver.driver_number;

      nameCell.textContent = ""; 

      const driverLink = document.createElement("a");
      driverLink.href = `pages/driver.html?driver_number=${driver.driver_number}`;
      driverLink.textContent = displayName;
      driverLink.style.textDecoration = "none";
      driverLink.style.color = "inherit";


      nameCell.appendChild(driverLink);

      
      const ptsCell = document.createElement("td");
      ptsCell.textContent = driver.points;

      
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




async function goToLastRace(year = 2025) {
  try {
    const card = document.getElementById("last-race-card");
    if (!card) return;

    
    card.classList.add("loading");

    
    const res = await fetch(
      `${BASE_URL}/sessions?year=${year}&session_name=Race`
    );
    if (!res.ok) {
      throw new Error("Erro ao buscar sessões: " + res.status);
    }

    const sessions = await res.json();
    if (!sessions.length) {
      alert(`Nenhuma corrida encontrada para ${year}.`);
      return;
    }

    
    sessions.sort(
      (a, b) => new Date(a.date_start) - new Date(b.date_start)
    );
    const lastSession = sessions[sessions.length - 1];

    if (!lastSession.meeting_key) {
      alert("Não foi possível identificar a última corrida.");
      return;
    }

    
    window.location.href = `pages/race.html?meeting_key=${lastSession.meeting_key}`;
  } catch (e) {
    console.error(e);
    alert("Erro ao abrir a última corrida.");
  }
}

function setupLastRaceLink() {
  const card = document.getElementById("last-race-card");
  if (!card) return;

  card.style.cursor = "pointer";
  card.addEventListener("click", (event) => {
    event.preventDefault();
    goToLastRace(2025);
  });
}






document.addEventListener("DOMContentLoaded", () => {
  loadRealF1Calendar(2025);
  loadSeasonStandingsTable(2025);
  setupLastRaceLink();
});
