const BASE_URL = "https://api.openf1.org/v1";

// mesmo array CIRCUITS ou importe de outro arquivo
// js/circuits.js (or a separate config file)
const CIRCUITS = [
    {
        slug: "australia",
        title: "Albert Park Circuit",
        country_name: "Australia",
        city: "Melbourne",
        laps: 58,
        lap_length_km: 5.278,
        race_distance_km: 306.124,
        image: "Australia_Circuit.avif",
    },
    {
        slug: "china",
        title: "Shanghai International Circuit",
        country_name: "China",
        city: "Shanghai",
        laps: 56,
        lap_length_km: 5.451,
        race_distance_km: 305.066,
        image: "China_Circuit.avif",
    },
    {
        slug: "japan",
        title: "Suzuka International Racing Course",
        country_name: "Japan",
        city: "Suzuka",
        laps: 53,
        lap_length_km: 5.807,
        race_distance_km: 307.471,
        image: "Japan_Circuit.avif",
    },
    {
        slug: "bahrain",
        title: "Bahrain International Circuit",
        country_name: "Bahrain",
        city: "Sakhir",
        laps: 57,
        lap_length_km: 5.412,
        race_distance_km: 308.238,
        image: "Bahrain_Circuit.avif",
    },
    {
        slug: "saudi-arabia",
        title: "Jeddah Corniche Circuit",
        country_name: "Saudi Arabia",
        city: "Jeddah",
        laps: 50,
        lap_length_km: 6.174,
        race_distance_km: 308.450,
        image: "Saudi_Arabia_Circuit.avif",
    },
    {
        slug: "miami",
        title: "Miami International Autodrome",
        country_name: "United States",
        city: "Miami",
        laps: 57,
        lap_length_km: 5.412,
        race_distance_km: 308.326,
        image: "Miami_Circuit.avif",
    },
    {
        slug: "emilia-romagna",
        title: "Autodromo Enzo e Dino Ferrari",
        country_name: "Italy",
        city: "Imola",
        laps: 63,
        lap_length_km: 4.909,
        race_distance_km: 309.049,
        image: "Emilia_Romagna_Circuit.avif",
    },
    {
        slug: "monaco",
        title: "Circuit de Monaco",
        country_name: "Monaco",
        city: "Monte Carlo",
        laps: 78,
        lap_length_km: 3.337,
        race_distance_km: 260.286,
        image: "Monaco_Circuit.avif",
    },
    {
        slug: "spain",
        title: "Circuit de Barcelona-Catalunya",
        country_name: "Spain",
        city: "Montmeló",
        laps: 66,
        lap_length_km: 4.657,
        race_distance_km: 307.236,
        image: "Spain_Circuit.avif",
    },
    {
        slug: "canada",
        title: "Circuit Gilles-Villeneuve",
        country_name: "Canada",
        city: "Montreal",
        laps: 70,
        lap_length_km: 4.361,
        race_distance_km: 305.270,
        image: "Canada_Circuit.avif",
    },
    {
        slug: "austria",
        title: "Red Bull Ring",
        country_name: "Austria",
        city: "Spielberg",
        laps: 71,
        lap_length_km: 4.318,
        race_distance_km: 306.452,
        image: "Austria_Circuit.avif",
    },
    {
        slug: "great-britain",
        title: "Silverstone Circuit",
        country_name: "United Kingdom",
        city: "Silverstone",
        laps: 52,
        lap_length_km: 5.891,
        race_distance_km: 306.198,
        image: "Great_Britain_Circuit.avif",
    },
    {
        slug: "belgium",
        title: "Circuit de Spa-Francorchamps",
        country_name: "Belgium",
        city: "Stavelot",
        laps: 44,
        lap_length_km: 7.004,
        race_distance_km: 308.052,
        image: "Belgium_Circuit.avif",
    },
    {
        slug: "hungary",
        title: "Hungaroring",
        country_name: "Hungary",
        city: "Mogyoród",
        laps: 70,
        lap_length_km: 4.381,
        race_distance_km: 306.630,
        image: "Hungary_Circuit.avif",
    },
    {
        slug: "netherlands",
        title: "Circuit Zandvoort",
        country_name: "Netherlands",
        city: "Zandvoort",
        laps: 72,
        lap_length_km: 4.259,
        race_distance_km: 306.587,
        image: "Netherlands_Circuit.avif",
    },
    {
        slug: "italy-monza",
        title: "Autodromo Nazionale Monza",
        country_name: "Italy",
        city: "Monza",
        laps: 53,
        lap_length_km: 5.793,
        race_distance_km: 306.720,
        image: "Italy_Circuit.avif",
    },
    {
        slug: "azerbaijan",
        title: "Baku City Circuit",
        country_name: "Azerbaijan",
        city: "Baku",
        laps: 51,
        lap_length_km: 6.003,
        race_distance_km: 306.049,
        image: "Baku_Circuit.avif",
    },
    {
        slug: "singapore",
        title: "Marina Bay Street Circuit",
        country_name: "Singapore",
        city: "Singapore",
        laps: 61,
        lap_length_km: 5.063,
        race_distance_km: 308.706,
        image: "Singapore_Circuit.avif",
    },
    {
        slug: "usa-cota",
        title: "Circuit of the Americas",
        country_name: "United States",
        city: "Austin",
        laps: 56,
        lap_length_km: 5.513,
        race_distance_km: 308.405,
        image: "USA_Circuit.avif",
    },
    {
        slug: "mexico",
        title: "Autódromo Hermanos Rodríguez",
        country_name: "Mexico",
        city: "Mexico City",
        laps: 71,
        lap_length_km: 4.304,
        race_distance_km: 305.354,
        image: "Mexico_Circuit.avif",
    },
    {
        slug: "brazil",
        title: "Autódromo José Carlos Pace",
        country_name: "Brazil",
        city: "São Paulo",
        laps: 71,
        lap_length_km: 4.309,
        race_distance_km: 305.879,
        image: "Brazil_Circuit.avif",
    },
    {
        slug: "las-vegas",
        title: "Las Vegas Strip Circuit",
        country_name: "United States",
        city: "Las Vegas",
        laps: 50,
        lap_length_km: 6.201,
        race_distance_km: 310.050,
        image: "Las_Vegas_Circuit.avif",
    },
    {
        slug: "qatar",
        title: "Lusail International Circuit",
        country_name: "Qatar",
        city: "Lusail",
        laps: 57,
        lap_length_km: 5.419,
        race_distance_km: 308.611,
        image: "Qatar_Circuit.avif",
    },
    {
        slug: "abu-dhabi",
        title: "Yas Marina Circuit",
        country_name: "United Arab Emirates",
        city: "Abu Dhabi",
        laps: 58,
        lap_length_km: 5.281,
        race_distance_km: 306.183,
        image: "Abu_Dhabi_Circuit.avif",
    },
];



function getCircuitFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const country = params.get("country");

    const bySlug = CIRCUITS.find((c) => c.slug === slug);
    if (bySlug) return bySlug;

    if (country) {
        const byCountry = CIRCUITS.find((c) => c.country_name === country);
        if (byCountry) return byCountry;
    }
    return null;
}

function renderCircuitInfo(circuit) {
    const infoBody = document.getElementById("circuit-info-body");
    if (!infoBody) return;

    infoBody.innerHTML = `
    <p><strong>País:</strong> ${circuit.country_name || "-"}</p>
    <p><strong>Cidade:</strong> ${circuit.city || "-"}</p>
    <p><strong>Voltas da corrida:</strong> ${circuit.laps || "-"} </p>
    <p><strong>Extensão da volta:</strong> ${circuit.lap_length_km ? `${circuit.lap_length_km.toFixed(3)} km` : "-"
        }</p>
    <p><strong>Distância total:</strong> ${circuit.race_distance_km
            ? `${circuit.race_distance_km.toFixed(3)} km`
            : "-"
        }</p>
  `;
}



async function loadCircuitPage() {
    const circuit = getCircuitFromUrl();
    const titleEl = document.getElementById("circuit-title");
    const subtitleEl = document.getElementById("circuit-subtitle");
    const imgEl = document.getElementById("circuit-image");

    if (!circuit) {
        titleEl.textContent = "Circuito não encontrado.";
        return;
    }

    titleEl.textContent = circuit.title;
    imgEl.src = `../style/images/circuits-images/${circuit.image}`;
    renderCircuitInfo(circuit);
    await loadLastRacesForCircuit(circuit.country_name);
}


async function loadLastRacesForCircuit(countryName, limit = 5) {
    const body = document.getElementById("circuit-races-body");
    body.innerHTML = `
    <tr><td colspan="3">Carregando corridas...</td></tr>
  `;

    try {
        const res = await fetch(
            `${BASE_URL}/meetings?country_name=${encodeURIComponent(countryName)}`
        );
        if (!res.ok) {
            throw new Error("Erro ao buscar meetings: " + res.status);
        }
        let meetings = await res.json();

        // ordenar por ano decrescente e pegar as últimas N corridas
        meetings.sort((a, b) => b.year - a.year);
        meetings = meetings.slice(0, limit);

        // para cada meeting, buscar vencedor da corrida (session_name=Race)
        const rows = [];

        await Promise.all(
            meetings.map(async (m) => {
                const sessionsRes = await fetch(
                    `${BASE_URL}/sessions?meeting_key=${m.meeting_key}&session_name=Race`
                );
                if (!sessionsRes.ok) return;
                const sessions = await sessionsRes.json();
                if (!sessions.length) return;

                const raceSessionKey = sessions[0].session_key;

                const resultRes = await fetch(
                    `${BASE_URL}/session_result?session_key=${raceSessionKey}&position=1`
                );
                if (!resultRes.ok) return;
                const result = await resultRes.json();
                const winner = result.length ? result[0] : null;

                rows.push({
                    year: m.year,
                    name: m.meeting_name,
                    winner: winner ? winner.full_name || winner.broadcast_name : "-",
                    meeting_key: m.meeting_key,
                });

            })
        );

        body.innerHTML = "";
        if (!rows.length) {
            body.innerHTML = `<tr><td colspan="3">Nenhuma corrida encontrada.</td></tr>`;
            return;
        }

        rows
            .sort((a, b) => b.year - a.year)
            .forEach((row) => {
                const tr = document.createElement("tr");
                tr.classList.add("clickable-row");

                const yearCell = document.createElement("td");
                yearCell.textContent = row.year;

                const nameCell = document.createElement("td");
                nameCell.textContent = row.name;

                const winnerCell = document.createElement("td");
                winnerCell.textContent = row.winner;

                tr.appendChild(yearCell);
                tr.appendChild(nameCell);
                tr.appendChild(winnerCell);

                // clique → página da corrida
                tr.addEventListener("click", () => {
                    window.location.href = `race.html?meeting_key=${row.meeting_key}`;
                });

                body.appendChild(tr);
            });

    } catch (e) {
        console.error(e);
        body.innerHTML = `<tr><td colspan="3">Erro ao carregar corridas.</td></tr>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadCircuitPage().catch(console.error);
});
