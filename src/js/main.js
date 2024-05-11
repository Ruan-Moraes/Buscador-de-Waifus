"use strict";

const waifuSearchSettings = document.querySelector("#waifuSearchSettings");
const addTag = document.querySelector("#addTag");

const tagsList = new Set(["waifu"]);

addTag.addEventListener("click", () => {
  const addedTag = document.querySelector("#availableLabels").value;

  addTagToList(addedTag);
  addTagInDOM(addedTag);
  addEventToRemove();
});

function addTagToList(addedTag) {
  if (addedTag === "") return;

  tagsList.add(addedTag);
}

function addTagInDOM(addedTag) {
  if (addedTag === "") return;
  if (verifyIfTagExists()) return;

  const tagElement = document.createElement("li");
  tagElement.classList.add("Tag__Item");
  tagElement.innerHTML = addedTag;

  const containerTags = document.querySelector("#Tags__Container");
  containerTags.appendChild(tagElement);
}

function verifyIfTagExists() {
  const tagsElement = document.querySelectorAll("#Tags__Container li");

  for (let i = 0; i < tagsElement.length; i++) {
    if (
      tagsElement[i].innerHTML ===
      document.querySelector("#availableLabels").value
    )
      return true;
  }

  return false;
}

function addEventToRemove() {
  const tagsElement = document.querySelectorAll("#Tags__Container li");

  tagsElement.forEach((tag) => {
    tag.addEventListener("click", () => {
      tagsList.delete(tag.innerHTML);
      tag.remove();
    });
  });
}

waifuSearchSettings.addEventListener("submit", async (event) => {
  event.preventDefault();

  changingTheButtonState();

  const paramsUrl = createRequest(Array.from(tagsList));
  const waifuImageURL = await getWaifu(paramsUrl);

  changingTheButtonState();

  if (verifyIfImageExists(waifuImageURL)) {
    removeStylesImage();

    addImageToDOM(waifuImageURL);
    addImageForDownload(waifuImageURL);
  }
});

function createRequest(included_tags) {
  const params = {
    included_tags: included_tags,
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

  return queryParams.toString();
}

async function getWaifu(paramsUrl) {
  const apiUrl = "https://api.waifu.im/search";
  const requestUrl = `${apiUrl}?${paramsUrl}`;

  try {
    return await fetch(requestUrl)
      .then((response) => response.json())
      .then((response) => response.images[0].url);
  } catch (error) {
    console.error(`Ocorreu um erro: ${error}`);

    return false;
  }
}

function verifyIfImageExists(waifuImageURL) {
  if (waifuImageURL === undefined || waifuImageURL === false) {
    alert(
      "Não foi possível encontrar uma waifu com as tags selecionadas. Tente novamente! Lembre-se de está conectado a internet.",
    );

    return false;
  }

  return true;
}

function changingTheButtonState() {
  const button = document.querySelector("#searchWaifu");

  if (button.value === "Buscar Waifu") {
    button.value = "Buscando Waifu...";
  } else {
    button.value = "Buscar Waifu";
  }
}

function removeStylesImage() {
  const image = document.querySelector("#waifuImage");

  image.classList.remove("relative");
}

function addImageToDOM(waifuImageURL) {
  const image = document.querySelector("#waifuImage");

  PlaceLoadingSVG(image, waifuImageURL);

  setTimeout(() => {
    image.src = waifuImageURL;
  }, 250);
}

function PlaceLoadingSVG(image, waifuImageURL) {
  console.log(image)
  console.log(waifuImageURL)

  if (image.src !== waifuImageURL) {
    image.src = "./assets/loading/loading.svg";
  }

  setTimeout(() => {
    const ImageURL = image.src;
    const pathToLoadingSVG = "/assets/loading/loading.svg";

    console.log(ImageURL);
    console.log(pathToLoadingSVG);
    console.log(ImageURL.endsWith(pathToLoadingSVG));

    if (ImageURL.endsWith(pathToLoadingSVG)) {
      console.log("A imagem está sendo carregada, aguarde um momento.3");
      notifyImageUpload();
    }
  }, 3000);
}

function notifyImageUpload() {
  alert("A imagem está sendo carregada, aguarde um momento.");
}

async function addImageForDownload(waifuImageURL) {
  const downloadLink = document.querySelector("#downloadTheWaifu");

  const imageBlob = await fetch(waifuImageURL).then((response) =>
    response.blob(),
  );

  downloadLink.href = URL.createObjectURL(imageBlob);
}
