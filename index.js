const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const answeredQuestions = new Set();
let timer = 120; 
let timerInterval = null;
let currentMap = 'main';
let inDialogScene = false
let dialogIndex = 0
let wrongAnswer = false;
let wrongAnswerTimer = 0;
let lives = 3;
let gameOver = false;
let score = 0;
let foundBody = false;
let foundBodyTimer = 0;


const dialogSequence = [
  {
    type: 'text',
    speaker: 'Rosencrantz',
    text: "My lord, you must tell us where the body is and go with us to the king."
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "What is Rosencrantz referring to when he says 'where the body is'?",
    options: [
      "The body of King Hamlet",
      "The body of Polonius",
      "His own body",
      "A dead soldier"
    ],
    correct: 1
  },
  {
    type: 'text',
    speaker: 'Hamlet',
    text: "The body is with the king, but the king is not with the body. The king is a thing—"
  },
  {
    type: 'text',
    speaker: 'Guildenstern',
    text: "A thing, my lord?"
  },
  {
    type: 'text',
    speaker: 'Hamlet',
    text: "Of nothing. Bring me to him. Hide fox, and all after."
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "How does Hamlet treat Rosencrantz and Guildenstern in this scene?",
    options: [
      "With respect and honesty",
      "With kindness but distance",
      "With suspicion and sarcasm",
      "With anger and threats"
    ],
    correct: 2
  },
  {
    type: 'text',
    speaker: 'Rosencrantz',
    text: "Take you me for a sponge, my lord?"
  },
  {
    type: 'text',
    speaker: 'Hamlet',
    text: "Ay, sir, that soaks up the king’s countenance, his rewards, his authorities."
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "What does Hamlet imply by calling Rosencrantz a 'sponge'?",
    options: [
      "That he is soft and emotional",
      "That he absorbs flattery and does the king’s bidding",
      "That he likes to clean up",
      "That he is easily manipulated by Hamlet"
    ],
    correct: 1
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "What does this scene reveal about Hamlet's character development?",
    options: [
        "He has grown more trusting of old friends",
      "He has become more direct and emotionally open",
      "He is increasingly cynical and manipulative",
      "He now avoids confrontation at all costs"
    ],
    correct: 2
  },
  
  {
    type: 'question',
    speaker: 'Question',
    text: "Why is this exchange important for the plot?",
    options: [
      "It sets the stage for Hamlet’s reconciliation with Claudius",
      "It shows Hamlet’s descent into madness",
      "It leads directly to the death of Rosencrantz and Guildenstern",
      "It reveals Hamlet’s awareness of being watched and manipulated",
    ],
    correct: 3
}
];

const dialogSequence2 = [
  {
    type: 'question',
    speaker: 'Question',
    text: "How does Rosencrantz and Guildenstern’s role reflect the theme of false loyalty?",
    options: [
      "They pretend to be Hamlet’s friends but serve the king’s interests",
      "They genuinely support Hamlet’s cause",
      "They are indifferent to the royal court’s affairs",
      "They openly oppose the king"
    ],
    correct: 0
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "In what way does Claudius’s manipulation of Rosencrantz and Guildenstern reveal corruption in the Danish court?",
    options: [
      "It shows the king’s desire for honest communication",
      "It highlights the use of spies and deceit to maintain power",
      "It reflects the transparency of the court",
      "It shows Claudius’s mercy toward Hamlet"
    ],
    correct: 1
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "What does Hamlet’s distrust of Rosencrantz and Guildenstern reveal about his view of loyalty?",
    options: [
      "He believes loyalty is absolute and unwavering",
      "He trusts them implicitly",
      "He is suspicious of superficial friendships tied to political agendas",
      "He sees loyalty as irrelevant to his situation"
    ],
    correct: 2
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "How does the use of deceit impact the relationships between characters in *Hamlet*?",
    options: [
      "It creates tension, suspicion, and ultimately betrayal",
      "It leads to open and honest dialogue",
      "It resolves conflicts peacefully",
      "It strengthens bonds and builds trust",
    ],
    correct: 0
  },
  {
    type: 'question',
    speaker: 'Question',
    text: "Which of the following best exemplifies corruption in the political environment of *Hamlet*?",
    options: [
      "The king’s fair judgment in legal matters",
      "The manipulation of spies to control and monitor Hamlet",
      "The transparency of Hamlet’s intentions",
      "The harmonious relationship between Hamlet and Claudius"
    ],
    correct: 1
  }
];


let dialogStep = 0;
let selectedOption = 0;
let awaitingAnswer = false;
let currentDialogSequence = dialogSequence; 

function drawDialog() {
const current = currentDialogSequence[dialogStep];
  c.fillStyle = 'rgba(0, 0, 0, 0.7)';
  c.fillRect(50, canvas.height - 180, canvas.width - 100, 180);
  c.fillStyle = 'white';
  c.font = '18px Arial';

  if (current.type === 'text') {
    c.fillText(current.text, 70, canvas.height - 20);
  } else if (current.type === 'question') {
    c.fillText(current.text, 70, canvas.height - 130);
    current.options.forEach((option, i) => {
      c.fillStyle = i === selectedOption ? 'yellow' : 'white';
      c.fillText((i + 1) + '. ' + option, 90, canvas.height - 130 + i * 25);
    });
    awaitingAnswer = true;
  }
}


const dialogImage = new Image()
dialogImage.src = "./img/map.png"

const mapImage = new Image()
mapImage.src ='./img/map.png'


const collisionsMap = []
for (let i = 0; i < collisions.length; i+=70){
    collisionsMap.push(collisions.slice(i, 70 + i))
}

const collisionsMap3 = []
for (let i = 0; i< collisionsRoom3.length;i+=70){
    collisionsMap3.push(collisionsRoom3.slice(i, 70 + i))
}

class Boundary {
    static width = 32
    static height = 32
    constructor({position}){
        this.position = position
        this.width = 16
        this.height = 16
    }

    draw(){
        c.fillStyle = 'rgba(255,0,0,0.0)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
   
}
const boundaries = [] 
const offSet = {
    x:0,
    y:-40
}

collisionsMap.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol ===1537)
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width-0,
                        y: i * Boundary.height + offSet.y - 0
                    }
                })
            );
        }
    );
});

class Boundarymap3 {
    static width = 24
    static height = 24
    constructor({position}){
        this.position = position
        this.width = 16
        this.height = 16
    }

    draw(){
        c.fillStyle = 'rgba(255,0,0,0.0.8)'
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }
   
}
const boundariesM3 = [] 
const offSetM3 = {
    x:-1030,
    y:-350
}

collisionsMap3.forEach((row, i) => {
    row.forEach((symbol,j) => {
        if (symbol ===5014)
            boundariesM3.push(
                new Boundarymap3({
                    position: {
                        x: j * Boundarymap3.width + offSetM3.x,
                        y: i * Boundarymap3.height + offSetM3.y - 0
                    }
                })
            );
        }
    );
});

const image = new Image()
image.src = './img/map.png'

const playerImage = new Image()
playerImage.src ='./img/playerDown.png'

class Sprite {
    constructor({ position, image, frames = { max: 1 } }) {
        this.position = position
        this.frames = frames
        this._image = image
        this.setImage(image)
    }

    setImage(image) {
        this._image = image
        if (image.complete) {
            this.width = image.width / this.frames.max
            this.height = image.height
        } else {
            image.onload = () => {
                this.width = image.width / this.frames.max
                this.height = image.height
            }
        }
    }

    set image(newImage) {
        this.setImage(newImage)
    }

    get image() {
        return this._image
    }

    draw() {
        if (!this._image) return
        c.drawImage(
            this._image,
            0,
            0,
            this._image.width / this.frames.max,
            this._image.height,
            this.position.x,
            this.position.y,
            this._image.width / this.frames.max,
            this._image.height
        )
    }
}

const interactonZone = new Boundary({
    position:{
        x:1015,
        y:475
    }
})
const interactionZone2 = new Boundary({
    position: {
        x: 1790,
        y: 1050
    }
});
const specailZone = new Boundary ({
    position: {
        x: 1600,
        y: 750
    }
})

const room3Image = new Image();
room3Image.src = './img/map1.png';

const player = new Sprite ({
    position:{
        x: canvas.width / 2 - 192 / 4 / 2,
        y:canvas.height-1050 / 2 +100         
    },
    image: playerImage,
    frames: {
        max:4
    }
})
const background = new Sprite({
    position: {
    x:offSet.x,
    y:offSet.y
    },
    image: image
})
const keys = {
    w: {
        pressed: false
    },
     a: {
        pressed: false
    }
    , s: {
        pressed: false
    }, d: {
        pressed: false
    }
}


function getCurrentMoveableObjects() {
  if (currentMap === 'main') {
    return [background, ...boundaries, interactonZone, interactionZone2,specailZone];
  } else if (currentMap === 'room3') {
    return [background, ...boundariesM3,];
  }
  return [];
}

function rectangularCollision ({rectangle1, rectangle2}){
    return(
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x 
        && rectangle1.position.x <= 
        rectangle2.position.x + rectangle2.width
       && rectangle1.position.y <=rectangle2.position.y + rectangle2.height
    &&rectangle1.position.y + rectangle1.height >= rectangle2.position.y
    )
}
    let lastkey = ''

function startTimer() {
  if (timerInterval) clearInterval(timerInterval); 
  timer = 120; 

  timerInterval = setInterval(() => {
    timer--;
    if (timer <= 0) {
      clearInterval(timerInterval);
      timer = 0;
      gameOver = true;
    }
  }, 1000);
}

function animate(){
window.requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    background.draw()

    if (currentMap === 'main') {
    interactonZone.draw();
    interactionZone2.draw();

    if(score >=900) {
        specailZone.draw();
    }
} 
    if (gameOver) {
        c.fillStyle = 'rgba(0, 0, 0, 0.8)';
        c.fillRect(0, 0, canvas.width, canvas.height);
        c.fillStyle = 'red';
        c.font = '40px Arial';
        c.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
        return; 
    }

    if (wrongAnswer) {
            c.fillStyle = 'rgba(0, 0, 0, 0.7)';
            c.fillRect(50, canvas.height - 200, canvas.width - 100, 150);
        c.fillStyle = 'red';
        c.font = '24px Arial';
        c.fillText("Incorrect answer!", 70, canvas.height - 80);
        wrongAnswerTimer--;

        if (wrongAnswerTimer <= 0) {
            inDialogScene = false;
            background.image = mapImage;
            dialogStep = 0;
            selectedOption = 0;
            awaitingAnswer = false;
            wrongAnswer = false;
        }

        return; 
    }

    c.fillStyle = 'white';
    c.font = '18px Arial';
    c.fillText(`Lives: ${lives}`, 50, 50);
    c.fillText(`Score: ${score}`, 50, 80);
    c.fillStyle = 'white';
    c.font = '18px Arial';
    c.fillText(`Time Left: ${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}`, 50, 110);

    if (inDialogScene) {
    c.fillStyle = 'rgba(0, 0, 0, 0.7)';
    c.fillRect(50, canvas.height - 200, canvas.width - 100, 150);

const current = currentDialogSequence[dialogStep];

    c.fillStyle = 'white';
    c.font = '20px Arial';
    c.fillText(`${current.speaker}: ${current.text}`, 70, canvas.height - 150);

    if (current.type === 'question') {
        awaitingAnswer = true;

        current.options.forEach((option, index) => {
            if (index === selectedOption) {
                c.fillStyle = 'yellow';
            } else {
                c.fillStyle = 'white';
            }
            c.fillText(`${index + 1}. ${option}`, 90, canvas.height - 120 + index * 25);
        });
    } else {
        awaitingAnswer = false;
    }

}
   player.draw()

    if (foundBody) {
    c.fillStyle = 'rgba(0, 0, 0, 0.7)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = 'lime';
    c.font = '40px Arial';
    c.fillText("You found the body!", canvas.width / 2 - 100, canvas.height / 2);

    foundBodyTimer--;
    if (foundBodyTimer <= 0) {
        foundBody = false;
    }
}
    
   let moving = true
      let activeBoundaries = currentMap === 'main' ? boundaries : boundariesM3;

if (keys.w.pressed && lastkey === 'w') {
    for (let i = 0; i < activeBoundaries.length; i++) {
        const boundary = activeBoundaries[i];
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x,
                    y: boundary.position.y + 3
                }
            }
        })) {
            moving = false;
            break;
        }
    }
    if (moving)
        getCurrentMoveableObjects().forEach(obj => {
    obj.position.y += 3;
});

} else if (keys.a.pressed && lastkey === 'a') {
    for (let i = 0; i < activeBoundaries.length; i++) {
        const boundary = activeBoundaries[i];
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x + 3,
                    y: boundary.position.y
                }
            }
        })) {
            moving = false;
            break;
        }
    }
    if (moving)
       getCurrentMoveableObjects().forEach(obj => {
    obj.position.x += 3;
});

} else if (keys.s.pressed && lastkey === 's') {
    for (let i = 0; i < activeBoundaries.length; i++) {
        const boundary = activeBoundaries[i];
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x,
                    y: boundary.position.y - 3
                }
            }
        })) {
            moving = false;
            break;
        }
    }
    if (moving)
       getCurrentMoveableObjects().forEach(obj => {
    obj.position.y -= 3;
});
} else if (keys.d.pressed && lastkey === 'd') {
    for (let i = 0; i < activeBoundaries.length; i++) {
        const boundary = activeBoundaries[i];
        if (rectangularCollision({
            rectangle1: player,
            rectangle2: {
                ...boundary,
                position: {
                    x: boundary.position.x - 3,
                    y: boundary.position.y
                }
            }
        })) {
            moving = false;
            break;
        }
    }
    if (moving)
        getCurrentMoveableObjects().forEach(obj => {
    obj.position.x -= 3;
});
}
}
startTimer();
animate()
  
  window.addEventListener('keydown', (e) => {
    if (wrongAnswer) return;

    if (gameOver && e.key === 'r') {
        location.reload();
    }

    if (inDialogScene) {
        const current = currentDialogSequence[dialogStep];

        if (awaitingAnswer && current.type === 'question') {
            if (e.key === 'ArrowUp') {
                selectedOption = (selectedOption - 1 + current.options.length) % current.options.length;
            } else if (e.key === 'ArrowDown') {
                selectedOption = (selectedOption + 1) % current.options.length;
            } else if (e.key === 'Enter') {
                if (answeredQuestions.has(dialogStep)) {
                    // Already answered this one
                    console.log('Already answered this question.');
                    return;
                }

                if (selectedOption === current.correct) {
                    console.log('Correct!');
                    score += 100;
                    answeredQuestions.add(dialogStep);
                    dialogStep++;
                    selectedOption = 0;
                    awaitingAnswer = false;

                    // Skip any already answered future questions
                    while (
                        dialogStep < currentDialogSequence.length &&
                        answeredQuestions.has(dialogStep)
                    ) {
                        dialogStep++;
                    }

                    if (dialogStep >= currentDialogSequence.length) {
                        inDialogScene = false;
                        background.image = mapImage;
                        dialogStep = 0;
                    }
                } else {
                    console.log('Wrong!');
                    lives--;
                    wrongAnswer = true;
                    wrongAnswerTimer = 60;
                    if (lives <= 0) {
                        gameOver = true;
                    }
                }
            }
        } else if (!awaitingAnswer && e.key === ' ') {
            dialogStep++;
            selectedOption = 0;

            // Skip already answered questions
            while (
                dialogStep < currentDialogSequence.length &&
                answeredQuestions.has(dialogStep)
            ) {
                dialogStep++;
            }

            if (dialogStep >= currentDialogSequence.length) {
                inDialogScene = false;
                background.image = mapImage;
                dialogStep = 0;
            }
        }

        return;
    }

    // Movement keys
    switch (e.key) {
        case 'w':
        case 'a':
        case 's':
        case 'd':
            keys[e.key].pressed = true;
            lastkey = e.key;
            break;
        case ' ':
            if (rectangularCollision({ rectangle1: player, rectangle2: interactonZone })) {
                inDialogScene = true;
                currentDialogSequence = dialogSequence;
                background.image = dialogImage;
                dialogStep = 0;

                while (
                    dialogStep < currentDialogSequence.length &&
                    answeredQuestions.has(dialogStep)
                ) {
                    dialogStep++;
                }
            }

            if (rectangularCollision({ rectangle1: player, rectangle2: interactionZone2 })) {
                inDialogScene = true;
                currentDialogSequence = dialogSequence2;
                background.image = dialogImage;
                dialogStep = 0;

                while (
                    dialogStep < currentDialogSequence.length &&
                    answeredQuestions.has(dialogStep)
                ) {
                    dialogStep++;
                }
            }

            if (score >= 900 && rectangularCollision({ rectangle1: player, rectangle2: specailZone })) {
                foundBody = true;
                foundBodyTimer = 120;
                score += 100;
            }

            break;
    }
});

window.addEventListener('keyup',(e)=>{
    switch (e.key) {
        case 'w':
            keys.w.pressed = false
            break;
        case 'a':
             keys.a.pressed = false
            break;
        case 's':
             keys.s.pressed = false
            break;
        case 'd':
             keys.d.pressed = false
            break;
    }
})
