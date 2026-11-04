document.addEventListener("DOMContentLoaded", () => {
    
   
    const btnInicio = document.getElementById("btn-menu-inicio");
    const btnEsportes = document.getElementById("btn-menu-esportes");
    const btnExplorar = document.getElementById("btn-explorar");
    
    const secaoInicio = document.getElementById("secao-inicio");
    const secaoEsportes = document.getElementById("secao-esportes");
    const todosLinksNav = document.querySelectorAll(".nav-destaque");

    
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

    
    const botoesFiltro = document.querySelectorAll(".btn-filtro");
    const cardsEsportes = document.querySelectorAll(".card-esporte");

    botoesFiltro.forEach(botao => {
        botao.addEventListener("click", function() {
            
            
            botoesFiltro.forEach(b => b.classList.remove("ativo"));
            this.classList.add("ativo");

            const filtroEscolhido = this.getAttribute("data-filtro");

            
            cardsEsportes.forEach(card => {
                const categoriasDoCard = card.getAttribute("data-categoria");
                
                if (filtroEscolhido === "todos" || categoriasDoCard.includes(filtroEscolhido)) {
                    card.classList.remove("d-none");
                } else {
                    card.classList.add("d-none");
                }
            });
        });
    });
});