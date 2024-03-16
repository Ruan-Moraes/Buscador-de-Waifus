const form = document.querySelector("#form");
const addTags = document.querySelector("#add-tag");

const tagsList = new Set(['waifu']);


addTags.addEventListener("click", () => {
  const options = document.querySelector("#options").value;

  const tags = document.querySelector("#tags");
  const li = document.createElement("li");

  li.style = "display: inline-block; padding: .25rem .25rem; background-color: #F855B1; border-radius: .5rem; font-size: .5rem; font-weight: 700; color: #fff; margin: 0.5rem 0.25rem 0;";
  
  if (options === "") {
    alert("Você deve preencher o campo de tags para adicionar uma nova tag.");
  } else {
    tagsList.add(options);

    for (const tag of tagsList) {
      li.innerHTML = tag;

      tags.appendChild(li);
    }

    for(let i = 0; i < tags.children.length; i++) {
      tags.children[i].addEventListener("click", () => {
        tagsList.delete(tags.children[i].innerHTML);
        tags.removeChild(tags.children[i]);
      });
    }
  }

  console.log(tagsList);
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  changingTheButtonState();

  const paramsUrl = createRequest(Array.from(tagsList));
  const waifuImageURL = await getWaifu(paramsUrl);

  if (verifyIfImageExists(waifuImageURL)) {
    changingTheButtonState();

    addImageToDOM(waifuImageURL);
    addImageForDownload(waifuImageURL);
  }
});

function createRequest(tags) {
  const params = {
    included_tags: tags,
  };

  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (Array.isArray(params[key])) {
      params[key].forEach((value) => {
        queryParams.append(key, value);
      });
    } else {
      queryParams.set(key, params[key]);
    }
  }

  console.log(queryParams.toString())

  return queryParams.toString();
}

async function getWaifu(paramsUrl) {
  const apiUrl = "https://api.waifu.im/search";
  const requestUrl = `${apiUrl}?${paramsUrl}`;

  try {
    return await fetch(requestUrl).then((response) => response.json()).then((response) => response.images[0].url);
  } catch (error) {
    changingTheButtonState();

    console.error(`Ocorreu um erro: ${error}`);
  }
}

function verifyIfImageExists(waifuImageURL) {
  if (waifuImageURL === undefined) {
    alert("Não foi possível encontrar uma waifu com essas tags, tente novamente.");

    return false;
  }

  return true;
}

function changingTheButtonState () {
  const button = document.querySelector("#search-waifu");
  
  if (button.innerHTML === "Buscar Waifu") {
    button.innerHTML = "Buscando Waifu...";
  } else {
    button.innerHTML = "Buscar Waifu";
  }
}

function addImageToDOM(waifuImageURL) { 
  const image = document.querySelector("#waifu-image");

  loadingImageDom(image, waifuImageURL)

  setTimeout(() => {
    image.src = waifuImageURL;
  }, 500);
}

function loadingImageDom (image, waifuImageURL) {
  if (image.src !== waifuImageURL) {
    image.src = "./assets/loading/loading.svg";
  }
}

async function addImageForDownload(waifuImageURL) {
  const downloadLink = document.querySelector("#download");

  const imageBlob = await fetch(waifuImageURL).then((response) => response.blob());

  downloadLink.href = URL.createObjectURL(imageBlob);
}

