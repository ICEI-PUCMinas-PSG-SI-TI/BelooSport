let todasEquipes = [];
let avisouBusca = false;
let avisouFiltros = false;

function preencherFiltroModalidade() {
  const filtro = document.getElementById("filtroModalidade");
  const selecionada = filtro.value;
  const modalidades = [];
  todasEquipes.forEach(function (equipe) {
    if (!modalidades.includes(equipe.modalidade)) {
      modalidades.push(equipe.modalidade);
    }
  });
  modalidades.sort(function (a, b) {
    return a.localeCompare(b, "pt-BR");
  });

  filtro.replaceChildren();
  const opcaoTodas = criarElemento("option", "", "Todas");
  opcaoTodas.value = "";
  filtro.appendChild(opcaoTodas);
  modalidades.forEach(function (modalidade) {
    const opcao = criarElemento("option", "", modalidade);
    opcao.value = modalidade;
    filtro.appendChild(opcao);
  });
  filtro.value = selecionada;
}

function obterEquipesFiltradas() {
  const termo = document.getElementById("campoBusca").value.trim().toLowerCase();
  const modalidade = document.getElementById("filtroModalidade").value;
  const ordem = document.getElementById("ordenacao").value;

  const resultado = todasEquipes.filter(function (equipe) {
    const texto = (equipe.nome + " " + equipe.modalidade + " " + equipe.responsavel).toLowerCase();
    return texto.includes(termo) && (modalidade === "" || equipe.modalidade === modalidade);
  });

  resultado.sort(function (a, b) {
    if (ordem === "nome") {
      return a.nome.localeCompare(b.nome, "pt-BR");
    }
    if (ordem === "modalidade") {
      return a.modalidade.localeCompare(b.modalidade, "pt-BR");
    }
    return b.id - a.id;
  });
  return resultado;
}

function desenharVitrine() {
  const vitrine = document.getElementById("vitrine");
  const donoId = obterDonoId();
  const equipes = obterEquipesFiltradas();
  vitrine.replaceChildren();

  document.getElementById("contadorLista").textContent =
    equipes.length + (equipes.length === 1 ? " equipe encontrada" : " equipes encontradas");

  if (equipes.length === 0) {
    vitrine.appendChild(criarElemento("p", "text-center text-secondary py-5", "Nenhuma equipe encontrada com esses filtros."));
    return;
  }

  equipes.forEach(function (equipe) {
    const coluna = criarElemento("div", "col-12 col-md-6 col-lg-4");
    const cartao = criarElemento("div", "card cartao-equipe" + (equipe.donoId === donoId ? " minha" : ""));
    const corpo = criarElemento("div", "card-body d-flex flex-column gap-2");

    const titulo = criarElemento("h3", "card-title mb-0", equipe.nome);
    if (equipe.donoId === donoId) {
      titulo.appendChild(criarElemento("span", "selo-minha", "SUA EQUIPE"));
    }
    corpo.appendChild(titulo);
    corpo.appendChild(criarElemento("span", "selo-modalidade align-self-start", equipe.modalidade));
    corpo.appendChild(criarElemento("p", "mb-1 small", "Responsável: " + equipe.responsavel));

    const contatos = criarElemento("div", "d-flex flex-column gap-1 mt-auto");
    const linhaInstagram = criarElemento("div", "", "Instagram: ");
    linhaInstagram.appendChild(criarLinkInstagram(equipe.instagram));
    const linhaWhatsapp = criarElemento("div", "", "WhatsApp: ");
    linhaWhatsapp.appendChild(criarLinkWhatsapp(equipe.whatsapp));
    contatos.appendChild(linhaInstagram);
    contatos.appendChild(linhaWhatsapp);
    corpo.appendChild(contatos);

    cartao.appendChild(corpo);
    coluna.appendChild(cartao);
    vitrine.appendChild(coluna);
  });
}

async function carregarVitrine() {
  try {
    todasEquipes = await requisicao("/equipes");
    preencherFiltroModalidade();
    desenharVitrine();
  } catch (erro) {
    document.getElementById("contadorLista").textContent = "Não foi possível carregar as equipes.";
    avisarErroServidor();
  }
}

function limparFiltros() {
  explicar(
    "Você clicou no botão 'Limpar'.\n\n" +
    "O que esta função faz: apaga a pesquisa, volta o filtro para 'Todas' as modalidades e a ordenação para 'Mais recentes'. Todas as equipes voltam a aparecer."
  );
  document.getElementById("campoBusca").value = "";
  document.getElementById("filtroModalidade").value = "";
  document.getElementById("ordenacao").value = "recentes";
  desenharVitrine();
}

function explicarBusca() {
  if (!avisouBusca) {
    avisouBusca = true;
    explicar(
      "Você clicou no campo 'Pesquisar'.\n\n" +
      "O que esta função faz: conforme você digita, os cartões são filtrados na hora, procurando o texto no nome da equipe, na modalidade e no responsável."
    );
  }
}

function explicarFiltros() {
  if (!avisouFiltros) {
    avisouFiltros = true;
    explicar(
      "Você mexeu em um filtro.\n\n" +
      "'Modalidade' mostra só as equipes do esporte escolhido. 'Ordenar por' muda a ordem dos cartões. A lista é atualizada na hora, sem recarregar a página."
    );
  }
}

window.addEventListener("load", function () {
  configurarMenu();
  carregarVitrine();

  document.getElementById("campoBusca").addEventListener("focus", explicarBusca);
  document.getElementById("campoBusca").addEventListener("input", desenharVitrine);
  document.getElementById("filtroModalidade").addEventListener("change", function () {
    explicarFiltros();
    desenharVitrine();
  });
  document.getElementById("ordenacao").addEventListener("change", function () {
    explicarFiltros();
    desenharVitrine();
  });
  document.getElementById("botaoLimpar").addEventListener("click", limparFiltros);
  document.getElementById("linkNovaEquipe").addEventListener("click", function () {
    explicar(
      "Você clicou em 'Cadastrar minha equipe'.\n\n" +
      "Isto leva você para a página do formulário (cadastro.html), onde a equipe é cadastrada."
    );
  });

  setTimeout(function () {
    explicar(
      "BEM-VINDO À VITRINE DE EQUIPES!\n\n" +
      "Esta página só mostra (leitura) as equipes cadastradas, em cartões. Você pode:\n" +
      "• pesquisar por nome, modalidade ou responsável;\n" +
      "• filtrar por modalidade;\n" +
      "• ordenar a lista;\n" +
      "• clicar em 'Cadastrar minha equipe' para ir ao formulário."
    );
  }, 400);
});
