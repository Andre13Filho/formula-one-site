const BASE_URL = "https://api.openf1.org/v1";

// 1. Ler driver_number da URL
const params = new URLSearchParams(window.location.search);
const driverNumber = params.get("driver_number");

console.log("driverNumber from URL:", driverNumber);

if (!driverNumber) {
  const title = document.getElementById("driver-name");
  if (title) {
    title.textContent = "Nenhum piloto selecionado.";
  }
  console.error("driver_number ausente na URL");
}

// 2. Info básica do piloto
async function loadDriverInfo() {
  if (!driverNumber) return;

  console.log("Buscando /drivers para número", driverNumber);

  const res = await fetch(
    `${BASE_URL}/drivers?driver_number=${driverNumber}&session_key=latest`
  );

  console.log("Resposta /drivers status:", res.status);

  if (!res.ok) {
    console.error("Erro ao buscar piloto:", res.status);
    document.getElementById("driver-name").textContent =
      "Erro ao buscar dados do piloto.";
    return;
  }

  const data = await res.json();
  console.log("Dados de /drivers:", data);

  if (!data.length) {
    document.getElementById("driver-name").textContent =
      "Piloto não encontrado.";
    return;
  }

  const d = data[0];
  document.getElementById("driver-name").textContent = d.full_name;
  document.getElementById("driver-team").textContent = d.team_name || "-";
  document.getElementById("driver-number").textContent = d.driver_number;
  document.getElementById("driver-country").textContent = d.country_code || "-";
}

// 3. Stats da temporada + resultados por corrida
async function loadDriverSeasonStats(year = 2025) {
  if (!driverNumber) return;

  const resultsBody = document.getElementById("driver-results-body");
  resultsBody.innerHTML = `
    <tr>
      <td colspan="3">Carregando resultados...</td>
    </tr>
  `;

  console.log("Buscando sessões Race ano", year);

  const sessionsRes = await fetch(
    `${BASE_URL}/sessions?year=${year}&session_name=Race`
  );
  console.log("Resposta /sessions status:", sessionsRes.status);

  if (!sessionsRes.ok) {
    console.error("Erro ao buscar sessões:", sessionsRes.status);
    resultsBody.innerHTML = `
      <tr><td colspan="3">Erro ao buscar sessões.</td></tr>
    `;
    return;
  }

  const sessions = await sessionsRes.json();
  console.log("Total de sessões Race:", sessions.length);

  let races = 0;
  let wins = 0;
  let podiums = 0;
  const rows = [];

  const promises = sessions.map(async (session) => {
    const res = await fetch(
      `${BASE_URL}/session_result?session_key=${session.session_key}&driver_number=${driverNumber}`
    );
    if (!res.ok) {
      console.warn("Erro em /session_result para", session.session_key, res.status);
      return;
    }
    const data = await res.json();
    if (!data.length) return;

    const r = data[0];
    races += 1;
    if (r.position === 1) wins += 1;
    if (r.position >= 1 && r.position <= 3) podiums += 1;

    rows.push({
      gp: session.meeting_name,
      position: r.position,
      points: r.points ?? "-",
    });
  });

  await Promise.all(promises);

  document.getElementById("driver-races").textContent = races;
  document.getElementById("driver-wins").textContent = wins;
  document.getElementById("driver-podiums").textContent = podiums;

  resultsBody.innerHTML = "";
  rows.forEach((row) => {
    const tr = document.createElement("tr");

    const gpCell = document.createElement("td");
    gpCell.textContent = row.gp;

    const posCell = document.createElement("td");
    posCell.textContent = row.position;

    const ptsCell = document.createElement("td");
    ptsCell.textContent = row.points;

    tr.appendChild(gpCell);
    tr.appendChild(posCell);
    tr.appendChild(ptsCell);

    resultsBody.appendChild(tr);
  });
}

// 4. Inicializar página
loadDriverInfo().catch((e) => {
  console.error("Erro em loadDriverInfo:", e);
});

loadDriverSeasonStats().catch((e) => {
  console.error("Erro em loadDriverSeasonStats:", e);
});
