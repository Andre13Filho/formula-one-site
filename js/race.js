const BASE_URL = "https://api.openf1.org/v1";

// 1. Ler meeting_key da URL
const params = new URLSearchParams(window.location.search);
const meetingKey = params.get("meeting_key");

if (!meetingKey) {
  document.getElementById("race-title").textContent =
    "Nenhuma corrida selecionada.";
  throw new Error("meeting_key ausente na URL");
}

// 2. Buscar informações básicas da corrida (/meetings)
async function loadRaceInfo() {
  const res = await fetch(`${BASE_URL}/meetings?meeting_key=${meetingKey}`);
  if (!res.ok) {
    throw new Error("Erro ao buscar meeting: " + res.status);
  }
  const data = await res.json();
  if (!data.length) {
    document.getElementById("race-title").textContent =
      "Corrida não encontrada.";
    return;
  }

  const m = data[0];
  const title = m.meeting_official_name || m.meeting_name;
  document.getElementById("race-title").textContent = title;
  document.getElementById("race-subtitle").textContent =
    `${m.location} • ${m.country_name} • ${m.year}`;
}

// 3. Buscar sessão de corrida e resultado (/sessions + /session_result + /drivers)
async function loadRaceResults() {
  const tableBody = document.getElementById("race-results-body");
  tableBody.innerHTML = `
    <tr><td colspan="7">Carregando resultado...</td></tr>
  `;

  try {
    // 1) achar a sessão Race desse meeting
    const sessionsRes = await fetch(
      `${BASE_URL}/sessions?meeting_key=${meetingKey}&session_name=Race`
    );
    if (!sessionsRes.ok) {
      throw new Error("Erro ao buscar sessões: " + sessionsRes.status);
    }
    const sessions = await sessionsRes.json();
    if (!sessions.length) {
      tableBody.innerHTML = `
        <tr><td colspan="7">Nenhuma sessão Race encontrada.</td></tr>
      `;
      return;
    }

    const raceSessionKey = sessions[0].session_key;

    // 2) resultados da corrida
    const resultRes = await fetch(
      `${BASE_URL}/session_result?session_key=${raceSessionKey}`
    );
    if (!resultRes.ok) {
      throw new Error("Erro ao buscar resultado: " + resultRes.status);
    }
    const results = await resultRes.json();

    // 3) mapa de drivers para nomes/equipes
    const driversRes = await fetch(
      `${BASE_URL}/drivers?session_key=${raceSessionKey}`
    );
    const drivers = await driversRes.json();
    const driverMap = {};
    drivers.forEach((d) => {
      driverMap[d.driver_number] = {
        full_name: d.full_name,
        team_name: d.team_name,
      };
    });

    // 4) montar tabela
    tableBody.innerHTML = "";
    if (!results.length) {
      tableBody.innerHTML = `
        <tr><td colspan="7">Nenhum resultado encontrado.</td></tr>
      `;
      return;
    }

    let winnerTime = null;
    if (results.length && results[0].time) {
      winnerTime = results[0].time;
    }

    results.forEach((row, index) => {
      const tr = document.createElement("tr");

      const posCell = document.createElement("td");
      posCell.textContent = row.position;

      const numCell = document.createElement("td");
      numCell.textContent = row.driver_number;

      const nameCell = document.createElement("td");
      const info = driverMap[row.driver_number];
      nameCell.textContent = info ? info.full_name : row.driver_number;

      const teamCell = document.createElement("td");
      teamCell.textContent = info ? info.team_name : "-";

      const lapsCell = document.createElement("td");
      lapsCell.textContent = row.laps_completed ?? row.laps ?? "-";

      const timeCell = document.createElement("td");
      let timeText = "-";

      if (row.status && row.status !== "Finished") {
        timeText = row.status;
      } else if (row.time) {
        timeText = row.time;
      } else if (row.gap_to_leader) {
        timeText = `+${row.gap_to_leader}s`;
      } else if (row.laps_behind && row.laps_behind > 0) {
        timeText = `${row.laps_behind} LAP`;
      } else if (index === 0 && winnerTime) {
        timeText = winnerTime;
      }

      timeCell.textContent = timeText;

      const ptsCell = document.createElement("td");
      ptsCell.textContent = row.points ?? "-";

      tr.appendChild(posCell);
      tr.appendChild(numCell);
      tr.appendChild(nameCell);
      tr.appendChild(teamCell);
      tr.appendChild(lapsCell);
      tr.appendChild(timeCell);
      tr.appendChild(ptsCell);

      tableBody.appendChild(tr);
    });

  } catch (e) {
    console.error(e);
    tableBody.innerHTML = `
      <tr><td colspan="7">Erro ao carregar resultado.</td></tr>
    `;
  }
}


// 4. Inicializar página
loadRaceInfo().catch(console.error);
loadRaceResults().catch(console.error);
