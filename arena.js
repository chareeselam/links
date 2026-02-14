let channelSlug = 'grids-hm5t9ups8u8'; // The “slug” is just the end of the URL.
let myUsername = 'michael-french'; // For linking to your profile.

// DOM elements for modal and grid
let gridContainer = document.querySelector('#grid-container');
let modalDialog = document.querySelector('.modal');
let closeButton = document.querySelector('#close-modal');
let modalBody = document.querySelector('#modal-body');

// this is an empty array that will store all are.na blocks
let arenaBlocks = [];

// Map block type to CSS class
// I used LLM here to style each tile in my grid system according to its content type. 
//The way it works is that it takes a black object as an input and it checks what type of content it is. For each know type, it returns a string (i.e. type-image). 
const typeToClass = (block) => {
	const types = {
		'Image': 'type-image',
		'Link': 'type-link',
		'Embed': 'type-embed',
		'Attachment': 'type-attachment',
		'Text': 'type-text'
	};
	return types[block?.type] || '';
	// default: return 'type-unknown';
};

// Basic metadata rendering
let placeChannelInfo = (channelData) => {
	let channelTitle = document.querySelector('#channel-title');
	let channelDescription = document.querySelector('#channel-description');
	let channelCount = document.querySelector('#channel-count');
	let channelLink = document.querySelector('#channel-link');

	if (channelTitle) channelTitle.innerHTML = channelData.title;
	if (channelDescription) channelDescription.innerHTML = channelData.description.html;
	if (channelCount) channelCount.innerHTML = channelData.counts.blocks;
	if (channelLink) channelLink.href = `https://www.are.na/channel/${channelSlug}`;
};

// Modal open/close and tile click
gridContainer.addEventListener('click', (e) => {
//This function sets up a click event listener within the grid container and when clicked, the function runs.
	const tile = e.target.closest('.tile');
	// This is asking if the clicked element or any of its ancestors has the class 'tile'
	if (!tile) return;
	// If no interaction with a tile, the function does nothing
	
	const idx = Number(tile.dataset.blockIndex);
	// This converts the block index from a string to a number
	if (!Number.isFinite(idx) || !arenaBlocks[idx]) return;
	// If the index isn't a valid number, or there is no block at that index, the function does nothing
	const blockData = arenaBlocks[idx];
	// This retrieves the block data from the arenaBlocks array at the specified index
		
	if (blockData.type == 'Link') {
		let linkItem =

			`
			<li class="type-link">
				<figure>
					<picture>
						<source media="(max-width: 500px)" srcset="${blockData.image.small.src_2x}">
						<source media="(max-width: 1000px)" srcset="${blockData.image.medium.src_2x}">
						<img alt="${blockData.image.alt_text}" src="${blockData.image.large.src_2x}">
					</picture>	
					<figcaption>
						<h2>${blockData.title}</h2>
						<p>${blockData.description?.html || ''}</p>
					</figcaption>
				</figure>
				<p><a href="${blockData.source.url}">See the original ↗</a></p>
			</li>
			`
		modalBody.innerHTML = linkItem; modalDialog.showModal();
	}

	else if (blockData.type == 'Image') {

		let imageItem =
			`
			<li class="type-image">
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
		modalBody.innerHTML = imageItem; modalDialog.showModal();
	}


  else if (blockData.type == 'Text') {
	let textItem =
		`
		<li class="type-text">
			<div class="text-content">${blockData.content.html}</div>
			<figcaption>
				<h2>${blockData.title}</h2>
				<p>${blockData.description?.html || ''}</p>
			</figcaption>
		</li>
		`

	modalBody.innerHTML = textItem; modalDialog.showModal();
	
  }

  else if (blockData.type == 'Attachment') {
	let contentType = blockData.attachment.content_type;
	
	if (contentType.includes('video')) {
		let videoItem =
			`
			<li class="type-attachment">
				<video controls src="${blockData.attachment.url}"></video>
				<figcaption>
					<h2>${blockData.title}</h2>
					<p>${blockData.description?.html || ''}</p>
				</figcaption>
			</li>
			`
	modalBody.innerHTML = videoItem; modalDialog.showModal();
	}

	else if (contentType.includes('pdf')) {
		let pdfItem =
			`
			<li class="type-attachment">
				<embed src="${blockData.attachment.url}" type="application/pdf" width="100%" height="600px">
				<figcaption>
					<h2>${blockData.title}</h2>
					<p>${blockData.description?.html || ''}</p>
				</figcaption>
			</li>
			`
		modalBody.innerHTML = pdfItem; modalDialog.showModal();
	}

	else if (contentType.includes('audio')) {
		let audioItem =
			`
			<li class="type-attachment">
				<audio controls src="${blockData.attachment.url}"></audio>
				<figcaption>
					<h2>${blockData.title}</h2>
					<p>${blockData.description?.html || ''}</p>
				</figcaption>
			</li>
			`
	modalBody.innerHTML = audioItem; modalDialog.showModal();
	}
  }

	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type;

	if (embedType.includes('video')) {
		let linkedVideoItem =
			`
			<li class="type-embed">
				${blockData.embed.html}
				<figcaption>
					<h2>${blockData.title}</h2>
					<p>${blockData.description?.html || ''}</p>
				</figcaption>
			</li>
			`
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
// fetchJson(`https://api.are.na/v3/users/${myUsername}/`, (json) => {
// 	renderUser(json);
// });

// Fetch blocks and populate grid
fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
	arenaBlocks = json.data || [];
	populateGrid();
});

// Grid population logic
const populateGrid = () => {
	const shuffled = [...arenaBlocks].sort(() => Math.random() - 0.5);
	const size = window.innerWidth <= 500 ? window.innerWidth / 8 : window.innerWidth <= 1000 ? 48 : 48;
	const count = Math.floor(window.innerWidth / size) * Math.ceil(window.innerHeight / size + 2);
	
	gridContainer.innerHTML = Array.from({ length: count }, () => {
		if (Math.random() < 0.15 && shuffled.length) {
			const block = shuffled[Math.floor(Math.random() * shuffled.length)];
			return `<li class="tile has-block ${typeToClass(block)}" data-block-index="${arenaBlocks.indexOf(block)}"></li>`;
		}
		return '<li class="tile"></li>';
	}).join('');
};

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