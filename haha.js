// Create floating particles
        const particlesContainer = document.getElementById('particles');
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 15 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
        
        // Falling hearts data - ADD YOUR OWN TEXTS AND PHOTOS HERE
        const heartsData = [
            { type: 'text', content: 'Ты - свет моей жизни. С тобой каждый день особенный.' },
            { type: 'text', content: 'Твоя улыбка согревает мое сердце даже в самые холодные дни.' },
            { type: 'text', content: 'Я благодарен судьбе за каждый момент с тобой.' },
            { type: 'text', content: 'Ты делаешь меня лучше. Ты - моё вдохновение.' },
            { type: 'text', content: 'С тобой я понял, что такое настоящее счастье.' },
            { type: 'text', content: 'Люблю тебя больше, чем слова могут выразить.' },
            { type: 'photo', content: 'assets/img/moya3.jpg' },
            { type: 'photo', content: 'assets/img/moya4.jpg' },
            { type: 'photo', content: 'assets/img/moya5.jpg' },
            // Add more hearts with your own texts and photo URLs
        ];
        
        let heartClickCounts = {};
        
        function createFallingHeart(data, index) {
            const heart = document.createElement('div');
            heart.className = 'heart-3d';
            heart.style.left = Math.random() * (window.innerWidth - 200) + 'px';
            heart.style.animationDuration = (Math.random() * 4 + 6) + 's';
            heart.style.animationDelay = Math.random() * 3 + 's';
            
            const front = document.createElement('div');
            front.className = 'face front';
            front.innerHTML = '❤️';
            front.style.fontSize = '5rem';
            
            const back = document.createElement('div');
            back.className = 'face back';
            
            const content = document.createElement('div');
            content.className = 'content';
            
            if (data.type === 'text') {
                content.textContent = data.content;
            } else {
                const img = document.createElement('img');
                img.src = data.content;
                content.appendChild(img);
            }
            
            back.appendChild(content);
            heart.appendChild(front);
            heart.appendChild(back);
            
            heartClickCounts[index] = heartClickCounts[index] || 0;
            
            heart.addEventListener('click', function() {
                if (heartClickCounts[index] < 3) {
                    this.classList.add('paused');
                    this.style.transform = 'rotateY(180deg)';
                    heartClickCounts[index]++;
                    
                    setTimeout(() => {
                        this.classList.remove('paused');
                        this.style.transform = '';
                    }, 8000);
                }
            });
            
            return heart;
        }
        
        // Initialize falling hearts
        const heartsContainer = document.getElementById('heartsContainer');
        heartsData.forEach((data, index) => {
            const heart = createFallingHeart(data, index);
            heartsContainer.appendChild(heart);
            
            heart.addEventListener('animationiteration', function() {
                if (heartClickCounts[index] >= 3) {
                    const randomIndex = Math.floor(Math.random() * heartsData.length);
                    const newData = heartsData[randomIndex];
                    
                    const back = this.querySelector('.back .content');
                    back.innerHTML = '';
                    
                    if (newData.type === 'text') {
                        back.textContent = newData.content;
                    } else {
                        const img = document.createElement('img');
                        img.src = newData.content;
                        back.appendChild(img);
                    }
                    
                    heartClickCounts[index] = 0;
                }
            });
        });
        
        // Memory Card Game
        const cardEmojis = ['💕', '💖', '💗', '💝', '💘', '💞', '💓', '❤️'];
        let memoryCards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let canFlip = true;
        
        function initMemoryGame() {
            const grid = document.getElementById('memoryGrid');
            grid.innerHTML = '';
            
            // Create pairs and shuffle
            memoryCards = [...cardEmojis, ...cardEmojis]
                .sort(() => Math.random() - 0.5)
                .map((emoji, index) => ({
                    emoji,
                    id: index,
                    matched: false
                }));
            
            flippedCards = [];
            matchedPairs = 0;
            moves = 0;
            canFlip = true;
            
            updateStats();
            
            // Create cards
            memoryCards.forEach((card, index) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'memory-card';
                cardElement.dataset.index = index;
                
                const front = document.createElement('div');
                front.className = 'card-face card-front';
                front.innerHTML = '❤️';
                
                const back = document.createElement('div');
                back.className = 'card-face card-back';
                back.innerHTML = card.emoji;
                
                cardElement.appendChild(front);
                cardElement.appendChild(back);
                
                cardElement.addEventListener('click', () => flipCard(index));
                
                grid.appendChild(cardElement);
            });
        }
        
        function flipCard(index) {
            if (!canFlip) return;
            
            const card = memoryCards[index];
            const cardElement = document.querySelectorAll('.memory-card')[index];
            
            // Don't flip if already flipped or matched
            if (card.matched || flippedCards.includes(index)) return;
            
            // Flip the card
            cardElement.classList.add('flipped');
            flippedCards.push(index);
            
            // Check if two cards are flipped
            if (flippedCards.length === 2) {
                moves++;
                updateStats();
                canFlip = false;
                
                const [first, second] = flippedCards;
                const firstCard = memoryCards[first];
                const secondCard = memoryCards[second];
                
                if (firstCard.emoji === secondCard.emoji) {
                    // Match found!
                    setTimeout(() => {
                        firstCard.matched = true;
                        secondCard.matched = true;
                        
                        const cards = document.querySelectorAll('.memory-card');
                        cards[first].classList.add('matched');
                        cards[second].classList.add('matched');
                        
                        matchedPairs++;
                        updateStats();
                        
                        flippedCards = [];
                        canFlip = true;
                        
                        // Check if game is complete
                        if (matchedPairs === 8) {
                            setTimeout(() => {
                                const message = document.getElementById('gameMessage');
                                message.innerHTML = `
                                    <div class="game-completed">
                                        🎉 Поздравляю! Ты нашла все пары! 🎉<br><br>
                                        Количество ходов: ${moves}<br><br>
                                        Ты такая же умная, как и красивая! ❤️
                                    </div>
                                `;
                            }, 500);
                        }
                    }, 500);
                } else {
                    // No match
                    setTimeout(() => {
                        const cards = document.querySelectorAll('.memory-card');
                        cards[first].classList.remove('flipped');
                        cards[second].classList.remove('flipped');
                        
                        flippedCards = [];
                        canFlip = true;
                    }, 1000);
                }
            }
        }
        
        function updateStats() {
            document.getElementById('moves').textContent = moves;
            document.getElementById('pairs').textContent = `${matchedPairs}/8`;
        }
        
        function resetMemoryGame() {
            initMemoryGame();
            document.getElementById('gameMessage').innerHTML = '';
        }
        
        initMemoryGame();
        
        // Quiz Game - ADD YOUR OWN QUESTIONS HERE
      const quizQuestions = [
    {
        question: 'Когда мы начали встречаться?',
        options: ['13 Октября 2024', '11 Сентябрь 2024', '22 Ноябрь 2029', '21 Август 2024'],
        correct: '13 Октября 2024'
    },
    {
        question: 'Где будет наш первый раз ?',
        options: ['В кафе', 'В отеле ', 'В кино', 'Дома'], 
        correct: 'Дома'
    },
    {
        question: 'Какой твой любимый цветок?',
        options: ['Розы', 'Тюльпаны', 'Пионы', 'Я'],
        correct: 'Пионы'
    },
    {
        question: 'Что сколько раз за день хочешь меня?',
        options: ['1', '10', '2', 'не хочу ', 'редко'],
        correct: 'редко'
    },
    {
        question: 'кого  мне Трахнуть',
        options: ['тебя', 'собаку ', 'котика', 'никого'],
        correct: 'никого'
    }
];

        
        let currentQuestion = 0;
        let quizScore = 0;
        
        function loadQuestion() {
            if (currentQuestion >= quizQuestions.length) {
                document.getElementById('quizContainer').innerHTML = 
                    `<div style="text-align: center; font-size: 2rem; color: var(--gold);">
                        🎉 Викторина завершена! 🎉<br><br>
                        Твой результат: ${quizScore} из ${quizQuestions.length}<br><br>
                        ${quizScore === quizQuestions.length ? 'Ты потрясающая! Ты помнишь всё! ❤️' : 'Ты всё равно лучшая! ❤️'}
                    </div>`;
                return;
            }
            
            const q = quizQuestions[currentQuestion];
            document.getElementById('quizQuestion').textContent = q.question;
            
            const optionsContainer = document.getElementById('quizOptions');
            optionsContainer.innerHTML = '';
            
            q.options.forEach((option, index) => {
                const optionDiv = document.createElement('div');
                optionDiv.className = 'quiz-option';
                optionDiv.textContent = option;
                optionDiv.onclick = () => checkAnswer(index, q.correct);
                optionsContainer.appendChild(optionDiv);
            });
        }
        
        function checkAnswer(selectedIndex, correctAnswer) {
    const options = document.querySelectorAll('.quiz-option');

    if (options[selectedIndex].textContent === correctAnswer) {
        options[selectedIndex].classList.add('correct');
        quizScore++;
    } else {
        options[selectedIndex].classList.add('wrong');
        options.forEach(opt => {
            if (opt.textContent === correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }

    options.forEach(opt => opt.onclick = null);

    setTimeout(() => {
        currentQuestion++;
        loadQuestion();
    }, 1500);
}


        
        
        loadQuestion();
        
        // Final Proposal
        function showProposal() {
            document.querySelector('.proposal-button').style.display = 'none';
            document.getElementById('proposalContent').classList.add('show');
        }
        
        function answerYes() {
            document.getElementById('proposalContent').innerHTML = 
                `<div class="proposal-question" style="font-size: 4rem;">
                    ТЫ СДЕЛАЛА МЕНЯ САМЫМ СЧАСТЛИВЫМ! 💍❤️
                </div>`;
            
            createFireworks();
            
            setTimeout(() => {
                alert('Я люблю тебя больше всего на свете! 💕');
            }, 2000);
        }
        
        function answerNo() {
            document.getElementById('proposalContent').innerHTML = 
                `<div class="proposal-question" style="font-size: 3rem; color: #6c9bd1;">
                    Вот оно как... очень жаль 😢
                </div>`;
            
            createRain();
        }
        
        function createFireworks() {
            const fireworksContainer = document.createElement('div');
            fireworksContainer.className = 'fireworks';
            document.body.appendChild(fireworksContainer);
            
            const colors = ['#ff6b9d', '#ffd700', '#4caf50', '#ff69b4', '#00bcd4'];
            
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight * 0.7;
                    
                    for (let j = 0; j < 30; j++) {
                        const firework = document.createElement('div');
                        firework.className = 'firework';
                        firework.style.left = x + 'px';
                        firework.style.top = y + 'px';
                        firework.style.background = colors[Math.floor(Math.random() * colors.length)];
                        
                        const angle = (Math.PI * 2 * j) / 30;
                        const velocity = 50 + Math.random() * 100;
                        firework.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
                        firework.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
                        
                        fireworksContainer.appendChild(firework);
                        
                        setTimeout(() => firework.remove(), 1000);
                    }
                }, i * 200);
            }
        }
        
        function createRain() {
            const rainContainer = document.createElement('div');
            rainContainer.className = 'rain';
            document.body.appendChild(rainContainer);
            
            for (let i = 0; i < 100; i++) {
                const raindrop = document.createElement('div');
                raindrop.className = 'raindrop';
                raindrop.style.left = Math.random() * 100 + '%';
                raindrop.style.animationDelay = Math.random() * 2 + 's';
                raindrop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
                rainContainer.appendChild(raindrop);
            }
        }