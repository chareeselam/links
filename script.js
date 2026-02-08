let gridContainer = document.querySelector('#grid-container');
let modalDialog = document.querySelector('#media-content');
let closeButton = document.querySelector('#close-modal');

let modalBody = document.querySelector('#modal-body');
let modalTitle = document.querySelector('#modal-title');
let modalDescription = document.querySelector('#modal-description');

// this is an empty array that will store all are.na blocks
// from what i'm understanding, every tile will reference an index from this array which will get filled after fetching data
let arenaBlocks = [];

const typeToClass = (block) => {
  switch (block?.type) {
    case 'Image': return 'type-image';
    case 'Link': return 'type-link';
    case 'Embed': return 'type-embed';
    case 'Attachment': return 'type-attachment';
    case 'Text': return 'type-text';
    // default: return 'type-unknown';
  }
};

const renderModal = (block) => {
  modalBody.innerHTML = '';

  modalTitle.textContent =
    block?.title || block?.generated_title || block?.type || 'Untitled';

  modalDescription.innerHTML =
    block?.description?.html ||
    block?.content_html ||
    block?.content ||
    '';

  if (block.type === 'Image' && block.image?.display?.url) {
    modalBody.innerHTML =
      `<img src="${block.image.display.url}" alt="${block.image.alt_text || ''}">`;
  }

  else if (block.type === 'Link' && block.image?.display?.url) {
    modalBody.innerHTML =
      `<img src="${block.image.display.url}" alt="${block.image.alt_text || ''}">`;
  }

  else if (block.type === 'Attachment' && block.attachment?.url) {
    const ct = block.attachment.content_type || '';

    if (ct.includes('image')) {
      modalBody.innerHTML = `<img src="${block.attachment.url}" alt="">`;
    } else if (ct.includes('video')) {
      modalBody.innerHTML = `<video controls src="${block.attachment.url}"></video>`;
    } else if (ct.includes('audio')) {
      modalBody.innerHTML = `<audio controls src="${block.attachment.url}"></audio>`;
    } else {
      modalBody.innerHTML =
        `<p>Attachment: <a href="${block.attachment.url}" target="_blank" rel="noopener">Open ↗</a></p>`;
    }
  }

  else if (block.type === 'Embed' && block.embed?.html) {
    modalBody.innerHTML = block.embed.html;
  }
};


const populateGrid = () => {
  gridContainer.innerHTML = '';

  const tileSize = 48;
  const cols = Math.floor(window.innerWidth / tileSize);
  const rows = Math.floor(window.innerHeight / tileSize);
  const totalTiles = cols * rows;

  for (let i = 0; i < totalTiles; i++) {
    const li = document.createElement('li');
    li.classList.add('tile');

    if (arenaBlocks.length && Math.random() < 0.15) {
      const idx = Math.floor(Math.random() * arenaBlocks.length);
      const block = arenaBlocks[idx];

      li.dataset.blockIndex = idx;
      li.classList.add('has-block');
      li.classList.add(typeToClass(block));
    }

    gridContainer.appendChild(li);
  }
}

gridContainer.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (!tile) return;

    const idx = Number(tile.dataset.blockIndex);
    if (!Number.isFinite(idx) || !arenaBlocks[idx]) return;

    renderModal(arenaBlocks[idx]);
    modalDialog.showModal();
});

closeButton.addEventListener('click', () => modalDialog.close());

window.addEventListener('resize', populateGrid);
