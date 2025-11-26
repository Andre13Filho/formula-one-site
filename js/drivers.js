const BASE_URL = "https://api.openf1.org/v1";

async function fetchDrivers() {
  const res = await fetch(`${BASE_URL}/drivers?session_key=latest`);
  if (!res.ok) {
    throw new Error("Erro ao buscar drivers: " + res.status);
  }
  const data = await res.json();
  // ordenar por número
  data.sort((a, b) => a.driver_number - b.driver_number);
  return data;
}

// 1. preencher select de pilotos
async function populateDriversSelect(drivers) {
  const select = document.getElementById("drivers-select");
  if (!select) return;

  drivers.forEach((d) => {
    const option = document.createElement("option");
    option.value = d.driver_number;
    option.textContent = `${d.driver_number} – ${d.full_name}`;
    select.appendChild(option);
  });
}

// 2. montar grade de cartões
function renderDriversGrid(drivers) {
  const grid = document.getElementById("drivers-grid");
  if (!grid) return;

  const placeholderSrc = "../style/images/drivers/driver-placeholder.png";

  drivers.forEach((d) => {
    const card = document.createElement("div");
    card.className = "driver-card";

    const img = document.createElement("img");
    const localSrc = `../style/images/drivers/${d.driver_number}.png`;
    img.src = localSrc;
    img.alt = d.full_name;
    img.onerror = () => {
      img.src = placeholderSrc;
    };

    const infoDiv = document.createElement("div");
    infoDiv.className = "driver-card-info";

    const nameEl = document.createElement("h3");
    nameEl.textContent = d.full_name;

    const teamEl = document.createElement("p");
    teamEl.textContent = d.team_name || "-";

    const numberEl = document.createElement("p");
    numberEl.textContent = `Número: ${d.driver_number}`;

    infoDiv.appendChild(nameEl);
    infoDiv.appendChild(teamEl);
    infoDiv.appendChild(numberEl);

    card.appendChild(img);
    card.appendChild(infoDiv);

    // clique no cartão -> driver.html
    card.addEventListener("click", () => {
      window.location.href = `driver.html?driver_number=${d.driver_number}`;
    });

    grid.appendChild(card);
  });
}

// 3. form de busca (igual ao driver page)
function setupDriversSearchForm() {
  const form = document.getElementById("drivers-search-form");
  const select = document.getElementById("drivers-select");
  if (!form || !select) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = select.value;
    if (!value) return;
    window.location.href = `driver.html?driver_number=${value}`;
  });
}

// 4. boot
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const drivers = await fetchDrivers();
    await populateDriversSelect(drivers);
    renderDriversGrid(drivers);
    setupDriversSearchForm();
  } catch (e) {
    console.error(e);
    const grid = document.getElementById("drivers-grid");
    if (grid) {
      grid.textContent = "Erro ao carregar lista de pilotos.";
    }
  }
});
