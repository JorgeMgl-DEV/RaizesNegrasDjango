// Array para armazenar as regiões carregadas do JSON
let regioes = [];

// Obtém a referência do elemento de popup
const popup = document.getElementById('popup');

// Variável para controlar se o popup está aberto
let isPopupOpen = false;

// Função assíncrona para buscar o arquivo SVG e substituí-lo na página
async function fetchSvg(image) {
    try {
        // Faz a requisição do arquivo SVG
        const response = await fetch(image.src);
        const text = await response.text();

        // Cria um elemento temporário para armazenar o SVG inline
        const span = document.createElement('span');
        span.innerHTML = text;
        const inlineSvg = span.querySelector('svg');

        // Se o SVG for inválido, gera um erro
        if (!inlineSvg) throw new Error('SVG inválido');

        // Substitui a imagem pelo SVG inline
        image.parentNode.replaceChild(inlineSvg, image);
        console.log('SVG carregado com sucesso:', inlineSvg);

        // Chama a função para adicionar eventos nas regiões
        getActions();
    } catch (error) {
        console.error('Erro ao carregar SVG:', error);
    }
}

// Função assíncrona para buscar o arquivo regioes.json
async function getRegioes() {
    try {
        // Faz a requisição para carregar o JSON
        const response = await fetch('regioes.json');
        regioes = await response.json();
        console.log('Regiões carregadas:', regioes);
    } catch (error) {
        console.error('Erro ao carregar regioes.json:', error);
    }
}

// Função para adicionar eventos de interação nas regiões do SVG
function getActions() {
    // Obtém todas as regiões do mapa com a classe "regiao"
    const regions = document.getElementsByClassName('regiao');

    // Verifica se encontrou regiões
    if (regions.length === 0) {
        console.warn('Nenhuma região encontrada no SVG.');
        return;
    }

    // Adiciona eventos de clique e mouseleave para cada região
    for (let region of regions) {
        region.addEventListener('click', (e) => showPopup(e, region)); // Exibir popup ao clicar
        region.addEventListener('mouseleave', () => setTimeout(checkMouseLeave, 200)); // Esconder popup ao sair
    }

    // Chama a função para carregar as regiões do JSON
    getRegioes();
}

// Função para exibir o popup com informações da região
function showPopup(event, region) {
    // Se as regiões ainda não foram carregadas, sai da função
    if (regioes.length === 0) return;

    // Obtém o código da região clicada
    const code = region.getAttribute('code');
    
    // Busca os dados da região correspondente no array carregado
    const rg = regioes.find(r => r.code === code);

    // Se não encontrar a região, exibe erro no console
    if (!rg) {
        console.error(`Região não encontrada para o código: ${code}`);
        return;
    }

    // Define o conteúdo do popup com os dados da região
    popup.innerHTML = `
        <h2>${rg.name || 'Nome não encontrado'}</h2>
        <p>${rg.descricao || 'Descrição não encontrada'}</p>
        ${rg.link ? `<a href="${rg.link}" target="_blank">Saiba mais</a>` : ''}
    `;

    // Calcula a posição do popup com relação ao mouse
    let left = event.pageX + 15;
    let top = event.pageY + 15;

    // Ajusta a posição do popup caso ultrapasse a tela
    if (left + popup.offsetWidth > window.innerWidth) {
        left = event.pageX - popup.offsetWidth - 15;
    }
    if (top + popup.offsetHeight > window.innerHeight) {
        top = event.pageY - popup.offsetHeight - 15;
    }

    // Aplica as posições calculadas ao popup
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.display = 'block';

    // Define que o popup está aberto
    isPopupOpen = true;
}

// Função para verificar se o mouse saiu do popup e escondê-lo
function checkMouseLeave() {
    // Se o mouse não estiver sobre o popup, ele é ocultado
    if (!popup.matches(':hover')) {
        popup.style.display = 'none';
        isPopupOpen = false;
    }
}

// Adiciona um evento ao popup para escondê-lo ao sair com o mouse
popup.addEventListener('mouseleave', checkMouseLeave);
