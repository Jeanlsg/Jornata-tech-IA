import utils from './utils.js';
import RNA from './RNA.js';
import controls from './controls.js';

const SAMPLES = 2;
const game = Runner.instance_;
let dinoList = [];
let dinoIndex = 0;

let bestScore = 0;
let bestRNA = null;

function fillDinoList () {
    for (let i=0; i < SAMPLES; i++){
        dinoList[i] = new RNA(3, [10, 10, 2])
        dinoList[i] .load(bestRNA)
        if (i > 0) dinoList[i].mutate(0.2) 
    }
    console.log('Lista de dinossauros criada!')
}

setTimeout(() => {
    fillDinoList();
    controls.dispatch('jump'); // Faz o dinossauro executar um salto no jogo
  }, 1000);
  
  setInterval(() => {
    if (!game.activated) return; // Verifica se o jogo está ativado
  
    const dino = dinoList[dinoIndex]; // Seleciona o dinossauro atual
  
    if (game.crashed) { // Verifica se o dinossauro colidiu no jogo
      if (dino.score > bestScore) {
        bestScore = dino.score;
        bestRNA = dino.save(); // Salva a RNA do dinossauro com a melhor pontuação
        console.log('bestScore:', bestScore);
      }
      dinoIndex++;
  
      if (dinoIndex === SAMPLES) { // Se todos os dinossauros foram avaliados, preenche a lista novamente
        fillDinoList();
        dinoIndex = 0;
        bestScore = 0;
      }
      game.restart(); // Reinicia o jogo
    }

    const {tRex, horizon, currentSpeed, distanceRan, dimensions} = game;
    dino.score = distanceRan - 2000;

    const player = {
        x: tRex.xPos,
        y: tRex.yPos,
        speed: currentSpeed
    };

    const [obstacle] = horizon.obstacles
    .map((obstacle) => {
      return {
        x: obstacle.xPos,
        y: obstacle.yPos,
      }
    })
    .filter((obstacle) => obstacle.x > player.x)

    if (obstacle) {
        const distance = 1 - (utils.getDistance(player, obstacle) / dimensions.WIDTH);
        const speed = player.speed / 6;
        const height = Math.tanh(105 - obstacle.y);
        
        const [jump, crounch] = dino.compute([
          distance,
          speed,
          height,
      ]);
      

        if (jump === crounch) return;
        if (jump) controls.dispatch('jump'); // Se for verdadeiro o personagem pula
        if (crounch) controls.dispatch('crounch'); // Se for verdadeiro o personagem agacha           
    };
}, 100);

/* const s = document.createElement('script');
s.type = 'module';
s.src = 'http://localhost:5500/script.js'
document.body.appendChild(s); */
