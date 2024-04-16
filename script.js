const rowCards = document.getElementById("row-cards");

const divFooter = document.getElementById("info-footer");
let currentPage = 1;

const getInfos = async () => {
  try {
    const character = await api.get("/character");
    const amountCharacter = character.data.info.count;

    const location = await api.get("/location");
    const amountLocation = location.data.info.count;

    const episode = await api.get("/episode");
    const amountEpisode = episode.data.info.count;

    divFooter.innerHTML = `<p>PERSONAGENS: <span>${amountCharacter}</span></p> <p>LOCALIZAÇÕES: <span>${amountLocation}</span></p><p> EPISÓDIOS: <span>${amountEpisode}</span></p>`;
  } catch (error) {
    console.log(error);
  }
};

getInfos();

const defaultFilters = {
  name: "",
  status: "",
  species: "",
  type: "",
  gender: "",
  page: currentPage,
  pageSize: 6,
};

async function getCharacter(filters) {
  try {
    const response = await api.get("character/", { params: filters });
    return response.data.results;
  } catch (error) {
    console.log("Erro ao obter personagens:", error);
    return [];
  }
}

async function render({ characters, totalItems, pageSize, currentPage }) {
  rowCards.innerHTML = ""; // Limpa o conteúdo antes de renderizar novamente
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  for (let i = startIndex; i < endIndex; i++) {
    const character = characters[i];
    rowCards.innerHTML += `
      <div class="col-12 ">
        <div class="card my-2" alt="">
          <img src="${character.image}" class="card-img-top"..." />
          <div class="card-body ">
            <h5 class="card-title"><b>Nome:</b>${character.name}</h5>
            <p class="card-text"><b>Status:</b>
            ${character.status}
            </p>
            <p class="card-text"><b>Espécie:</b>
            ${character.species}
            </p>
            <p class="card-text my-text-body">
            <b>Última localização conhecida: </b></br>
            ${character.location.name}
          </p>
          <p class="card-text ">
          </p>
          
          <button
          type="button"
          class="badge text-bg-info"
          data-bs-toggle="modal"
          data-bs-target="#myModal${i}"
        >
         Info
        </button>
          </div>
        </div>
      </div>
      <!-- Modal ------------------------>
      <div
        class="modal fade"
        id="myModal${i}"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <img src="${character.image}" class="card-img-top"..." />
             
            </div>
            <div class="modal-body">
              <!-- Conteúdo da modal aqui -->
           
              <p><b>Nome:</b> ${character.name}</p>
              <p><b>Status:</b> ${character.status}</p>
              <p><b>Espécie:</b> ${character.species}</p>
              
              <p><b>Gênero:</b> ${character.gender}</p>
              <p><b>Origem:</b> ${character.origin.name}</p>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Fechar
              
            </div>
          </div>
        </div>
      </div>`;
  }

  // Atualiza o rodapé com informações de paginação
  divFooter.innerHTML = `<p>PERSONAGENS: <span>${totalItems}</span></p><br> <p>LOCALIZAÇÕES: <span>${totalItems}</span></p><b></b><p> EPISÓDIOS: <span>${totalItems}</span></p><p>Página ${currentPage} de ${Math.ceil(
    totalItems / pageSize
  )}</p>`;
}

async function loadCharacters() {
  try {
    const characters = await getCharacter(defaultFilters);
    const totalItems = characters.length;
    render({
      characters,
      totalItems,
      pageSize: defaultFilters.pageSize,
      currentPage,
    });
  } catch (error) {
    console.log("Erro ao carregar personagens:", error);
  }
}

const prevPage = async () => {
  if (currentPage > 1) {
    currentPage--;
    defaultFilters.page = currentPage;
    await loadCharacters();
  }
};

const nextPage = async () => {
  currentPage++;
  defaultFilters.page = currentPage;
  await loadCharacters();
};

window.onload = loadCharacters;
