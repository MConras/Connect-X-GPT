// script.js - Connect X

let ROWS;
let COLUMNS;
let CONNECT = 4;
let tabuleiro;
let jogadorAtual = 'Vermelho';

const CORES_JOGADORES = {
    Vermelho: '#ff4b5c',
    Amarelo: '#ffd700',
    Vazio: '#f0f8ff'
};

const ANIMACAO_TEMPO = 800;

function iniciarJogo() {
    const connectInput = parseInt(document.getElementById("connectInput").value);
    if (isNaN(connectInput) || connectInput < 4) {
        document.getElementById("mensagem").textContent = 'Por favor, insira um valor válido para Connect (mínimo 4)';
        return;
    }
    CONNECT = connectInput;
    COLUMNS = Math.ceil(1.75 * CONNECT);
    ROWS = Math.ceil(1.5 * CONNECT);
    document.getElementById("mensagem").textContent = '';
    tabuleiro = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
    criarTabuleiro();
}

function criarTabuleiro() {
    const tabuleiroDiv = document.getElementById("tabuleiro");
    tabuleiroDiv.innerHTML = '';
    tabuleiroDiv.style.gridTemplateColumns = `repeat(${COLUMNS}, 80px)`;
    tabuleiroDiv.style.gridTemplateRows = `repeat(${ROWS}, 80px)`;
    tabuleiroDiv.style.gap = '5px';
    tabuleiroDiv.style.border = '5px solid #444';
    tabuleiroDiv.style.borderRadius = '20px';
    tabuleiroDiv.style.padding = '20px';
    tabuleiroDiv.style.backgroundColor = 'rgba(240, 248, 255, 0.8)';
    tabuleiroDiv.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            const celula = document.createElement("div");
            celula.classList.add("celula");
            celula.dataset.linha = i;
            celula.dataset.coluna = j;
            celula.addEventListener("click", () => fazerJogada(j));
            celula.style.border = '2px solid #333';
            celula.style.borderRadius = '50%';
            celula.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
            celula.style.cursor = 'pointer';
            celula.addEventListener('mouseenter', () => {
                celula.style.transform = 'scale(1.1)';
            });
            celula.addEventListener('mouseleave', () => {
                celula.style.transform = 'scale(1)';
            });
            tabuleiroDiv.appendChild(celula);
        }
    }
}

function fazerJogada(coluna) {
    for (let linha = ROWS - 1; linha >= 0; linha--) {
        if (tabuleiro[linha][coluna] === null) {
            tabuleiro[linha][coluna] = jogadorAtual;
            atualizarTabuleiro();
            animarBolinhaCaindo(linha, coluna);

            if (verificarVitoria(jogadorAtual, linha, coluna)) {
                document.getElementById("mensagem").textContent = `🎉 Jogador ${jogadorAtual} venceu! 🎉`;
                bloquearTabuleiro();
                return;
            }

            if (verificarEmpate()) {
                document.getElementById("mensagem").textContent = "😐 Empate!";
                return;
            }

            jogadorAtual = jogadorAtual === 'Vermelho' ? 'Amarelo' : 'Vermelho';
            return;
        }
    }

    document.getElementById("mensagem").textContent = "Coluna cheia! Tente outra coluna.";
}

function animarBolinhaCaindo(linha, coluna) {
    const celula = document.querySelector(`.celula[data-linha='${linha}'][data-coluna='${coluna}']`);
    celula.animate(
        [
            { transform: 'translateY(-1000%)', opacity: 0 },
            { transform: 'translateY(0)', opacity: 1 }
        ],
        {
            duration: ANIMACAO_TEMPO,
            easing: 'ease-out'
        }
    );
}

function atualizarTabuleiro() {
    const celulas = document.querySelectorAll(".celula");
    celulas.forEach(celula => {
        const linha = celula.dataset.linha;
        const coluna = celula.dataset.coluna;
        const valor = tabuleiro[linha][coluna];
        celula.style.backgroundColor = valor === 'Vermelho' ? CORES_JOGADORES.Vermelho : valor === 'Amarelo' ? CORES_JOGADORES.Amarelo : CORES_JOGADORES.Vazio;
        celula.style.transition = 'background-color 0.5s ease';
        celula.style.boxShadow = valor ? '0 0 20px rgba(0, 0, 0, 0.5)' : 'none';
    });
}

function verificarVitoria(jogador, linha, coluna) {
    return (
        verificarDirecao(linha, coluna, 0, 1, jogador) + verificarDirecao(linha, coluna, 0, -1, jogador) >= CONNECT - 1 ||
        verificarDirecao(linha, coluna, 1, 0, jogador) >= CONNECT - 1 ||
        verificarDirecao(linha, coluna, 1, 1, jogador) + verificarDirecao(linha, coluna, -1, -1, jogador) >= CONNECT - 1 ||
        verificarDirecao(linha, coluna, 1, -1, jogador) + verificarDirecao(linha, coluna, -1, 1, jogador) >= CONNECT - 1
    );
}

function verificarDirecao(linha, coluna, deltaLinha, deltaColuna, jogador) {
    let count = 0;
    let currentLinha = linha + deltaLinha;
    let currentColuna = coluna + deltaColuna;

    while (
        currentLinha >= 0 &&
        currentLinha < ROWS &&
        currentColuna >= 0 &&
        currentColuna < COLUMNS &&
        tabuleiro[currentLinha][currentColuna] === jogador
    ) {
        count++;
        currentLinha += deltaLinha;
        currentColuna += deltaColuna;
    }

    return count;
}

function verificarEmpate() {
    return tabuleiro.flat().every(cell => cell !== null);
}

function bloquearTabuleiro() {
    document.querySelectorAll(".celula").forEach(celula => {
        celula.style.pointerEvents = 'none';
    });
}

// Adiciona estilo para a animação de sacudir
const estilo = document.createElement('style');
estilo.textContent = `
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
}`;
document.head.appendChild(estilo);