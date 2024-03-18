const form = document.querySelector("#form");
const addTags = document.querySelector("#add-tag");

const tagsList = new Set(["waifu"]);

const tagsElement = [];

addTags.addEventListener("click", () => {
  const addedTag = document.querySelector("#options").value;

  addTagToList(addedTag);
  addTagInDOM(addedTag);
  addEventToRemoveTagsInDom(addedTag);
  addEventToRemoveTagsFromTheList(addedTag);
});

function addTagToList(addedTag) {
  if (addedTag === "") return;

  console.log(tagsList);
  tagsList.add(addedTag);
  console.log(tagsList);
}

function addTagInDOM(addedTag) {
  if (addedTag === "") return;
  if (verifyIfTagExists(addedTag)) return;

  const tagElement = document.createElement("li");
  tagElement.style =
    "display: inline-block; padding: .25rem .25rem; background-color: #F855B1; border-radius: .5rem; font-size: .5rem; font-weight: 700; color: #fff; margin: 0.5rem 0.25rem 0;";
  tagElement.innerHTML = addedTag;

  const containerTags = document.querySelector("#Tags__Container");
  containerTags.appendChild(tagElement);

  tagsElement.push(tagElement);
}

function verifyIfTagExists(addedTag) {
  for (let i = 0; i < tagsElement.length; i++) {
    if (tagsElement[i].innerHTML === addedTag) {
      return true;
    }
  }
}

function addEventToRemoveTagsFromTheList(addedTag) {
  for (let i = 0; i < tagsElement.length; i++) {
    if (tagsElement[i].innerHTML === addedTag) {
      tagsElement[i].addEventListener("click", () => {
        tagsList.delete(addedTag);
        tagsElement.splice(tagsElement.indexOf(addedTag), 1);
      });
    }
  }
}

function addEventToRemoveTagsInDom() {
  for (let i = 0; i < tagsElement.length; i++) {
    tagsElement[i].addEventListener("click", () => {
      console.log(tagsElement[i]);
      tagsElement[i].remove();

      console.log(tagsElement);
    });
  }
}

form.addEventListener("submit", async (event) => {
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

  console.log(queryParams.toString());

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
      "Ocorreu um erro ao buscar a waifu, tente novamente ou verifique sua conexão com a internet.",
    );

    return false;
  }

  return true;
}

function changingTheButtonState() {
  const button = document.querySelector("#search-waifu");

  if (button.value === "Buscar Waifu") {
    button.value = "Buscando Waifu...";
  } else {
    button.value = "Buscar Waifu";
  }
}

function removeStylesImage() {
  const image = document.querySelector("#waifu-image");

  image.classList.remove("relative");
}

function addImageToDOM(waifuImageURL) {
  const image = document.querySelector("#waifu-image");

  loadingImageDom(image, waifuImageURL);

  setTimeout(() => {
    image.src = waifuImageURL;
  }, 750);
}

function loadingImageDom(image, waifuImageURL) {
  if (image.src !== waifuImageURL) {
    image.src = "./assets/loading/loading.svg";
  }
}

async function addImageForDownload(waifuImageURL) {
  const downloadLink = document.querySelector("#download");

  const imageBlob = await fetch(waifuImageURL).then((response) =>
    response.blob(),
  );

  downloadLink.href = URL.createObjectURL(imageBlob);
}
