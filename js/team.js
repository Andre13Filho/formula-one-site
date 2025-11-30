const BASE_URL = "https://api.openf1.org/v1";
const RACE_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const YEAR = 2025;

// mapeia nome -> arquivo (logo + carro) – adapte aos seus nomes reais
const TEAM_ASSETS = {
    "Red Bull Racing": {
        logo: "red-bull.png",
        car: "red_bull_racing.avif",
    },
    Mercedes: {
        logo: "mercedes.png",
        car: "mercedes.avif",
    },
    Ferrari: {
        logo: "ferrari.png",
        car: "ferrari.avif",
    },
    McLaren: {
        logo: "mclaren.png",
        car: "mclaren.avif",
    },
    "Aston Martin": {
        logo: "aston-martin.png",
        car: "aston_martin.avif",
    },
    Williams: {
        logo: "williams.png",
        car: "williams.avif",
    },
    "Haas F1 Team": {
        logo: "haas.png",
        car: "haas.avif",
    },
    "Kick Sauber": {
        logo: "sauber.png",
        car: "kick_sauber.avif",
    },
    Alpine: {
        logo: "alpine.png",
        car: "alpine.avif",
    },
    "Racing Bulls": {
        logo: "racing-bulls.png",
        car: "racing_bulls.avif",
    },
};
function normalizeTeamName(name) {
    return (name || "").toLowerCase().replace(/f1 team|formula 1 team/g, "").trim();
}

function getTeamFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("team");
}

async function fetchTeamDrivers(teamName) {
    const urlTeamNorm = normalizeTeamName(teamName);

    const sessionsRes = await fetch(
        `${BASE_URL}/sessions?year=${YEAR}&session_name=Race`
    );
    if (!sessionsRes.ok) return [];
    const sessions = await sessionsRes.json();
    if (!sessions.length) return [];

    sessions.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
    const lastSessionKey = sessions[sessions.length - 1].session_key;

    const driversRes = await fetch(
        `${BASE_URL}/drivers?session_key=${lastSessionKey}`
    );
    if (!driversRes.ok) return [];

    const drivers = await driversRes.json();

    return drivers.filter((d) => {
        const rowTeamNorm = normalizeTeamName(d.team_name);
        return rowTeamNorm === urlTeamNorm;
    });
}


async function computeTeamSeasonStats(teamName) {
    try {
        // Get all meetings for the year
        const meetingsResp = await fetch(`${BASE_URL}/meetings?year=${YEAR}`);
        if (!meetingsResp.ok) {
            throw new Error("Erro ao buscar meetings: " + meetingsResp.status);
        }
        const meetings = await meetingsResp.json();

        // Filter for completed races
        const completedRaces = meetings.filter(m =>
            m.date_start && new Date(m.date_start) < new Date()
        );

        if (completedRaces.length === 0) {
            return {
                races: 0,
                wins: 0,
                podiums: 0,
                totalPoints: 0,
                racePointsRows: []
            };
        }

        let totalPoints = 0;
        let wins = 0;
        let podiums = 0;
        const racePointsRows = [];

        const urlTeamNorm = normalizeTeamName(teamName);

        for (let idx = 0; idx < completedRaces.length; idx++) {
            const meeting = completedRaces[idx];

            // Get the Race session
            const sessionsResp = await fetch(
                `${BASE_URL}/sessions?meeting_key=${meeting.meeting_key}&session_name=Race`
            );
            if (!sessionsResp.ok) continue;
            const sessions = await sessionsResp.json();

            if (sessions.length === 0) continue;
            const raceSession = sessions[0];

            // Get driver info for this session to map driver_number to team
            const driversResp = await fetch(
                `${BASE_URL}/drivers?session_key=${raceSession.session_key}`
            );
            if (!driversResp.ok) continue;
            const drivers = await driversResp.json();

            // Create map of driver_number -> team_name
            const driverTeamMap = {};
            drivers.forEach(d => {
                driverTeamMap[d.driver_number] = normalizeTeamName(d.team_name);
            });

            // Get all position data for this race
            const positionsResp = await fetch(
                `${BASE_URL}/position?session_key=${raceSession.session_key}`
            );
            if (!positionsResp.ok) continue;
            const positions = await positionsResp.json();

            // Get final positions (last entry per driver)
            const finalPositions = {};
            positions.forEach(pos => {
                const key = pos.driver_number;
                if (!finalPositions[key] || new Date(pos.date) > new Date(finalPositions[key].date)) {
                    finalPositions[key] = pos;
                }
            });

            // Calculate points for this team in this race
            let racePoints = 0;
            let teamBestPos = null;

            Object.values(finalPositions).forEach(pos => {
                const driverTeam = driverTeamMap[pos.driver_number];
                if (driverTeam === urlTeamNorm) {
                    if (pos.position >= 1 && pos.position <= 10) {
                        racePoints += RACE_POINTS[pos.position - 1];
                    }
                    if (teamBestPos === null || pos.position < teamBestPos) {
                        teamBestPos = pos.position;
                    }
                }
            });

            // Add to race results
            if (racePoints > 0 || teamBestPos !== null) {
                totalPoints += racePoints;
                if (teamBestPos === 1) wins += 1;
                if (teamBestPos >= 1 && teamBestPos <= 3) podiums += 1;

                racePointsRows.push({
                    round: idx + 1,
                    gp: meeting.meeting_official_name || meeting.meeting_name || `GP ${meeting.meeting_key}`,
                    points: racePoints,
                    meeting_key: meeting.meeting_key
                });
            }
        }

        // Sort by round number
        racePointsRows.sort((a, b) => a.round - b.round);

        return {
            races: completedRaces.length,
            wins,
            podiums,
            totalPoints,
            racePointsRows
        };

    } catch (error) {
        console.error("Erro em computeTeamSeasonStats:", error);
        return null;
    }
}


function renderTeamHeader(teamName) {
    document.getElementById("team-name").textContent = teamName;
    const assets = TEAM_ASSETS[teamName];

    const logoImg = document.getElementById("team-logo");
    const carImg = document.getElementById("team-car");
    const logoPath = assets ? `../style/images/teams/${assets.logo}` : "";
    const carPath = assets ? `../style/images/car-images/${assets.car}` : "";

    if (logoImg) {
        logoImg.src = logoPath;
        logoImg.alt = teamName;
    }
    if (carImg) {
        carImg.src = carPath;
        carImg.alt = `Carro ${teamName}`;
    }
}

function renderTeamDrivers(drivers) {
    const container = document.getElementById("team-drivers");
    container.innerHTML = "";

    if (!drivers.length) {
        container.textContent = "Pilotos não encontrados.";
        return;
    }

    const placeholder = "../style/images/drivers/driver-placeholder.png";

    drivers.forEach((d) => {
        const card = document.createElement("div");
        card.className = "team-driver-card";

        const img = document.createElement("img");
        const localSrc = `../style/images/drivers/${d.driver_number}.png`;
        img.src = localSrc;
        img.onerror = () => {
            img.src = placeholder;
        };
        img.alt = d.full_name;

        const info = document.createElement("div");
        const name = document.createElement("div");
        name.textContent = d.full_name;

        const num = document.createElement("div");
        num.textContent = `Número: ${d.driver_number}`;

        info.appendChild(name);
        info.appendChild(num);

        card.appendChild(img);
        card.appendChild(info);

        // clicar no piloto -> página de piloto
        card.style.cursor = "pointer";
        card.addEventListener("click", () => {
            window.location.href = `../pages/driver.html?driver_number=${d.driver_number}`;
        });

        container.appendChild(card);
    });
}

// --- FUNÇÕES DE RENDERIZAÇÃO CORRIGIDAS ---

function renderTeamStats(stats) {
    const container = document.getElementById("team-stats");
    container.innerHTML = "";

    if (!stats) {
        container.textContent = "Estatísticas indisponíveis.";
        return;
    }

    const { races, wins, podiums, totalPoints } = stats;

    // A crase (template string) agora abre e fecha corretamente
    // Usei tags <p> para separar as linhas, mas você pode ajustar o HTML conforme seu CSS
    container.innerHTML = `
    <div class="stat-item"><strong>CORRIDAS DISPUTADAS:</strong> ${races}</div>
    <div class="stat-item"><strong>VITÓRIAS:</strong> ${wins}</div>
    <div class="stat-item"><strong>PÓDIOS:</strong> ${podiums}</div>
    <div class="stat-item"><strong>PONTOS TOTAIS:</strong> ${totalPoints}</div>
  `;
}

function renderTeamRacePoints(rows) {
  const body = document.getElementById("team-races-body");
  body.innerHTML = "";

  if (!rows.length) {
    body.innerHTML = `<tr><td colspan="3">Nenhuma corrida encontrada.</td></tr>`;
    return;
  }

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.className = "clickable-row"; // classe para estilo responsivo
    
    const roundCell = document.createElement("td");
    roundCell.textContent = row.round;
    roundCell.setAttribute("data-label", "Round"); // para layout responsivo

    const gpCell = document.createElement("td");
    gpCell.textContent = row.gp;
    gpCell.setAttribute("data-label", "Grand Prix");

    const ptsCell = document.createElement("td");
    ptsCell.textContent = row.points;
    ptsCell.setAttribute("data-label", "Pontos da equipe");

    tr.appendChild(roundCell);
    tr.appendChild(gpCell);
    tr.appendChild(ptsCell);

    // Adiciona o evento de clique para navegar à página da corrida
    tr.addEventListener("click", () => {
      window.location.href = `race.html?meeting_key=${row.meeting_key}`;
    });

    body.appendChild(tr);
  });
}


// --- INICIALIZAÇÃO (MAIN) ---

document.addEventListener("DOMContentLoaded", async () => {
    const teamName = getTeamFromUrl(); // Pega o time da URL (ex: ?team=McLaren)

    if (!teamName) {
        console.error("Nenhum time especificado na URL.");
        // Opcional: Redirecionar ou mostrar mensagem de erro na tela
        return;
    }

    console.log(`Carregando dados para a equipe: ${teamName}`);

    // 1. Renderiza o cabeçalho (Nome, Logo, Carro)
    renderTeamHeader(teamName);

    // Mostrar placeholders até as chamadas à API responderem
    const statsContainer = document.getElementById("team-stats");
    if (statsContainer) statsContainer.textContent = "Carregando dados...";

    const driversContainer = document.getElementById("team-drivers");
    if (driversContainer) driversContainer.textContent = "Carregando pilotos...";

    const racesBody = document.getElementById("team-races-body");
    if (racesBody) {
        racesBody.innerHTML = `<tr><td colspan="3" style="text-align:center">Carregando...</td></tr>`;
    }

    // 2. Busca e renderiza os pilotos
    try {
        const drivers = await fetchTeamDrivers(teamName);
        renderTeamDrivers(drivers);
    } catch (error) {
        console.error("Erro ao carregar pilotos:", error);
    }

    // 3. Calcula estatísticas e preenche a tabela de corridas
    try {
        const stats = await computeTeamSeasonStats(teamName);
        if (stats) {
            renderTeamStats(stats);
            renderTeamRacePoints(stats.racePointsRows);
        } else {
            console.warn("Nenhuma estatística encontrada.");
        }
    } catch (error) {
        console.error("Erro ao calcular estatísticas:", error);
    }
});


document.addEventListener("DOMContentLoaded", async () => {
    const teamName = getTeamFromUrl();
    if (!teamName) {
        document.getElementById("team-name").textContent =
            "Nenhuma equipe selecionada.";
        return;
    }

    renderTeamHeader(teamName);

    // Mostrar placeholders até as chamadas à API responderem
    const statsContainer2 = document.getElementById("team-stats");
    if (statsContainer2) statsContainer2.textContent = "Carregando dados...";

    const driversContainer2 = document.getElementById("team-drivers");
    if (driversContainer2) driversContainer2.textContent = "Carregando pilotos...";

    const racesBody2 = document.getElementById("team-races-body");
    if (racesBody2) {
        racesBody2.innerHTML = `<tr><td colspan="3" style="text-align:center">Carregando...</td></tr>`;
    }

    try {
        const [drivers, stats] = await Promise.all([
            fetchTeamDrivers(teamName),
            computeTeamSeasonStats(teamName),
        ]);

        renderTeamDrivers(drivers);
        renderTeamStats(stats);
        renderTeamRacePoints(stats ? stats.racePointsRows : []);
    } catch (e) {
        console.error(e);
    }
});
