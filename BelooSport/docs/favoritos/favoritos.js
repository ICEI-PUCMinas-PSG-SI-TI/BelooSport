document.addEventListener('DOMContentLoaded', () => {

    // BANCO DE DADOS SIMULADO
    const dadosEsportes = {
        "skate": {
            nome: "Skate",
            tag: "Urbano · Adrenalina",
            img: "skate.jpg",
            alt: "Foto da prática de Skate"
        },
        "escalada": {
            nome: "Escalada",
            tag: "Aventura · Desafio",
            img: "escalada.jpg",
            alt: "Foto da prática de Escalada"
        },
        "badminton": {
            nome: "Badminton",
            tag: "Dinâmico · Social",
            img: "badminton.jpg",
            alt: "Foto da prática de Badminton"
        }
    };

    // FUNCAO 1: Recupera a lista de esportes favoritos gravada no localStorage
    function obterFavoritos() {
        const salvos = localStorage.getItem('belosport_favoritos');
        return salvos ? JSON.parse(salvos) : [];
    }

    // FUNCAO 2: Grava o Array atualizado de favoritos no localStorage
    function salvarFavoritos(lista) {
        // Converte o Array JS para string JSON antes de salvar
        localStorage.setItem('belosport_favoritos', JSON.stringify(lista));
    }

    // FUNCAO 3: Alterna a presenca de um esporte na lista de favoritos
    function alternarFavorito(idEsporte) {
        let favoritos = obterFavoritos();

        if (favoritos.includes(idEsporte)) {
            // Remove o id caso ja esteja favoritado
            favoritos = favoritos.filter(id => id !== idEsporte);
        } else {
            // Adiciona o id caso ainda nao esteja na lista
            favoritos.push(idEsporte);
        }

        salvarFavoritos(favoritos);
        atualizarEstrelas();
        renderizarPaginaFavoritos();
    }

    // FUNCAO 4: Altera o botao de favoritar (estrela)
    function atualizarEstrelas() {
        const favoritos = obterFavoritos();
        const cards = document.querySelectorAll('.card-esporte');

        cards.forEach(card => {
            const id = card.dataset.id;
            const botao = card.querySelector('button');

            if (botao && id) {
                if (favoritos.includes(id)) {
                    botao.textContent = '★';
                    botao.setAttribute('aria-label', `Remover ${id} dos favoritos`);
                } else {
                    botao.textContent = '☆';
                    botao.setAttribute('aria-label', `Favoritar ${id}`);
                }
            }
        });
    }

    // FUNCAO 5: Desenha os cards na pagina de favoritos
    function renderizarPaginaFavoritos() {
        const vitrine = document.querySelector('.vitrine-esportes');

        // Executa a montagem dinamica apenas se estiver na pagina favoritos.html
        if (!vitrine || !window.location.pathname.includes('favoritos.html')) {
            return;
        }

        const favoritos = obterFavoritos();
        vitrine.innerHTML = '';

        //lista vazia
        if (favoritos.length === 0) {
            vitrine.innerHTML = '<p>Nenhum esporte adicionado aos favoritos ainda.</p>';
            return;
        }

        // Criacao e insercao dos cards dinamicamente
        favoritos.forEach(id => {
            const esporte = dadosEsportes[id];
            if (esporte) {
                const article = document.createElement('article');
                article.className = 'card-esporte';
                article.dataset.id = id;

                article.innerHTML = `
                    <div class="card-imagem">
                        <img src="${esporte.img}" alt="${esporte.alt}">
                        <button type="button" aria-label="Remover ${esporte.nome} dos favoritos">★</button>
                    </div>
                    <div class="card-info">
                        <h3>${esporte.nome}</h3>
                        <p>${esporte.tag}</p>
                    </div>
                `;

                vitrine.appendChild(article);
            }
        });
    }

    //Captura o clique em qualquer botao de estrela da pagina
    document.addEventListener('click', (event) => {
        const botao = event.target.closest('.card-imagem button');
        if (botao) {
            const card = botao.closest('.card-esporte');
            if (card && card.dataset.id) {
                alternarFavorito(card.dataset.id);
            }
        }
    });

    // EXECUCAO INICIAL ao carregar a pagina
    atualizarEstrelas();
    renderizarPaginaFavoritos();
});