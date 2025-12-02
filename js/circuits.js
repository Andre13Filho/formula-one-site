

const CIRCUITS = [
  {
    slug: "australia",
    title: "Albert Park Circuit",
    country_name: "Australia",
    city: "Melbourne",
    laps: 58,
    lap_length_km: 5.278,
    race_distance_km: 306.124,
    image: "Australia_Circuit.jpg",
  },
  {
    slug: "china",
    title: "Shanghai International Circuit",
    country_name: "China",
    city: "Shanghai",
    laps: 56,
    lap_length_km: 5.451,
    race_distance_km: 305.066,
    image: "China_Circuit.jpg",
  },
  {
    slug: "japan",
    title: "Suzuka International Racing Course",
    country_name: "Japan",
    city: "Suzuka",
    laps: 53,
    lap_length_km: 5.807,
    race_distance_km: 307.471,
    image: "Japan_Circuit.jpg",
  },
  {
    slug: "bahrain",
    title: "Bahrain International Circuit",
    country_name: "Bahrain",
    city: "Sakhir",
    laps: 57,
    lap_length_km: 5.412,
    race_distance_km: 308.238,
    image: "Bahrain_Circuit.jpg",
  },
  {
    slug: "saudi-arabia",
    title: "Jeddah Corniche Circuit",
    country_name: "Saudi Arabia",
    city: "Jeddah",
    laps: 50,
    lap_length_km: 6.174,
    race_distance_km: 308.450,
    image: "Saudi_Arabia_Circuit.jpg",
  },
  {
    slug: "miami",
    title: "Miami International Autodrome",
    country_name: "United States",
    city: "Miami",
    laps: 57,
    lap_length_km: 5.412,
    race_distance_km: 308.326,
    image: "Miami_Circuit.jpg",
  },
  {
    slug: "emilia-romagna",
    title: "Autodromo Enzo e Dino Ferrari",
    country_name: "Italy",
    city: "Imola",
    laps: 63,
    lap_length_km: 4.909,
    race_distance_km: 309.049,
    image: "Emilia_Romagna_Circuit.jpg",
  },
  {
    slug: "monaco",
    title: "Circuit de Monaco",
    country_name: "Monaco",
    city: "Monte Carlo",
    laps: 78,
    lap_length_km: 3.337,
    race_distance_km: 260.286,
    image: "Monaco_Circuit.jpg",
  },
  {
    slug: "spain",
    title: "Circuit de Barcelona-Catalunya",
    country_name: "Spain",
    city: "Montmeló",
    laps: 66,
    lap_length_km: 4.657,
    race_distance_km: 307.236,
    image: "Spain_Circuit.jpg",
  },
  {
    slug: "canada",
    title: "Circuit Gilles-Villeneuve",
    country_name: "Canada",
    city: "Montreal",
    laps: 70,
    lap_length_km: 4.361,
    race_distance_km: 305.270,
    image: "Canada_Circuit.jpg",
  },
  {
    slug: "austria",
    title: "Red Bull Ring",
    country_name: "Austria",
    city: "Spielberg",
    laps: 71,
    lap_length_km: 4.318,
    race_distance_km: 306.452,
    image: "Austria_Circuit.jpg",
  },
  {
    slug: "great-britain",
    title: "Silverstone Circuit",
    country_name: "United Kingdom",
    city: "Silverstone",
    laps: 52,
    lap_length_km: 5.891,
    race_distance_km: 306.198,
    image: "Great_Britain_Circuit.jpg",
  },
  {
    slug: "belgium",
    title: "Circuit de Spa-Francorchamps",
    country_name: "Belgium",
    city: "Stavelot",
    laps: 44,
    lap_length_km: 7.004,
    race_distance_km: 308.052,
    image: "Belgium_Circuit.jpg",
  },
  {
    slug: "hungary",
    title: "Hungaroring",
    country_name: "Hungary",
    city: "Mogyoród",
    laps: 70,
    lap_length_km: 4.381,
    race_distance_km: 306.630,
    image: "Hungary_Circuit.jpg",
  },
  {
    slug: "netherlands",
    title: "Circuit Zandvoort",
    country_name: "Netherlands",
    city: "Zandvoort",
    laps: 72,
    lap_length_km: 4.259,
    race_distance_km: 306.587,
    image: "Netherlands_Circuit.jpg",
  },
  {
    slug: "italy-monza",
    title: "Autodromo Nazionale Monza",
    country_name: "Italy",
    city: "Monza",
    laps: 53,
    lap_length_km: 5.793,
    race_distance_km: 306.720,
    image: "Italy_Circuit.jpg",
  },
  {
    slug: "azerbaijan",
    title: "Baku City Circuit",
    country_name: "Azerbaijan",
    city: "Baku",
    laps: 51,
    lap_length_km: 6.003,
    race_distance_km: 306.049,
    image: "Baku_Circuit.jpg",
  },
  {
    slug: "singapore",
    title: "Marina Bay Street Circuit",
    country_name: "Singapore",
    city: "Singapore",
    laps: 61,
    lap_length_km: 5.063,
    race_distance_km: 308.706,
    image: "Singapore_Circuit.jpg",
  },
  {
    slug: "usa-cota",
    title: "Circuit of the Americas",
    country_name: "United States",
    city: "Austin",
    laps: 56,
    lap_length_km: 5.513,
    race_distance_km: 308.405,
    image: "USA_Circuit.jpg",
  },
  {
    slug: "mexico",
    title: "Autódromo Hermanos Rodríguez",
    country_name: "Mexico",
    city: "Mexico City",
    laps: 71,
    lap_length_km: 4.304,
    race_distance_km: 305.354,
    image: "Mexico_Circuit.jpg",
  },
  {
    slug: "brazil",
    title: "Autódromo José Carlos Pace",
    country_name: "Brazil",
    city: "São Paulo",
    laps: 71,
    lap_length_km: 4.309,
    race_distance_km: 305.879,
    image: "Brazil_Circuit.jpg",
  },
  {
    slug: "las-vegas",
    title: "Las Vegas Strip Circuit",
    country_name: "United States",
    city: "Las Vegas",
    laps: 50,
    lap_length_km: 6.201,
    race_distance_km: 310.050,
    image: "Las_Vegas_Circuit.jpg",
  },
  {
    slug: "qatar",
    title: "Lusail International Circuit",
    country_name: "Qatar",
    city: "Lusail",
    laps: 57,
    lap_length_km: 5.419,
    race_distance_km: 308.611,
    image: "Qatar_Circuit.jpg",
  },
  {
    slug: "abu-dhabi",
    title: "Yas Marina Circuit",
    country_name: "United Arab Emirates",
    city: "Abu Dhabi",
    laps: 58,
    lap_length_km: 5.281,
    race_distance_km: 306.183,
    image: "Abu_Dhabi_Circuit.jpg",
  },
];



function renderCircuitsGrid() {
  const grid = document.getElementById("circuits-grid");
  if (!grid) return;

  CIRCUITS.forEach((circuit) => {
    const card = document.createElement("div");
    card.className = "circuit-card";

    const img = document.createElement("img");
    img.src = `../style/images/circuits-images/logos/${circuit.image}`;
    img.alt = circuit.title;

    const nameDiv = document.createElement("div");
    nameDiv.className = "circuit-card-name";
    nameDiv.textContent = circuit.title;

    card.appendChild(img);
    card.appendChild(nameDiv);

    card.addEventListener("click", () => {
      
      window.location.href = `circuit.html?slug=${circuit.slug}&country=${encodeURIComponent(
        circuit.country_name
      )}`;
    });

    grid.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", renderCircuitsGrid);
