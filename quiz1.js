// Quiz questions, options, and answers
const questions = [
    { question: 'What is the rarest M&M candy color?', options: ['Brown', 'Blue', 'Yellow', 'Green'], correctAnswer: 'Brown' },
    { question: 'What is the collective noun for a group of pandas?', options: ['A Group', 'An embarrassment', 'A troup', 'A grove'], correctAnswer: 'An embarrassment' },
    { question: 'From which country does Gouda cheese originate?', options: ['Netherlands', 'Norway', 'USA', 'Denmark'], correctAnswer: 'Netherlands' },
    { question: 'Which Disney Princess talks to the most animals?', options: ['Jasmine', 'Ariel', 'Rapunzel', 'Snow White'], correctAnswer: 'Snow White' },
    { question: 'How many colors are there in the rainbow?', options: ['Five', 'Seven', 'Ten', 'Eleven'], correctAnswer: 'Seven' },
    { question: 'Which country invented ice cream?', options: ['Japan', 'Russia', 'China', 'Germany'], correctAnswer: 'China' },
    { question: 'How many hearts does an octopus have?', options: ['One', 'Two', 'Three', 'Six'], correctAnswer: 'Three' }
];

let score = 0;
let currentQuestionIndex = 0;
let incorrectAnswers = [];

function displayQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById('question').textContent = question.question;
        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('button');
            optionElement.textContent = option;
            optionElement.classList.add('option');
            optionElement.onclick = function () { selectOption(index); };
            optionsContainer.appendChild(optionElement);
        });
    } else {
        showResults();
    }
}

function selectOption(index) {
    const question = questions[currentQuestionIndex];
    const correct = question.correctAnswer === question.options[index];
    if (!correct) {
        incorrectAnswers.push({ question: question.question, correctAnswer: question.correctAnswer });
    } else {
        score++;
    }
    currentQuestionIndex++;
    displayQuestion();
}

function showResults() {
    const result = document.getElementById('result');
    result.textContent = `Quiz completed! Your score is ${score} out of ${questions.length}. Here are the correct answers for the questions you answered wrong:`;
    incorrectAnswers.forEach(item => {
        const info = document.createElement('p');
        info.textContent = `Question: ${item.question} - Correct Answer: ${item.correctAnswer}`;
        result.appendChild(info);
    });
    document.getElementById('options-container').innerHTML = ''; // Clear options
    document.getElementById('question').textContent = '';
}

window.onload = displayQuestion;
