let channelSlug = 'grids-hm5t9ups8u8'; // The “slug” is just the end of the URL.

// DOM elements for modal and grid
let gridContainer = document.querySelector('#grid-container');
let modalDialog = document.querySelector('.modal');
let closeButton = document.querySelector('#close-modal');
let modalBody = document.querySelector('#modal-body');

// This is an empty array that will store all are.na blocks
let arenaBlocks = [];

// Map block type to CSS class
// I used LLM here to style each tile in my grid system according to its content type. 
// The way it works is that it takes a black object as an input and it checks what type of content it is. For each know type, it returns a string (i.e. type-image). 
const typeToClass = (block) => {
	const types = {
		'Image': 'type-image',
		'Link': 'type-link',
		'Embed': 'type-embed',
		'Attachment': 'type-attachment',
		'Text': 'type-text'
	};
	return types[block?.type] || '';
};

// Basic metadata rendering
let placeChannelInfo = (channelData) => {
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
		modalBody.innerHTML = textItem; modalDialog.showModal()
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

// Fetch helper
let fetchJson = (url, callback) => {
	fetch(url, { cache: 'no-store' })
		.then((response) => response.json())
		.then((json) => callback(json));
};


// Grid population logic
const populateGrid = () => {
	const shuffled = [...arenaBlocks].sort(() => Math.random() - 0.5);
	//https://www.freecodecamp.org/news/how-to-shuffle-an-array-of-items-using-javascript-or-typescript/
	// Here I am creating an array of my shuffled blocks so that the grid is generate randomly each time we reload the page
	const size = window.innerWidth <= 500 ? window.innerWidth / 8 : window.innerWidth <= 1000 ? 48 : 48;
	const count = Math.floor(window.innerWidth / size) * Math.ceil(window.innerHeight / size + 2);
	
	// Sets the grid's HTML to the string and renders the grid. This creates an array with count elements (one for each grid tile)
	gridContainer.innerHTML = Array.from({ length: count }, () => {
		// With a 15% chance, if there are blocks available, it will pick a random block from the shuffled list and return an <li> element. The data-block-index attribute points to the block's index in the main array. Otherwise, it will return an empty tile.
		if (Math.random() < 0.15 && shuffled.length) {
			const block = shuffled[Math.floor(Math.random() * shuffled.length)];
			return `<li class="tile has-block ${typeToClass(block)}" data-block-index="${arenaBlocks.indexOf(block)}"></li>`;
		}
		return '<li class="tile"></li>';
	}).join('');
	// Joins all the <li> elements into one HTML string
};

// Filter by showing and hiding tiles instead of regenerating the grid
const filterButtons = document.querySelectorAll('#filter .tile');

filterButtons.forEach(button => {
	button.addEventListener('click', () => {
		// Find what type this button is
		const type = [...button.classList].find(c => c.startsWith('type-'));
		
		const active = button.classList.contains('active');
		filterButtons.forEach(btn => btn.classList.remove('active'));
		
		if (active) {
			document.querySelectorAll('#grid-container .has-block').forEach(tile => {
				tile.classList.remove('hidden');
			});
		} else {
			button.classList.add('active');
			
			// I'm asking it to loop through every tile and hide tiles that don't match the active content type
			document.querySelectorAll('#grid-container .has-block').forEach(tile => {
				if (tile.classList.contains(type)) {
					tile.classList.remove('hidden'); // show matching tiles
				} else {
					tile.classList.add('hidden'); // hide non-matching tiles
				}
			});
		}
	});
});

// Fetch blocks and populate grid
fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
	arenaBlocks = json.data || [];
	populateGrid();
});

closeButton.addEventListener('click', () => modalDialog.close());

window.addEventListener('resize', populateGrid);