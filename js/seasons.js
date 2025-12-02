const BASE_URL = "https://api.openf1.org/v1";
const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];

const SEASON_CHAMPIONS = {
  2025: {
    driver: "Indefinido",
    team: "Indefinido"
  },
  2024: {
    driver: "Max Verstappen",
    team: "Red Bull Racing"
  },
  2023: {
    driver: "Max Verstappen",
    team: "Red Bull Racing"
  },
  2022: {
    driver: "Max Verstappen",
    team: "Red Bull Racing"
  },
  2021: {
    driver: "Max Verstappen",
    team: "Red Bull Racing"
  }
};



const SEASONS = [2025, 2024, 2023, 2022, 2021];




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
    map[d.driver_number] = {
      full_name: d.full_name,
      team_name: d.team_name,
    };
  });
  return map;
}


async function getSeasonChampions(year) {
  
  const sessionsRes = await fetch(
    `${BASE_URL}/sessions?year=${year}&session_name=Race`
  );
  if (!sessionsRes.ok) {
    console.error(`Erro ao buscar sessões Race ${year}:`, sessionsRes.status);
    return { driverChampion: null, teamChampion: null };
  }
  const sessions = await sessionsRes.json();
  console.log("Sessions", year, sessions.length);
  if (!sessions.length) {
    return { driverChampion: null, teamChampion: null };
  }

  const driverPoints = {};   
  const teamPoints = {};     

  
  await Promise.all(
    sessions.map(async (s) => {
      const res = await fetch(
        `${BASE_URL}/session_result?session_key=${s.session_key}`
      );
      if (!res.ok) {
        console.warn("Erro em session_result", s.session_key, res.status);
        return;
      }
      const results = await res.json();

      results.forEach((row) => {
        const pos = row.position;
        const dn = row.driver_number;
        const team = row.team_name;

        if (!dn || !pos || pos < 1 || pos > 10) return;

        const pts = RACE_POINTS[pos - 1];

        if (!driverPoints[dn]) driverPoints[dn] = 0;
        driverPoints[dn] += pts;

        if (team) {
          if (!teamPoints[team]) teamPoints[team] = 0;
          teamPoints[team] += pts;
        }
      });
    })
  );

  const driverEntries = Object.entries(driverPoints);
  const teamEntries = Object.entries(teamPoints);

  if (!driverEntries.length || !teamEntries.length) {
    console.warn("Sem pontos calculados para", year);
    return { driverChampion: null, teamChampion: null };
  }

  
  driverEntries.sort((a, b) => b[1] - a[1]); 
  teamEntries.sort((a, b) => b[1] - a[1]);   

  const driverChampionNumber = Number(driverEntries[0][0]);
  const driverChampionPoints = driverEntries[0][1];
  const teamChampionName = teamEntries[0][0];
  const teamChampionPoints = teamEntries[0][1];

  
  const driverMap = await getDriverMapForYear(year);
  const driverInfo = driverMap[driverChampionNumber];

  const driverChampion = driverInfo
    ? `${driverInfo.full_name} (${driverChampionPoints} pts)`
    : `#${driverChampionNumber} (${driverChampionPoints} pts)`;

  const teamChampion = `${teamChampionName} (${teamChampionPoints} pts)`;

  return { driverChampion, teamChampion };
}




async function loadSeasonsGrid() {
  const grid = document.getElementById("seasons-grid");
  if (!grid) return;

  grid.innerHTML = "";

  SEASONS.forEach((year) => {
    const info = SEASON_CHAMPIONS[year] || {};

    const card = document.createElement("div");
    card.className = "season-card";

    const title = document.createElement("h3");
    title.textContent = `Temporada ${year}`;

    const driverP = document.createElement("p");
    driverP.innerHTML = `<strong>Campeão de pilotos:</strong> ${
      info.driver || "Dados indisponíveis"
    }`;

    const teamP = document.createElement("p");
    teamP.innerHTML = `<strong>Campeão de construtores:</strong> ${
      info.team || "Dados indisponíveis"
    }`;

    card.appendChild(title);
    card.appendChild(driverP);
    card.appendChild(teamP);

    card.addEventListener("click", () => {
      window.location.href = `season.html?year=${year}`;
    });

    grid.appendChild(card);
  });
}



document.addEventListener("DOMContentLoaded", () => {
  loadSeasonsGrid().catch(console.error);
});
