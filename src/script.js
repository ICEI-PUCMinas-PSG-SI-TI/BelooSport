document.addEventListener("DOMContentLoaded", () => {
    
    
    const btnInicio = document.getElementById("btn-menu-inicio");
    const btnEsportes = document.getElementById("btn-menu-esportes");
    const btnExplorar = document.getElementById("btn-explorar");
    
    const secaoInicio = document.getElementById("secao-inicio");
    const secaoEsportes = document.getElementById("secao-esportes");
    const todosLinksNav = document.querySelectorAll(".nav-destaque");

    const inputBusca = document.getElementById("input-busca");
    const botoesFiltro = document.querySelectorAll(".btn-filtro");
    
    
    const cardsEsportes = document.querySelectorAll(".card-esporte, .card-esporte-animado");

    
    function navegarPara(secaoDestino, linkAtivo) {
        secaoInicio.classList.add("d-none");
        secaoEsportes.classList.add("d-none");
        
        todosLinksNav.forEach(link => link.classList.remove("ativo"));
        
        secaoDestino.classList.remove("d-none");
        if (linkAtivo) {
            linkAtivo.classList.add("ativo");
        }
    }

   
    btnInicio.addEventListener("click", (e) => {
        e.preventDefault();
        navegarPara(secaoInicio, btnInicio);
    });

    btnEsportes.addEventListener("click", (e) => {
        e.preventDefault();
        navegarPara(secaoEsportes, btnEsportes);
    });

    btnExplorar.addEventListener("click", (e) => {
        e.preventDefault();
        navegarPara(secaoEsportes, btnEsportes);
    });

    
    if (inputBusca) {
        inputBusca.addEventListener("input", function() {
            const termoDigitado = this.value.toLowerCase().trim();

            cardsEsportes.forEach(card => {
                const tituloElement = card.querySelector(".titulo-card");
                
                if (tituloElement) {
                    const nomeEsporte = tituloElement.textContent.toLowerCase();
                    
                    if (nomeEsporte.includes(termoDigitado)) {
                        card.classList.remove("d-none");
                    } else {
                        card.classList.add("d-none");
                    }
                }
            });

            
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            const btnTodos = document.querySelector('[data-filtro="todos"]');
            if (btnTodos) btnTodos.classList.add("ativo");
        });
    }

    
    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", function() {
            
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            this.classList.add("ativo");

            const filtroEscolhido = this.getAttribute("data-filtro");

            
            cardsEsportes.forEach(card => {
                const categoriasDoCard = card.getAttribute("data-categoria") || "";
                
                if (filtroEscolhido === "todos" || categoriasDoCard.includes(filtroEscolhido)) {
                    card.classList.remove("d-none");
                } else {
                    card.classList.add("d-none");
                }
            });

            
            if (inputBusca) {
                inputBusca.value = "";
            }
        });
    });
});