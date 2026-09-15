'use strict';

const tagsList = new Set(['waifu']);

// Initialize the 'waifu' tag in the DOM
document.addEventListener('DOMContentLoaded', () => {
  addTagInDOM('waifu');
});

const availableTagsData = [
  { group: 'SFW / Standard', tags: ['waifu', 'maid', 'uniform', 'selfies'] },
  { group: 'Characters', tags: ['genshin-impact', 'raiden-shogun', 'kamisato-ayaka', 'marin-kitagawa', 'mori-calliope', 'rem', 'one-piece', 'nami'] },
  { group: 'Ecchi / Spicy', tags: ['ecchi', 'oppai'] },
  { group: 'NSFW (18+)', tags: ['ero', 'hentai', 'milf', 'ass', 'paizuri', 'oral'] },
];

const tagInput = document.querySelector('#tagInput');
const dropdownMenu = document.querySelector('#dropdownMenu');

// Render Custom Dropdown
function renderDropdown(filter = '') {
  dropdownMenu.innerHTML = '';
  let hasItems = false;
  
  availableTagsData.forEach(category => {
    const filteredTags = category.tags.filter(t => t.includes(filter.toLowerCase()));
    
    if (filteredTags.length > 0) {
      hasItems = true;
      const groupHeader = document.createElement('div');
      groupHeader.className = 'px-4 py-2 text-xs font-bold text-waifupink-300 uppercase tracking-widest bg-black/40';
      groupHeader.innerText = category.group;
      dropdownMenu.appendChild(groupHeader);
      
      filteredTags.forEach(tag => {
        const option = document.createElement('div');
        option.className = 'px-4 py-3 text-sm text-gray-200 cursor-pointer hover:bg-waifupink-600/30 transition-colors';
        option.innerText = tag;
        option.addEventListener('mousedown', (e) => {
          e.preventDefault(); // prevent blur
          tagInput.value = tag;
          dropdownMenu.classList.add('hidden');
          document.querySelector('#addTag').click();
        });
        dropdownMenu.appendChild(option);
      });
    }
  });
  
  if (!hasItems) {
    const noOption = document.createElement('div');
    noOption.className = 'px-4 py-3 text-sm text-gray-500 italic';
    noOption.innerText = 'No tags found...';
    dropdownMenu.appendChild(noOption);
  }
}

// Show/Hide/Filter logic
tagInput.addEventListener('focus', () => {
  renderDropdown(tagInput.value);
  dropdownMenu.classList.remove('hidden');
});

tagInput.addEventListener('blur', () => {
  dropdownMenu.classList.add('hidden');
});

tagInput.addEventListener('input', (e) => {
  renderDropdown(e.target.value);
  dropdownMenu.classList.remove('hidden');
});

const addTag = document.querySelector('#addTag');
addTag.addEventListener('click', () => {
  const addedTag = tagInput.value.trim().toLowerCase();

  if (addedTag) {
    addTagToList(addedTag);
    addTagInDOM(addedTag);
    tagInput.value = ''; // Clear input after adding
    dropdownMenu.classList.add('hidden');
  }
});

const form = document.querySelector('#waifuSearchSettings');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  addTag.click();
});

function addTagToList(addedTag) {
  if (addedTag === '') return;
  tagsList.add(addedTag);
}

function addTagInDOM(addedTag) {
  if (addedTag === '') return;
  if (verifyIfTagExists(addedTag)) return;

  const tagElement = document.createElement('li');
  // Tailwind glass styling for tags
  tagElement.className = 'cursor-pointer bg-waifupink-500/20 text-waifupink-200 border border-waifupink-500/30 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-waifupink-500/40 transition-colors flex items-center gap-2 shadow-[0_0_10px_rgba(236,72,153,0.1)]';
  tagElement.innerHTML = `${addedTag} <span class="text-waifupink-400 hover:text-white">&times;</span>`;
  tagElement.dataset.tag = addedTag;

  const containerTags = document.querySelector('#tagsContainer');
  containerTags.appendChild(tagElement);
  
  // Attach event immediately for the new tag
  tagElement.addEventListener('click', () => {
    tagsList.delete(addedTag);
    tagElement.remove();
  });
}

function verifyIfTagExists(addedTag) {
  const tagsElement = document.querySelectorAll('#tagsContainer li');
  for (let i = 0; i < tagsElement.length; i++) {
    if (tagsElement[i].dataset.tag === addedTag) return true;
  }
  return false;
}

function addEventToRemove() {
  // Events are now handled during creation in addTagInDOM
}

// Main function
document.querySelector('#searchWaifu').addEventListener('click', async () => {
  changingTheButtonState(true);

  const paramsUrl = createRequest(Array.from(tagsList));
  const waifuImageURL = await getWaifu(paramsUrl);

  if (waifuImageURL) {
    await addImageToDOM(waifuImageURL);
    addImageForDownload(waifuImageURL);
  }

  changingTheButtonState(false);
});

function changingTheButtonState(isSearching) {
  const buttonText = document.querySelector('#searchWaifuText');
  const button = document.querySelector('#searchWaifu');
  const loadingIndicator = document.querySelector('#loadingIndicator');
  const image = document.querySelector('#waifuImage');

  if (isSearching) {
    buttonText.innerText = 'Searching Waifu...';
    button.classList.add('opacity-80', 'pointer-events-none');
    
    // Show Loading
    loadingIndicator.classList.remove('opacity-0');
    image.classList.add('opacity-30');
  } else {
    buttonText.innerText = 'Search Waifu';
    button.classList.remove('opacity-80', 'pointer-events-none');
  }
}

function createRequest(included_tags) {
  const nsfwTags = ['ecchi', 'oppai', 'ero', 'hentai', 'milf', 'ass', 'paizuri', 'oral'];
  const hasNsfwTag = included_tags.some(tag => nsfwTags.includes(tag));
  const isNsfwToggle = document.querySelector('#nsfwToggle').checked;

  const params = {
    IncludedTags: included_tags,
  };

  // Enable NSFW if toggle is checked OR a specific NSFW tag was explicitly added
  if (isNsfwToggle || hasNsfwTag) {
    params.IsNsfw = 'true';
  }

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
  const apiUrl = 'https://api.waifu.im/images';
  const requestUrl = `${apiUrl}?${paramsUrl}`;

  try {
    return await fetch(requestUrl)
      .then((response) => response.json())
      .then((response) => {
        if (response.items && response.items.length > 0) {
           return response.items[0].url;
        }
        throw new Error('No items found');
      });
  } catch (error) {
    console.error(error);
    alert(`We couldn't find a waifu with the selected tags. Please try again!`);
    return false;
  }
}

function addImageToDOM(waifuImageURL) {
  return new Promise((resolve) => {
    const image = document.querySelector('#waifuImage');
    const loadingIndicator = document.querySelector('#loadingIndicator');

    if (image.src === waifuImageURL) {
      alert('This image is already loaded!');
      resolve();
      return;
    }

    // Preload image
    const tempImg = new Image();
    tempImg.src = waifuImageURL;
    tempImg.onload = () => {
      image.src = waifuImageURL;
      
      // Hide loading, show image
      loadingIndicator.classList.add('opacity-0');
      image.classList.remove('opacity-30');
      image.classList.add('max-w-full', 'max-h-[600px]', 'object-contain', 'transition-opacity', 'duration-500', 'ease-in-out');
      
      resolve();
    };
  });
}

async function addImageForDownload(waifuImageURL) {
  const downloadLink = document.querySelector('#downloadTheWaifu');

  try {
    const imageBlob = await fetch(waifuImageURL).then((response) =>
      response.blob()
    );

    downloadLink.href = URL.createObjectURL(imageBlob);
    
    // Make button active
    downloadLink.classList.remove('opacity-50', 'pointer-events-none');
    downloadLink.classList.add('hover:bg-waifupink-500/20', 'hover:text-waifupink-300', 'hover:border-waifupink-500/50');
    downloadLink.download = `waifu_${Date.now()}.jpg`;
  } catch(e) {
    console.error("Failed to fetch image for download", e);
  }
}
