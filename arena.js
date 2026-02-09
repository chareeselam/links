let channelSlug = 'grids-hm5t9ups8u8'; // The “slug” is just the end of the URL.
let myUsername = 'michael-french'; // For linking to your profile.

// DOM elements for modal and grid
let gridContainer = document.querySelector('#grid-container');
let modalDialog = document.querySelector('#media-content');
let closeButton = document.querySelector('#close-modal');
let modalBody = document.querySelector('#modal-body');
let modalTitle = document.querySelector('#modal-title');
let modalDescription = document.querySelector('#modal-description');

// this is an empty array that will store all are.na blocks
let arenaBlocks = [];

// Map block type to CSS class
const typeToClass = (block) => {
  switch (block?.type) {
    case 'Image': return 'type-image';
    case 'Link': return 'type-link';
    case 'Embed': return 'type-embed';
    case 'Attachment': return 'type-attachment';
    case 'Text': return 'type-text';
    default: return 'type-unknown';
  }
};

// Modal rendering for a block
const renderModal = (block) => {
	modalBody.innerHTML = '';
	modalTitle.textContent =
		block?.title || block?.generated_title || block?.type || 'Untitled';
	modalDescription.innerHTML =
		block?.description?.html ||
		block?.content_html ||
		block?.content ||
		'';

	if (block.type === 'Image' && block.image) {
		const imageUrl =
			block.image.display?.url ||
			block.image.large?.src ||
			block.image.original?.url;
		if (imageUrl) {
			modalBody.innerHTML =
				`<img src="${imageUrl}" alt="${block.image.alt_text || ''}">`;
		}
	}
	else if (block.type === 'Text') {
		// Show text content in the modal
		modalBody.innerHTML = `<div class="text-content">${block.content?.html || block.content || ''}</div>`;
	}
	else if (block.type === 'Link' && block.image) {
		const imageUrl =
			block.image.display?.url ||
			block.image.large?.src ||
			block.image.original?.url;
		if (imageUrl) {
			modalBody.innerHTML =
				`<img src="${imageUrl}" alt="${block.image.alt_text || ''}">`;
		}
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

// Basic metadata rendering
let placeChannelInfo = (channelData) => {
	let channelTitle = document.querySelector('#channel-title');
	let channelDescription = document.querySelector('#channel-description');
	let channelCount = document.querySelector('#channel-count');
	let channelLink = document.querySelector('#channel-link');

	channelTitle.innerHTML = channelData.title;
	channelDescription.innerHTML = channelData.description.html;
	channelCount.innerHTML = channelData.counts.blocks;
	channelLink.href = `https://www.are.na/channel/${channelSlug}`;
};

// Block rendering for channel blocks
let renderBlock = (blockData) => {
  let channelBlocks = document.querySelector('#channel-blocks');

	if (blockData.type == 'Link') {
		let linkItem =
		
			`
			<li>
				<p><em>Link</em></p>
				<figure>
					<picture><source media="(width < 500px)" srcset="${blockData.image.small.src_2x}">
						<source media="(width < 1000px)" srcset="${blockData.image.medium.src_2x}">
						<img alt="${blockData.image.alt_text}" src="${blockData.image.large.src_2x}">
					</picture>
					<figcaption>
						<h2>${blockData.title}</h2>
						<p>${blockData.description.html}</p>
					</figcaption>
				</figure>
				<p><a href="${blockData.source.url}">See the original ↗</a></p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem);
	}

  	else if (blockData.type == 'Image') {
  	// console.log('Rendering image block:', blockData);

		let imageItem =
			`
			<li>
			<p><em>Image</em></p>
			<figure>
				<picture>
				<source media="(max-width: 500px)" srcset="${blockData.image?.small?.src_2x || ''}">
				<source media="(max-width: 1000px)" srcset="${blockData.image?.medium?.src_2x || ''}">
				<img alt="${blockData.image?.alt_text || ''}" src="${blockData.image?.large?.src_2x || ''}">
				</picture>
				<figcaption>
				<h2>${blockData.title || ''}</h2>
				<p>${blockData.description?.html || ''}</p>
				</figcaption>
			</figure>
			</li>
			`;
		channelBlocks.insertAdjacentHTML('beforeend', imageItem);
	}


  else if (blockData.type == 'Text') {
    let textItem =
    	`
		<li>
			<p><em>Text</em></p>
			<div class="text-content">${blockData.content.html}</div>
		</li>
		`

	channelBlocks.insertAdjacentHTML('beforeend', textItem);
    
  }

  else if (blockData.type == 'Attachment') {
    let contentType = blockData.attachment.content_type;
    
	if (contentType.includes('video')) {
		let videoItem =
			`
			<li>
				<p><em>Video</em></p>
				<video controls src="${blockData.attachment.url}"></video>
			</li>
			`
      channelBlocks.insertAdjacentHTML('beforeend', videoItem);
    }

    else if (contentType.includes('pdf')) {
      // Not implemented
    }

	else if (contentType.includes('audio')) {
		let audioItem =
			`
			<li>
				<p><em>Audio</em></p>
				<audio controls src="${blockData.attachment.url}"></audio>
			</li>
			`
      channelBlocks.insertAdjacentHTML('beforeend', audioItem);
    }
  }

	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type;

	if (embedType.includes('video')) {
		let linkedVideoItem =
			`
			<li>
				<p><em>Linked Video</em></p>
				${blockData.embed.html}
			</li>
			`
      channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem);
    }
    else if (embedType.includes('rich')) {
      // Not implemented
    }
  }
};

// User rendering
let renderUser = (userData) => {
	let channelUsers = document.querySelector('#channel-users');
	let userAddress =
    	`
		<address>
			<img src="${userData.avatar}">
			<h3>${userData.name}</h3>
			<p><a href="https://are.na/${userData.slug}">Are.na profile ↗</a></p>
		</address>
		`

  channelUsers.insertAdjacentHTML('beforeend', userAddress);
};

// Fetch helper
let fetchJson = (url, callback) => {
	fetch(url, { cache: 'no-store' })
		.then((response) => response.json())
		.then((json) => callback(json));
};

// Fetch and render channel info
fetchJson(`https://api.are.na/v3/channels/${channelSlug}`, (json) => {
	placeChannelInfo(json);
	renderUser(json.owner);
});

// Fetch and render user info
fetchJson(`https://api.are.na/v3/users/${myUsername}/`, (json) => {
	renderUser(json);
});

// Fetch blocks and populate grid
fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
	arenaBlocks = json.data || [];
	populateGrid();
});

// Grid population logic
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
};

// Modal open/close and tile click
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