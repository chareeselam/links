let blackBox = document.querySelector('.black-box')
let modalDialog = document.querySelector('#media-content')
let closeButton = modalDialog.querySelector('button')

blackBox.addEventListener('click', () => { // “Listen” for clicks.
	modalDialog.showModal() // This opens it up.
})

closeButton.addEventListener('click', () => {
	modalDialog.close() // And this closes it!
})