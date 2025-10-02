// script-complementar.js

// 1. ANIMAÇÃO DE DIGITAÇÃO PARA O TÍTULO PRINCIPAL
function animarDigitacao() {
    const titulo = document.querySelector('#s1 h1');
    if (!titulo) return;

    const textoOriginal = titulo.textContent;
    titulo.textContent = '';
    let i = 0;

    const timer = setInterval(() => {
        if (i < textoOriginal.length) {
            titulo.textContent += textoOriginal.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 100);
}

// 2. CONTADOR DE VISUALIZAÇÃO DOS FONES
function criarContadorFones() {
    const contadores = {
        'zeroRed': Math.floor(Math.random() * 500) + 1000,
        'zeroBlue': Math.floor(Math.random() * 500) + 800
    };
    
    // Atualizar contadores na página
    const atualizarContadores = () => {
        const elementoRed = document.querySelector('#contador-red');
        const elementoBlue = document.querySelector('#contador-blue');
        
        if (elementoRed) {
            elementoRed.textContent = `🔥 ${++contadores.zeroRed} audiófilos recomendam`;
        }
        if (elementoBlue) {
            elementoBlue.textContent = `🔥 ${++contadores.zeroBlue} audiófilos recomendam`;
        }
    };
    
    // Adicionar elementos de contador na página
    const adicionarElementosContador = () => {
        const descricaoRed = document.querySelector('#s2 p:nth-child(3)'); // Ajuste conforme necessário
        const descricaoBlue = document.querySelector('#s2 p:nth-child(8)'); // Ajuste conforme necessário
        
        if (descricaoRed) {
            const spanRed = document.createElement('span');
            spanRed.id = 'contador-red';
            spanRed.className = 'contador-fone';
            spanRed.textContent = `🔥 ${contadores.zeroRed} audiófilos recomendam`;
            descricaoRed.appendChild(document.createElement('br'));
            descricaoRed.appendChild(spanRed);
        }
        
        if (descricaoBlue) {
            const spanBlue = document.createElement('span');
            spanBlue.id = 'contador-blue';
            spanBlue.className = 'contador-fone';
            spanBlue.textContent = `🔥 ${contadores.zeroBlue} audiófilos recomendam`;
            descricaoBlue.appendChild(document.createElement('br'));
            descricaoBlue.appendChild(spanBlue);
        }
    };
    
    adicionarElementosContador();
    setInterval(atualizarContadores, 30000); // Atualiza a cada 30 segundos
}

function criarSistemaAvaliacao() {
    const fones = [
        { id: 'zeroRed', nome: 'ZERO:RED' },
        { id: 'zeroBlue', nome: 'ZERO (Blue)' }
    ];

    fones.forEach(fone => {
        const container = document.createElement('div');
        container.className = 'avaliacao';
        container.innerHTML = `
            <p>Avalie o ${fone.nome}:</p>
            <div class="estrelas">
                ${Array.from({length: 5}, (_, i) => 
                    `<span class="estrela" data-fone="${fone.id}" data-valor="${i + 1}">★</span>`
                ).join('')}
            </div>
            <div class="media-avaliacao" id="media-${fone.id}"></div>
        `;

        // Inserir após a descrição de cada fone
        const descricao = fone.id === 'zeroRed' ? 
            document.querySelector('#s2 p:nth-child(4)') : 
            document.querySelector('#s2 p:nth-child(9)');

        if (descricao) {
            descricao.parentNode.insertBefore(container, descricao.nextSibling);
        }

        // Carregar avaliações existentes ao inicializar
        carregarAvaliacoes(fone.id);
    });

    // Event listeners para as estrelas
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('estrela')) {
            const fone = e.target.dataset.fone;
            const valor = parseInt(e.target.dataset.valor);
            avaliarFone(fone, valor, e.target);
        }
    });
}

function carregarAvaliacoes(foneId) {
    const avaliacoes = JSON.parse(localStorage.getItem(`avaliacoes_${foneId}`)) || [];
    const mediaElement = document.getElementById(`media-${foneId}`);
    
    if (avaliacoes.length > 0) {
        const media = (avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1);
        mediaElement.textContent = `Média: ${media} (${avaliacoes.length} avaliações)`;
        
        // Atualizar visual das estrelas com a média
        const estrelas = mediaElement.previousElementSibling.querySelectorAll('.estrela');
        estrelas.forEach((estrela, index) => {
            if (index < Math.round(media)) {
                estrela.classList.add('ativa');
            }
        });
    } else {
        mediaElement.textContent = 'Seja o primeiro a avaliar!';
    }
}

function avaliarFone(fone, valor, estrelaClicada) {
    const estrelas = estrelaClicada.parentElement.querySelectorAll('.estrela');
    const mediaElement = document.getElementById(`media-${fone}`);

    // Atualizar visual das estrelas
    estrelas.forEach((estrela, index) => {
        if (index < valor) {
            estrela.classList.add('ativa');
        } else {
            estrela.classList.remove('ativa');
        }
    });

    // Salvar avaliação no localStorage
    const avaliacoes = JSON.parse(localStorage.getItem(`avaliacoes_${fone}`)) || [];
    avaliacoes.push(valor);
    localStorage.setItem(`avaliacoes_${fone}`, JSON.stringify(avaliacoes));

    // Calcular e mostrar média
    const media = (avaliacoes.reduce((a, b) => a + b, 0) / avaliacoes.length).toFixed(1);
    mediaElement.textContent = `Média: ${media} (${avaliacoes.length} avaliações)`;

    // Feedback visual
    estrelaClicada.style.transform = 'scale(1.3)';
    setTimeout(() => {
        estrelaClicada.style.transform = 'scale(1)';
    }, 200);
}

// 4. MODAL PARA AS CURVAS SONORAS
function criarModalCurvas() {
    const modalHTML = `
        <div id="modal-curvas" class="modal">
            <div class="modal-conteudo">
                <span class="fechar-modal">&times;</span>
                <h3>Curva Sonora</h3>
                <div id="modal-imagem"></div>
                <p id="modal-descricao"></p>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Event listeners para os botões das curvas
    document.querySelectorAll('.meu-botao').forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            const url = botao.href;
            const fone = botao.id.includes('red') ? 'ZERO:RED' : 'ZERO (Blue)';

            abrirModalCurva(fone, url);
        });
    });

    // Fechar modal
    document.querySelector('.fechar-modal').addEventListener('click', fecharModal);
    document.getElementById('modal-curvas').addEventListener('click', (e) => {
        if (e.target.id === 'modal-curvas') {
            fecharModal();
        }
    });
}

function abrirModalCurva(fone, url) {
    const modal = document.getElementById('modal-curvas');
    const descricao = document.getElementById('modal-descricao');

    document.getElementById('modal-imagem').innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <p>🔊 Analisando curva sonora do ${fone}...</p>
            <p>Redirecionando para visualização detalhada</p>
            <div class="loading"></div>
        </div>
    `;

    descricao.textContent = `Curva de resposta de frequência do ${fone}. Esta visualização mostra como o fone reproduz diferentes frequências sonoras.`;

    modal.style.display = 'block';

    // Redirecionar após 3 segundos
    setTimeout(() => {
        window.open(url, '_blank');
        fecharModal();
    }, 3000);
}

function fecharModal() {
    document.getElementById('modal-curvas').style.display = 'none';
}

// 5. DETECTOR DE SCROLL PARA MENU FIXO
function menuScroll() {
    const menu = document.getElementById('menu-horizontal');
    let ultimoScroll = 0;
    
    window.addEventListener('scroll', () => {
        const scrollAtual = window.pageYOffset;
        
        if (scrollAtual > 100) {
            menu.style.position = 'fixed';
            menu.style.top = '0';
            menu.style.width = '100%';
            menu.style.zIndex = '1000';
            menu.style.background = 'rgba(0, 0, 0, 0.9)';
            menu.style.transition = 'all 0.3s ease';
        } else {
            menu.style.position = 'static';
            menu.style.background = 'black';
        }
        
        ultimoScroll = scrollAtual;
    });
}

// 6. ANIMAÇÃO DE PARTICULAS MUSICAIS
function criarParticulas() {
    const section3 = document.getElementById('s3');
    if (!section3) return;

    const cores = ['#ff007f', '#4c00ff', '#00ff88', '#ffaa00'];

    for (let i = 0; i < 15; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula-musical';
        particula.style.cssText = `
            position: absolute;
            width: ${Math.random() * 20 + 5}px;
            height: ${Math.random() * 20 + 5}px;
            background: ${cores[Math.floor(Math.random() * cores.length)]};
            border-radius: 50%;
            opacity: ${Math.random() * 0.6 + 0.2};
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: flutuar ${Math.random() * 10 + 10}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;

        section3.appendChild(particula);
    }

    // Adicionar keyframes para animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flutuar {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(90deg); }
            50% { transform: translateY(0) rotate(180deg); }
            75% { transform: translateY(20px) rotate(270deg); }
        }
    `;
    document.head.appendChild(style);
}

// 7. SISTEMA DE FEEDBACK DO SITE
function criarSistemaFeedback() {
    const feedbackHTML = `
        <div id="feedback-flutuante">
            <button id="btn-feedback">💬 Feedback</button>
            <div id="form-feedback" style="display: none;">
                <h4>O que achou do site?</h4>
                <textarea placeholder="Deixe seu comentário..." rows="4"></textarea>
                <button id="enviar-feedback">Enviar</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', feedbackHTML);

    document.getElementById('btn-feedback').addEventListener('click', () => {
        const form = document.getElementById('form-feedback');
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('enviar-feedback').addEventListener('click', () => {
        const textarea = document.querySelector('#form-feedback textarea');
        const feedback = textarea.value.trim();

        if (feedback) {
            // Simular envio do feedback
            alert('Obrigado pelo seu feedback! 🎧');
            textarea.value = '';
            document.getElementById('form-feedback').style.display = 'none';

            // Aqui você pode adicionar código para enviar para um servidor
            console.log('Feedback recebido:', feedback);
        }
    });
}

// INICIALIZAR TODAS AS FUNCIONALIDADES
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para a animação de digitação ter mais impacto
    setTimeout(animarDigitacao, 500);

    criarContadorFones();
    criarSistemaAvaliacao();
    criarModalCurvas();
    menuScroll();
    criarParticulas();
    criarSistemaFeedback();

    console.log('🎵 Site de fones de ouvido carregado com sucesso!');
});

// 8. EFEITOS DE SOM INTERATIVOS (OPCIONAL)
function criarEfeitosSonoros() {
    // Este é um esqueleto para futura implementação com Web Audio API
    console.log('Sistema de áudio pronto para implementação');
}

// Adicione este CSS complementar no seu style.css
const cssComplementar = `
.contador-fone {
    display: inline-block;
    background: linear-gradient(45deg, #ff007f, #4c00ff);
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 0.9em;
    margin-top: 10px;
    animation: pulsar 2s infinite;
}

@keyframes pulsar {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
}

.avaliacao {
    margin: 15px 0;
    padding: 10px;
    background: rgba(255,255,255,0.1);
    border-radius: 10px;
}

.estrelas {
    font-size: 24px;
    cursor: pointer;
}

.estrela {
    color: #666;
    transition: all 0.2s;
    margin: 0 2px;
}

.estrela.ativa,
.estrela:hover {
    color: gold;
    transform: scale(1.2);
}

.media-avaliacao {
    margin-top: 5px;
    font-size: 0.9em;
    color: #ccc;
}

.modal {
    display: none;
    position: fixed;
    z-index: 2000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
}

.modal-conteudo {
    background: linear-gradient(135deg, #1a1e2b, #2d1b47);
    margin: 10% auto;
    padding: 20px;
    border-radius: 15px;
    width: 80%;
    max-width: 500px;
    border: 1px solid #ff007f;
    position: relative;
}

.fechar-modal {
    color: #fff;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}

.fechar-modal:hover {
    color: #ff007f;
}

.loading {
    width: 40px;
    height: 40px;
    border: 4px solid #333;
    border-top: 4px solid #ff007f;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 10px auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

#feedback-flutuante {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

#btn-feedback {
    background: linear-gradient(45deg, #ff007f, #4c00ff);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: bold;
}

#form-feedback {
    position: absolute;
    bottom: 50px;
    right: 0;
    background: #1a1e2b;
    padding: 15px;
    border-radius: 10px;
    border: 1px solid #ff007f;
    width: 250px;
}

#form-feedback textarea {
    width: 100%;
    background: rgba(255,255,255,0.1);
    border: 1px solid #444;
    border-radius: 5px;
    color: white;
    padding: 8px;
    margin: 10px 0;
    resize: vertical;
}

#enviar-feedback {
    background: #ff007f;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
}
`;

// Adicionar CSS complementar automaticamente
const styleSheet = document.createElement('style');
styleSheet.textContent = cssComplementar;
document.head.appendChild(styleSheet);


document.head.appendChild(styleSheet);
