const questions = [
    { question: 'What is the largest continent, by land mass?', options: ['Asia', 'North America', 'South America', 'Africa'], correctAnswer: 'Asia' },
    { question: 'What type of tree is pictured on the Lebanese flag?', options: ['Common Fig Tree', 'Green Cedar Tree', 'Weeping Fig', 'Red Frangipani'], correctAnswer: 'Green Cedar Tree' },
    { question: 'In what year did the Ottoman Empire officially end?', options: ['1874', '1922', '1940', '1957'], correctAnswer: '1922' },
    { question: 'At which Olympics did women’s boxing make its official Olympic debut?', options: ['Los Angeles 1984', 'Sydney 2000', 'Innsbruck 1976', 'London 2012'], correctAnswer: 'London 2012' },
    { question: 'In Celsius, what is the melting point of gold?', options: ['100 °C', '544 °C', '901 °C', '1,064 °C'], correctAnswer: '1,064 °C' },
    { question: 'Which former US government employee became a pioneer of the LGBTQ+ rights movement after being fired for being openly gay and which year was he fired?', options: ['Admiral George Dewey, 1980', 'Astronomer Frank Kameny, 1957', 'Diplomat Allen Dulles, 1969', 'Congressman George White, 2001'], correctAnswer: 'Astronomer Frank Kameny, 1957' },
    { question: 'What year were women allowed to open bank accounts in United Kingdom without permission from a husband?', options: ['1959', '1962', '1975', '1988'], correctAnswer: '1975' }
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