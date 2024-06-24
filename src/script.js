const apiUrl = "https://pokeapi.co/api/v2/pokemon/";
const imgElement = document.getElementById("img_sprite_front_default");
const nameElement = document.getElementById("name");
const baseExperienceElement = document.getElementById("baseExperience");
const heightElement = document.getElementById("height");
const weightElement = document.getElementById("weight");

const PAGE_SIZE = 20;

const pokemonData = {
  results: [],
  item: 1,
  next: null,
  previous: null,
  count: null,
  final: null,
}

function setFinalPageAddress() {
  const toCut = pokemonData.count % PAGE_SIZE ;
  const offset = pokemonData.count - (toCut ?? PAGE_SIZE);
  pokemonData.final = `${apiUrl}?limit=${PAGE_SIZE}&offset=${offset}`;
}

async function getPage(direction) {
  const data = await fetch(pokemonData?.[direction] ?? apiUrl)
    .then((response) => response.json());

    pokemonData.results = data.results;
    pokemonData.count = data.count;
    pokemonData.next = data.next ?? apiUrl;
    pokemonData.previous = data.previous ?? pokemonData.final;
}

async function getPreviousPage() {
  await getPage("previous");
  pokemonData.item = pokemonData.results.length;
}

async function getNextPage() {
  await getPage("next");
  pokemonData.item = 1;
}

async function previousPokemon() {
  const newPageItem = pokemonData.item - 1;
  pokemonData.item = newPageItem;
  if (newPageItem < 1) {
    await getPreviousPage();
  }
  await getPokemon();
}

async function nextPokemon() {
  const newPageItem = pokemonData.item + 1;
  pokemonData.item = newPageItem;
  if (newPageItem > pokemonData.results.length) {
    await getNextPage();
  }
  await getPokemon();
}

function renderPokemon(data) {
  const nullImg = "../assets/missingno.png";
  imgElement.src = data.sprites.front_default ?? nullImg;
  nameElement.innerText = data.name;
  heightElement.innerText = data.height;
  baseExperienceElement.innerText = data.base_experience;
  weightElement.innerText = data.weight;
}

async function getPokemon() {
  const pokemon = pokemonData.results[pokemonData.item - 1];
  data = await fetch(pokemon.url).then((response) => response.json());
  renderPokemon(data);
}

async function startPokedex() {
  await getPage();
  setFinalPageAddress();
  await getPokemon();
}

startPokedex();