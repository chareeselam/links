let channelSlug = 'grids-hm5t9ups8u8'; // The “slug” is just the end of the URL.
let myUsername = 'michael-french'; // For linking to your profile.

// DOM elements for modal and grid
let gridContainer = document.querySelector('#grid-container');
let modalDialog = document.querySelector('#media-content');
let closeButton = document.querySelector('#close-modal');
let modalBody = document.querySelector('#modal-body');
let modalTitle = document.querySelector('#modal-title');
let modalDescription = document.querySelector('#modal-description');

// // Track current block index for navigation
// let currentBlockIndex = -1;

// this is an empty array that will store all are.na blocks
let arenaBlocks = [];

// Map block type to CSS class
// I used LLM here to style each tile in my grid system according to its content type. 
//The way it works is that it takes a black object as an input and it checks what type of content it is. For each know type, it returns a string (i.e. type-image). 
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

// Modal open/close and tile click
gridContainer.addEventListener('click', (e) => {
	const tile = e.target.closest('.tile');
	if (!tile) return;
	
	const idx = Number(tile.dataset.blockIndex);
	if (!Number.isFinite(idx) || !arenaBlocks[idx]) return;
	
	const blockData = arenaBlocks[idx];
	
	// Set title and description
	// This sets the title of the modal dialog when a block is opened
	modalTitle.textContent = blockData?.title
	// This sets the modal's description area to show the block's description or an empty string if none exists
	modalDescription.innerHTML = blockData?.description?.html || '';
	
	if (blockData.type == 'Link') {
		let linkItem =

			`
			<li class="type-link">
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
		// channelBlocks.insertAdjacentHTML('beforeend', linkItem);
		modalBody.innerHTML = linkItem; modalDialog.showModal();
	}

	else if (blockData.type == 'Image') {
	// console.log('Rendering image block:', blockData);

		let imageItem =
			`
			<li class="type-image">
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
		// channelBlocks.insertAdjacentHTML('beforeend', imageItem);
		modalBody.innerHTML = imageItem; modalDialog.showModal();
	}


  else if (blockData.type == 'Text') {
	let textItem =
		`
		<li class="type-text">
			<p><em>Text</em></p>
			<div class="text-content">${blockData.content.html}</div>
		</li>
		`

	// channelBlocks.insertAdjacentHTML('beforeend', textItem);
	modalBody.innerHTML = textItem; modalDialog.showModal();
	
  }

  else if (blockData.type == 'Attachment') {
	let contentType = blockData.attachment.content_type;
	
	if (contentType.includes('video')) {
		let videoItem =
			`
			<li class="type-attachment">
				<p><em>Video</em></p>
				<video controls src="${blockData.attachment.url}"></video>
			</li>
			`
	//   channelBlocks.insertAdjacentHTML('beforeend', videoItem);
	modalBody.innerHTML = videoItem; modalDialog.showModal();
	}

	else if (contentType.includes('pdf')) {
		let pdfItem =
			`
			<li class="type-attachment">
				<p><em>PDF</em></p>
				<embed src="${blockData.attachment.url}" type="application/pdf" width="100%" height="400px">
			</li>
			`
		// channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
		modalBody.innerHTML = pdfItem; modalDialog.showModal();
	}

	else if (contentType.includes('audio')) {
		let audioItem =
			`
			<li class="type-attachment">
				<p><em>Audio</em></p>
				<audio controls src="${blockData.attachment.url}"></audio>
			</li>
			`
	//   channelBlocks.insertAdjacentHTML('beforeend', audioItem);
	modalBody.innerHTML = audioItem; modalDialog.showModal();
	}
  }

	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type;

	if (embedType.includes('video')) {
		let linkedVideoItem =
			`
			<li class="type-embed">
				<p><em>Linked Video</em></p>
				${blockData.embed.html}
			</li>
			`
	//   channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem);
	modalBody.innerHTML = linkedVideoItem; modalDialog.showModal();
	}
  }
});


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

	// Shuffle blocks to get random distribution
	const shuffledBlocks = [...arenaBlocks].sort(() => Math.random() - 0.5);
	let blockCounter = 0;

	for (let i = 0; i < totalTiles; i++) {
		const li = document.createElement('li');
		li.classList.add('tile');

		// Assign blocks to ~15% of tiles, cycling through shuffled blocks
		if (arenaBlocks.length && Math.random() < 0.15 && blockCounter < shuffledBlocks.length) {
			const block = shuffledBlocks[blockCounter];
			const originalIdx = arenaBlocks.indexOf(block);
			li.dataset.blockIndex = originalIdx;
			li.classList.add('has-block');
			li.classList.add(typeToClass(block));
			blockCounter++;
		}

		gridContainer.appendChild(li);
	}
};

//From CD Tutor
// Modal open/close and tile click
// gridContainer.addEventListener('click', (e) => {
// 	const tile = e.target.closest('.tile');

// 	if (!tile) return;
// 	const idx = Number(tile.dataset.blockIndex);

// 	if (!Number.isFinite(idx) || !arenaBlocks[idx]) return;
// 	renderModal(arenaBlocks[idx], idx);
//   	modalDialog.showModal();
// });

// // Modal open/close and tile click
// gridContainer.addEventListener('click', (e) => {
// 	const tile = e.target.closest('.tile');
// 	if (!tile) return;
	
// 	const idx = Number(tile.dataset.blockIndex);
// 	if (!Number.isFinite(idx) || !arenaBlocks[idx]) return;
	
// 	const block = arenaBlocks[idx];
	
// 	// Set title and description
// 	// This sets the title of the modal dialog when a block is opened
// 	modalTitle.textContent = block?.title
// 	// This sets the modal's description area to show the block's description or an empty string if none exists
// 	modalDescription.innerHTML = block?.description?.html || '';
	
// 	let content = '';
	
// 	if (block.type === 'Image' && block.image) {
// 		content = `<img src="${block.image?.large?.src_2x || ''}" alt="${block.image?.alt_text || ''}">`;
// 	}
// 	else if (block.type === 'Link' && block.image) {
// 		content = `<img src="${block.image.large.src_2x}" alt="${block.image.alt_text}">
// 			<p><a href="${block.source.url}" target="_blank">See the original ↗</a></p>`;
// 	}
// 	else if (block.type === 'Text') {
// 		content = `<div class="text-content">${block.content.html}</div>`;
// 	}
// 	else if (block.type === 'Attachment') {
// 		const ct = block.attachment.content_type;
// 		if (ct.includes('video')) {
// 			content = `<video controls src="${block.attachment.url}"></video>`;
// 		}
// 		else if (ct.includes('pdf')) {
// 			content = `<embed src="${block.attachment.url}" type="application/pdf" width="100%" height="400px">`;
// 		}
// 		else if (ct.includes('audio')) {
// 			content = `<audio controls src="${block.attachment.url}"></audio>`;
// 		}
// 	}
// 	else if (block.type === 'Embed' && block.embed) {
// 		content = block.embed.html;
// 	}
	
// 	modalBody.innerHTML = content;
// 	modalDialog.showModal();
// });

//From CD Tutor
// // Navigation functions
// const showNextBlock = () => {
// 	const nextIndex = (currentBlockIndex + 1) % arenaBlocks.length;
// 	renderModal(arenaBlocks[nextIndex], nextIndex);
// };

// const showPrevBlock = () => {
// 	const prevIndex = (currentBlockIndex - 1 + arenaBlocks.length) % arenaBlocks.length;
// 	renderModal(arenaBlocks[prevIndex], prevIndex);
// };

// // Create navigation buttons
// const createNavButtons = () => {
// 	const prevButton = document.createElement('button');
// 	prevButton.id = 'prev-block';
// 	prevButton.innerHTML = '←';
// 	prevButton.addEventListener('click', showPrevBlock);

// 	const nextButton = document.createElement('button');
// 	nextButton.id = 'next-block';
// 	nextButton.innerHTML = '→';
// 	nextButton.addEventListener('click', showNextBlock);

// 	modalDialog.appendChild(prevButton);
// 	modalDialog.appendChild(nextButton);
// };

// // Initialize nav buttons when DOM is ready
// createNavButtons();

// // Keyboard navigation
// document.addEventListener('keydown', (e) => {
// 	if (!modalDialog.open) return;
	
// 	if (e.key === 'ArrowRight') {
// 		showNextBlock();
// 	} else if (e.key === 'ArrowLeft') {
// 		showPrevBlock();
// 	} else if (e.key === 'Escape') {
// 		modalDialog.close();
// 	}
// });

// modalButton.addEventListener('click', () => { // “Listen” for clicks.
// 	modalDialog.showModal() // This opens it up.
// })

closeButton.addEventListener('click', () => modalDialog.close());

window.addEventListener('resize', populateGrid);