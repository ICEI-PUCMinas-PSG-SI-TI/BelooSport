const API_URL = "http://localhost:3000";
const ALERTAS_ATIVOS = true;

function explicar(mensagem) {
  if (ALERTAS_ATIVOS) {
    alert(mensagem);
  }
}

function obterDonoId() {
  let donoId = localStorage.getItem("belosportDonoId");
  if (!donoId) {
    donoId = "dono-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("belosportDonoId", donoId);
  }
  return donoId;
}

async function requisicao(caminho, opcoes) {
  const resposta = await fetch(API_URL + caminho, opcoes);
  if (!resposta.ok) {
    throw new Error("Erro " + resposta.status);
  }
  return resposta.json();
}

function enviarJson(metodo, dados) {
  return {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados)
  };
}

function avisarErroServidor() {
  explicar(
    "ATENÇÃO: não foi possível conversar com o JSONServer.\n\n" +
    "O JSONServer é o nosso 'banco de dados'. Para ligá-lo:\n" +
    "1. Abra o terminal dentro da pasta do projeto\n" +
    "2. Digite: npm start\n" +
    "3. Volte aqui e recarregue a página (tecla F5)"
  );
}

function mostrarMensagem(idElemento, texto, tipo) {
  const caixa = document.getElementById(idElemento);
  caixa.className = "alert alert-" + tipo + " mt-3";
  caixa.textContent = texto;
  clearTimeout(caixa.temporizador);
  caixa.temporizador = setTimeout(function () {
    caixa.classList.add("d-none");
  }, 6000);
}

function criarElemento(tag, classes, texto) {
  const elemento = document.createElement(tag);
  if (classes) {
    elemento.className = classes;
  }
  if (texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

function criarLinkInstagram(instagram) {
  if (!instagram) {
    return document.createTextNode("-");
  }
  const link = criarElemento("a", "", instagram);
  link.href = "https://www.instagram.com/" + instagram.replace("@", "");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function criarLinkWhatsapp(whatsapp) {
  if (!whatsapp) {
    return document.createTextNode("-");
  }
  const link = criarElemento("a", "", whatsapp);
  link.href = "https://wa.me/55" + whatsapp.replace(/\D/g, "");
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  return link;
}

function configurarMenu() {
  document.querySelectorAll("[data-pagina-pendente]").forEach(function (link) {
    link.addEventListener("click", function (evento) {
      evento.preventDefault();
      explicar(
        "Você clicou em '" + link.getAttribute("data-pagina-pendente").toUpperCase() + "' no menu.\n\n" +
        "Esta página NÃO faz parte desta Sprint. Ela será feita por outro integrante da equipe e depois integrada ao portal.\n\n" +
        "Por isso, nada acontece aqui. Use o botão 'EQUIPES' para ver a funcionalidade desta entrega."
      );
    });
  });

  const linkEquipes = document.getElementById("linkEquipes");
  if (linkEquipes) {
    linkEquipes.addEventListener("click", function () {
      explicar(
        "Você clicou no botão 'EQUIPES' do menu.\n\n" +
        "Ele leva você para a página inicial de Equipes, onde ficam o botão 'Cadastrar equipes +' e a newsletter."
      );
    });
  }
}
