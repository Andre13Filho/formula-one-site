const BASE_URL = "https://api.openf1.org/v1";

// 1. Ler driver_number da URL
const params = new URLSearchParams(window.location.search);
const driverNumber = params.get("driver_number");  // ex: "1"

if (!driverNumber) {
  document.getElementById("driver-name").textContent =
    "Nenhum piloto informado.";
  throw new Error("driver_number ausente na URL");
}

// 2. Buscar info básica do piloto
async function loadDriverInfo() {
  const res = await fetch(
    `${BASE_URL}/drivers?driver_number=${driverNumber}&session_key=latest`
  );
  if (!res.ok) {
    throw new Error("Erro ao buscar piloto: " + res.status);
  }
  const data = await res.json();
  if (!data.length) {
    document.getElementById("driver-name").textContent =
      "Piloto não encontrado.";
    return;
  }

  const d = data[0]; // mesmo piloto em várias sessões, pegamos um
  document.getElementById("driver-name").textContent = d.full_name;
  document.getElementById("driver-team").textContent = d.team_name;
}

// 3. Exemplo simples de stats da temporada (contar corridas, vitórias...)
async function loadDriverSeasonStats(year = 2025) {
  // todas as corridas desse ano
  const sessionsRes = await fetch(
    `${BASE_URL}/sessions?year=${year}&session_name=Race`
  );
  const sessions = await sessionsRes.json();

  let races = 0;
  let wins = 0;
  let podiums = 0;

  const promises = sessions.map(async (session) => {
    const res = await fetch(
      `${BASE_URL}/session_result?session_key=${session.session_key}&driver_number=${driverNumber}`
    );
    if (!res.ok) return;
    const rows = await res.json();
    if (!rows.length) return;

    const r = rows[0]; // resultado do piloto nessa corrida
    races += 1;
    if (r.position === 1) wins += 1;
    if (r.position >= 1 && r.position <= 3) podiums += 1;
  });

  await Promise.all(promises);

  document.getElementById("driver-races").textContent = races;
  document.getElementById("driver-wins").textContent = wins;
  document.getElementById("driver-podiums").textContent = podiums;
}

// 4. Inicializar página
loadDriverInfo().catch(console.error);
loadDriverSeasonStats().catch(console.error);
