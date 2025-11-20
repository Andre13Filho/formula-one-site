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
    <tr>
      <td colspan="4">Carregando resultado...</td>
    </tr>
  `;

  // pegar a sessão Race desse meeting
  const sessionsRes = await fetch(
    `${BASE_URL}/sessions?meeting_key=${meetingKey}&session_name=Race`
  );
  if (!sessionsRes.ok) {
    tableBody.innerHTML = `<tr><td colspan="4">Erro ao buscar sessão Race.</td></tr>`;
    return;
  }
  const sessions = await sessionsRes.json();
  if (!sessions.length) {
    tableBody.innerHTML = `<tr><td colspan="4">Nenhuma sessão Race encontrada.</td></tr>`;
    return;
  }

  const raceSessionKey = sessions[0].session_key;

  // resultado da corrida
  const resultRes = await fetch(
    `${BASE_URL}/session_result?session_key=${raceSessionKey}`
  );
  if (!resultRes.ok) {
    tableBody.innerHTML = `<tr><td colspan="4">Erro ao buscar resultado.</td></tr>`;
    return;
  }
  const results = await resultRes.json();

  // mapa de drivers para nomes/equipes
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

  tableBody.innerHTML = "";

  results.forEach((row) => {
    const tr = document.createElement("tr");

    const posCell = document.createElement("td");
    posCell.textContent = row.position;

    const nameCell = document.createElement("td");
    const info = driverMap[row.driver_number];
    nameCell.textContent = info ? info.full_name : row.driver_number;

    const teamCell = document.createElement("td");
    teamCell.textContent = info ? info.team_name : "-";

    const pointsCell = document.createElement("td");
    pointsCell.textContent = row.points !== undefined ? row.points : "-";

    tr.appendChild(posCell);
    tr.appendChild(nameCell);
    tr.appendChild(teamCell);
    tr.appendChild(pointsCell);

    tableBody.appendChild(tr);
  });
}

// 4. Inicializar página
loadRaceInfo().catch(console.error);
loadRaceResults().catch(console.error);
