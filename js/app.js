const input = document.getElementById("pokemonInput");
const button = document.getElementById("searchBtn");

const pokemonCard = document.getElementById("pokemonCard");

const pokemonName = document.getElementById("pokemonName");
const pokemonImage = document.getElementById("pokemonImage");
const pokemonId = document.getElementById("pokemonId");

const pokemonTypes = document.getElementById("pokemonTypes");
const pokemonAbilities = document.getElementById("pokemonAbilities");
const pokemonStats = document.getElementById("pokemonStats");
const pokemonMoves = document.getElementById("pokemonMoves");
const pokemonEvolutions = document.getElementById("pokemonEvolutions");

const errorMessage = document.getElementById("errorMessage");

button.addEventListener("click", () => {
  const pokemon = input.value.toLowerCase().trim();

  if (pokemon !== "") {
    fetchPokemon(pokemon);
  }
});

async function fetchPokemon(pokemon) {

  try {

    errorMessage.textContent = "";

    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon}`
    );

    if (!response.ok) {
      throw new Error("Pokémon no encontrado");
    }

    const data = await response.json();

    displayPokemon(data);

    fetchEvolution(data.species.url);

  } catch (error) {

    pokemonCard.classList.add("hidden");
    errorMessage.textContent = error.message;
  }
}

function displayPokemon(data) {

  pokemonCard.classList.remove("hidden");

  pokemonName.textContent =
    data.name.toUpperCase();

  pokemonId.textContent = data.id;

  pokemonImage.src =
    data.sprites.other["official-artwork"].front_default;

  // TIPOS

  pokemonTypes.innerHTML = "";

  data.types.forEach(typeInfo => {

    const span = document.createElement("span");

    span.textContent = typeInfo.type.name;

    span.classList.add("type");
    span.classList.add(typeInfo.type.name);

    pokemonTypes.appendChild(span);
  });

  // HABILIDADES

  pokemonAbilities.innerHTML = "";

  data.abilities.forEach(ability => {

    const li = document.createElement("li");

    li.textContent = ability.ability.name;

    pokemonAbilities.appendChild(li);
  });

  // ESTADÍSTICAS

  pokemonStats.innerHTML = "";

  data.stats.forEach(stat => {

    const li = document.createElement("li");

    li.textContent =
      `${stat.stat.name}: ${stat.base_stat}`;

    pokemonStats.appendChild(li);
  });

  // MOVIMIENTOS

  pokemonMoves.innerHTML = "";

  data.moves.slice(0, 10).forEach(move => {

    const li = document.createElement("li");

    li.textContent = move.move.name;

    pokemonMoves.appendChild(li);
  });
}

async function fetchEvolution(speciesUrl) {

  const speciesResponse = await fetch(speciesUrl);
  const speciesData = await speciesResponse.json();

  const evolutionResponse = await fetch(
    speciesData.evolution_chain.url
  );

  const evolutionData = await evolutionResponse.json();

  displayEvolutions(evolutionData.chain);
}

function displayEvolutions(chain) {

  pokemonEvolutions.innerHTML = "";

  let current = chain;

  while (current) {

    const li = document.createElement("li");

    li.textContent = current.species.name;

    pokemonEvolutions.appendChild(li);

    current = current.evolves_to[0];
  }
}