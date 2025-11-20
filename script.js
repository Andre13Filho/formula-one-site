/* --- 1. LOAD CALENDAR FROM OPENF1 API (Using /meetings) --- */

async function loadRealF1Calendar() {
  const tableBody = document.getElementById("calendar-body");

  // Mensagem inicial
  tableBody.innerHTML = `
    <tr>
      <td colspan="4">Carregando calendário...</td>
    </tr>
  `;

  try {
    // Buscar todos os meetings de 2025
    const response = await fetch(
      "https://api.openf1.org/v1/meetings?year=2025"
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar meetings: " + response.status);
    }

    let meetings = await response.json();

    // Ordenar por data de início (ou meeting_key como fallback)
    meetings.sort((a, b) => {
      const da = a.date_start ? new Date(a.date_start) : new Date(0);
      const db = b.date_start ? new Date(b.date_start) : new Date(0);
      return da - db;
    });

    // Limpar a mensagem de "carregando"
    tableBody.innerHTML = "";

    if (meetings.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="4">Nenhuma corrida encontrada para 2025.</td>
        </tr>
      `;
      return;
    }

    meetings.forEach((m, index) => {
      const tr = document.createElement("tr");

      const roundCell = document.createElement("td");
      roundCell.textContent = index + 1;

      const dateCell = document.createElement("td");
      // Pega só a parte da data (YYYY-MM-DD)
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
const BASE_URL = "https://api.openf1.org/v1";
const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

// Busca e calcula a classificação dos pilotos para o ano
async function getSeasonDriverStandings(year = 2025) {
  // 1) Buscar todas as sessões Race do ano
  const sessionsRes = await fetch(
    `${BASE_URL}/sessions?year=${year}&session_name=Race`
  );
  if (!sessionsRes.ok) {
    throw new Error("Erro ao buscar sessões Race: " + sessionsRes.status);
  }
  const sessions = await sessionsRes.json();

  const standingsMap = {}; // driver_number -> { driver_number, points, races }

  // 2) Para cada corrida, buscar os resultados e aplicar pontuação
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

  // 3) Transformar em array e ordenar
  const standings = Object.values(standingsMap).sort(
    (a, b) => b.points - a.points
  );

  return standings;
}

// Renderizar a tabela de classificação
async function loadSeasonStandingsTable(year = 2025) {
  const tableBody = document.getElementById("standings-body");

  tableBody.innerHTML = `
    <tr>
      <td colspan="3">Carregando classificação...</td>
    </tr>
  `;

  try {
    const standings = await getSeasonDriverStandings(year);

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
      // Por enquanto mostramos o número do carro; depois podemos trocar por nome
      nameCell.textContent = driver.driver_number;

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
document.addEventListener("DOMContentLoaded", () => {
  loadRealF1Calendar();
  loadSeasonStandingsTable();
});
