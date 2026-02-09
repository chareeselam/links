// --- Combined arena.js and script.js ---

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
    // Example template, not inserted
    let imageItem =
    	`
		<li>
			<p><em>Link</em></p>
			<figure>
				<picture>
					<source media="(width < 500px)" srcset="${blockData.image.small.src_2x}">
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
    // Not inserted
  }

  else if (blockData.type == 'Text') {
    let textItem =
    	`
		<li>
			<p><em>Text</em></p>
			<div class="text-content">${blockData.content.html}</div>
		</li>
		`
    // Not inserted
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
		`;
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
    `\n<address>\n  <img src="${userData.avatar}">\n  <h3>${userData.name}</h3>\n  <p><a href="https://are.na/${userData.slug}">Are.na profile ↗</a></p>\n</address>\n`;
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

// --- END Combined File ---













let channelSlug = 'grids-hm5t9ups8u8' // The “slug” is just the end of the URL.
let myUsername = 'michael-french' // For linking to your profile.



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (channelData) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = channelData.title
	channelDescription.innerHTML = channelData.description.html
	channelCount.innerHTML = channelData.counts.blocks
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (blockData) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (blockData.type == 'Link') {
		// Declares a “template literal” of the dynamic HTML we want.
		let linkItem =
			`
			<li>
				<p><em>Link</em></p>
				<figure>
					<picture>
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
					<figcaption>
						<h2>${ blockData.title }</h2>
						<p>${ blockData.description.html }</p>
					</figcaption>
				</figure>
				<p><a href="${ blockData.source.url }">See the original ↗</a></p>
			</li>
			`

		// And puts it into the page!
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)

		// More on template literals:
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
	}

	// Images!
	else if (blockData.type == 'Image') {
		// …up to you!
		let imageItem =
			`
			<li>
				<p><em>Link</em></p>
				<figure>
					<picture>
						<source media="(width < 500px)" srcset="${ blockData.image.small.src_2x }">
						<source media="(width < 1000px)" srcset="${ blockData.image.medium.src_2x }">
						<img alt="${blockData.image.alt_text}" src="${ blockData.image.large.src_2x }">
					</picture>
					<figcaption>
						<h2>${ blockData.title }</h2>
						<p>${ blockData.description.html }</p>
					</figcaption>
				</figure>
				<p><a href="${ blockData.source.url }">See the original ↗</a></p>
			</li>
			`
	}

	// Text!
	else if (blockData.type == 'Text') {
		// …up to you!
		let textItem =
			`
			<li>
				<p><em>Text</em></p>
				<div class="text-content">${ blockData.content.html }</div>
			</li>
			`
	}

	// Uploaded (not linked) media…
	else if (blockData.type == 'Attachment') {
		let contentType = blockData.attachment.content_type // Save us some repetition.

		// Uploaded videos!
		if (contentType.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li>
					<p><em>Video</em></p>
					<video controls src="${ blockData.attachment.url }"></video>
				</li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', videoItem)

			// More on `video`, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (contentType.includes('pdf')) {
			// …up to you!
		}

		// Uploaded audio!
		else if (contentType.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li>
					<p><em>Audio</em></p>
					<audio controls src="${ blockData.attachment.url }"></video>
				</li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', audioItem)

			// More on`audio`:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked (embedded) media…
	else if (blockData.type == 'Embed') {
		let embedType = blockData.embed.type

		// Linked video!
		if (embedType.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
				`
				<li>
					<p><em>Linked Video</em></p>
					${ blockData.embed.html }
				</li>
				`

			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)

			// More on `iframe`:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		// Linked audio!
		else if (embedType.includes('rich')) {
			// …up to you!
		}
	}
}



// A function to display the owner/collaborator info:
let renderUser = (userData) => {
	let channelUsers = document.querySelector('#channel-users') // Container.

	let userAddress =
		`
		<address>
			<img src="${ userData.avatar }">
			<h3>${ userData.name }</h3>
			<p><a href="https://are.na/${ userData.slug }">Are.na profile ↗</a></p>
		</address>
		`

	channelUsers.insertAdjacentHTML('beforeend', userAddress)
}



// Finally, a helper function to fetch data from the API, then run a callback function with it:
let fetchJson = (url, callback) => {
	fetch(url, { cache: 'no-store' })
		.then((response) => response.json())
		.then((json) => callback(json))
}

// More on `fetch`:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch


// Now that we have said all the things we *can* do, go get the channel data:
fetchJson(`https://api.are.na/v3/channels/${channelSlug}`, (json) => {
	console.log(json) // Always good to check your response!

	placeChannelInfo(json) // Pass all the data to the first function, above.
	renderUser(json.owner) // Pass just the nested object `.owner`.
})

// Get your info to put with the owner's:
fetchJson(`https://api.are.na/v3/users/${myUsername}/`, (json) => {
	console.log(json) // See what we get back.

	renderUser(json) // Pass this to the same function, no nesting.
})

fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
  arenaBlocks = json.data || [];
  populateGrid();
});


// fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
//     arenaBlocks = json.data; // Store the blocks in our global array
//     populateGrid(); // Call this ONLY after data has arrived
// });

// // And the data for the blocks:
// fetchJson(`https://api.are.na/v3/channels/${channelSlug}/contents?per=100&sort=position_desc`, (json) => {
// 	console.log(json) // See what we get back.

// 	// Loop through the nested `.data` array (list).
// 	json.data.forEach((blockData) => {
// 		// console.log(blockData) // The data for a single block.

// 		renderBlock(blockData) // Pass the single block’s data to the render function.
// 	})
// })


