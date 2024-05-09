// Array of image paths for social media icons
const images = ['Images/facebook.png', 'Images/twitter.png', 'Images/instagram.png', 'Images/linkedin.png', 'Images/youtube.png', 'Images/reddit.png', 'Images/whatsapp.png', 'Images/tiktok.png'];

// Preload images
const imageObjects = images.map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

// Duplicate the array of social media image paths to create pairs
let cardsArray = [...images, ...images];

// Shuffle the array to randomize the positions of symbols
cardsArray.sort(() => Math.random() - 0.5);

let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;

// Function to flip a card when clicked
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        console.log('First card flipped:', firstCard);
        return;
    }

    secondCard = this;
    console.log('Second card flipped:', secondCard);
    checkForMatch();
}
// Function to check if the flipped cards match
function checkForMatch() {
    let isMatch = firstCard.querySelector('img').src === secondCard.querySelector('img').src;

    console.log('Matching:', isMatch);

    isMatch ? disableCards() : unflipCards();
}
// Function to disable matched cards
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}
// Function to flip unmatched cards back
function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}
// Function to reset the board after each turn
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}
// Function to shuffle the cards' positions
function shuffle() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        let randomPos = Math.floor(Math.random() * cardsArray.length);
        card.style.order = randomPos;
    });
}

const grid = document.querySelector('.grid');

// Function to create a card
function createCard(imagePath) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<div class="card-inner">
                          <div class="card-front"></div>
                          <div class="card-back"><img src="${imagePath}" alt="Social Media Icon"></div>
                      </div>`;
    card.addEventListener('click', flipCard);
    return card;
}


// Create cards based on the shuffled array of image paths
cardsArray.forEach(imagePath => {
    const card = createCard(imagePath);
    grid.appendChild(card);
});


const restartButton = document.getElementById('restart-btn');

// Restart button event listener
restartButton.addEventListener('click', () => {
    // Reload the page to restart the game
    location.reload();
});
let matchedPairs = 0;
const totalPairs = images.length;
// Function to check for matching pairs
function checkForMatch() {
    let isMatch = firstCard.querySelector('img').src === secondCard.querySelector('img').src;

    console.log('Matching:', isMatch);

    if (isMatch) {
        disableCards();
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            displayCongratsMessage();
        }
    } else {
        unflipCards();
    }
}
// Display congratulation message when all images are matched
function displayCongratsMessage() {
    const congratsMessage = document.createElement('div');
    congratsMessage.classList.add('congrats-message');
    congratsMessage.textContent = 'Congratulations! You have won!';
    document.body.appendChild(congratsMessage);
}

shuffle();
