let listaEquipes = [];
let idEmEdicao = null;

function lerFormulario() {
  return {
    nome: document.getElementById("campoNome").value.trim(),
    modalidade: document.getElementById("campoModalidade").value.trim(),
    responsavel: document.getElementById("campoResponsavel").value.trim(),
    instagram: document.getElementById("campoInstagram").value.trim().replace(/\s/g, ""),
    whatsapp: document.getElementById("campoWhatsapp").value.trim()
  };
}

function validarDados(dados) {
  if (dados.nome.length < 3) {
    return { campo: "campoNome", texto: "Informe o nome da equipe (mínimo 3 letras)." };
  }
  const nomeRepetido = listaEquipes.some(function (equipe) {
    return equipe.nome.toLowerCase() === dados.nome.toLowerCase() && equipe.id !== idEmEdicao;
  });
  if (nomeRepetido) {
    return { campo: "campoNome", texto: "Já existe uma equipe com esse nome. Escolha outro nome." };
  }
  if (dados.modalidade.length < 3) {
    return { campo: "campoModalidade", texto: "Informe a modalidade esportiva da equipe." };
  }
  if (dados.responsavel.length < 3) {
    return { campo: "campoResponsavel", texto: "Informe o nome do responsável pela equipe." };
  }
  if (dados.instagram !== "") {
    if (dados.instagram.charAt(0) !== "@") {
      dados.instagram = "@" + dados.instagram;
    }
    if (!/^@[A-Za-z0-9._]{1,30}$/.test(dados.instagram)) {
      return { campo: "campoInstagram", texto: "Instagram inválido. Use letras, números, ponto ou _ (exemplo: @minha_equipe)." };
    }
  }
  const digitos = dados.whatsapp.replace(/\D/g, "");
  if (dados.whatsapp !== "" && digitos.length !== 10 && digitos.length !== 11) {
    return { campo: "campoWhatsapp", texto: "WhatsApp inválido. Digite o DDD e o número (exemplo: (31) 91234-5678)." };
  }
  return null;
}

function aplicarMascaraWhatsapp() {
  const campo = document.getElementById("campoWhatsapp");
  let digitos = campo.value.replace(/\D/g, "").slice(0, 11);
  if (digitos.length > 10) {
    campo.value = "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 7) + "-" + digitos.slice(7);
  } else if (digitos.length > 6) {
    campo.value = "(" + digitos.slice(0, 2) + ") " + digitos.slice(2, 6) + "-" + digitos.slice(6);
  } else if (digitos.length > 2) {
    campo.value = "(" + digitos.slice(0, 2) + ") " + digitos.slice(2);
  } else {
    campo.value = digitos;
  }
}

function atualizarModoFormulario() {
  const selo = document.getElementById("seloModo");
  const botao = document.getElementById("botaoSalvar");
  if (idEmEdicao === null) {
    selo.textContent = "Modo: Novo cadastro";
    selo.classList.remove("editando");
    botao.textContent = "Salvar equipe";
  } else {
    selo.textContent = "Modo: Editando equipe";
    selo.classList.add("editando");
    botao.textContent = "Atualizar equipe";
  }
}

function limparFormulario() {
  document.getElementById("formEquipe").reset();
  idEmEdicao = null;
  atualizarModoFormulario();
}

function desenharTabela() {
  const corpo = document.getElementById("corpoTabela");
  const donoId = obterDonoId();
  corpo.replaceChildren();

  document.getElementById("contadorEquipes").textContent =
    listaEquipes.length + (listaEquipes.length === 1 ? " registro" : " registros") + " · atualizada dinamicamente";

  if (listaEquipes.length === 0) {
    const linhaVazia = criarElemento("tr");
    const celulaVazia = criarElemento("td", "text-center text-secondary py-4", "Nenhuma equipe cadastrada ainda. Use o formulário acima para cadastrar a primeira!");
    celulaVazia.colSpan = 6;
    linhaVazia.appendChild(celulaVazia);
    corpo.appendChild(linhaVazia);
    return;
  }

  listaEquipes.forEach(function (equipe) {
    const minha = equipe.donoId === donoId;
    const linha = criarElemento("tr", minha ? "linha-minha" : "");

    const celulaNome = criarElemento("td", "fw-bold", equipe.nome);
    if (minha) {
      celulaNome.appendChild(criarElemento("span", "selo-minha", "SUA EQUIPE"));
    }
    linha.appendChild(celulaNome);
    linha.appendChild(criarElemento("td", "", equipe.modalidade));
    linha.appendChild(criarElemento("td", "", equipe.responsavel));

    const celulaInstagram = criarElemento("td");
    celulaInstagram.appendChild(criarLinkInstagram(equipe.instagram));
    linha.appendChild(celulaInstagram);

    const celulaWhatsapp = criarElemento("td");
    celulaWhatsapp.appendChild(criarLinkWhatsapp(equipe.whatsapp));
    linha.appendChild(celulaWhatsapp);

    const celulaAcoes = criarElemento("td");
    const grupo = criarElemento("div", "d-flex gap-2");
    const botaoEditar = criarElemento("button", "botao-editar", "Editar");
    const botaoExcluir = criarElemento("button", "botao-excluir", "Excluir");
    botaoEditar.type = "button";
    botaoExcluir.type = "button";

    if (minha) {
      botaoEditar.addEventListener("click", function () {
        editarEquipe(equipe.id);
      });
      botaoExcluir.addEventListener("click", function () {
        excluirEquipe(equipe.id);
      });
    } else {
      botaoEditar.disabled = true;
      botaoExcluir.disabled = true;
      grupo.title = "Somente quem cadastrou a equipe pode editar ou excluir.";
    }

    grupo.appendChild(botaoEditar);
    grupo.appendChild(botaoExcluir);
    celulaAcoes.appendChild(grupo);
    linha.appendChild(celulaAcoes);

    corpo.appendChild(linha);
  });
}

async function carregarEquipes() {
  try {
    listaEquipes = await requisicao("/equipes?_sort=id&_order=desc");
    desenharTabela();
  } catch (erro) {
    mostrarMensagem("mensagemFormulario", "Não foi possível carregar as equipes. O JSONServer está ligado?", "danger");
    avisarErroServidor();
  }
}

async function salvarEquipe(evento) {
  evento.preventDefault();

  if (idEmEdicao === null) {
    explicar(
      "Você clicou no botão 'Salvar equipe'.\n\n" +
      "O que esta função faz:\n" +
      "1. Lê os campos do formulário\n" +
      "2. Confere se tudo foi preenchido corretamente\n" +
      "3. Cria uma nova equipe no JSONServer (operação CREATE)\n" +
      "4. Atualiza a tabela abaixo sem recarregar a página\n\n" +
      "A equipe ficará vinculada a este navegador: só você poderá editá-la ou excluí-la."
    );
  } else {
    explicar(
      "Você clicou no botão 'Atualizar equipe'.\n\n" +
      "O que esta função faz:\n" +
      "1. Lê os novos valores dos campos\n" +
      "2. Confere se você é mesmo quem cadastrou esta equipe\n" +
      "3. Altera a equipe no JSONServer (operação UPDATE)\n" +
      "4. Atualiza a tabela abaixo"
    );
  }

  const dados = lerFormulario();
  const erro = validarDados(dados);
  if (erro) {
    mostrarMensagem("mensagemFormulario", erro.texto, "danger");
    document.getElementById(erro.campo).focus();
    return;
  }

  try {
    if (idEmEdicao === null) {
      dados.donoId = obterDonoId();
      dados.criadoEm = new Date().toISOString();
      await requisicao("/equipes", enviarJson("POST", dados));
      mostrarMensagem("mensagemFormulario", "Equipe cadastrada com sucesso!", "success");
    } else {
      const atual = await requisicao("/equipes/" + idEmEdicao);
      if (atual.donoId !== obterDonoId()) {
        mostrarMensagem("mensagemFormulario", "Bloqueado: somente quem cadastrou esta equipe pode alterá-la.", "danger");
        limparFormulario();
        await carregarEquipes();
        return;
      }
      dados.atualizadoEm = new Date().toISOString();
      await requisicao("/equipes/" + idEmEdicao, enviarJson("PATCH", dados));
      mostrarMensagem("mensagemFormulario", "Equipe atualizada com sucesso!", "success");
    }
    limparFormulario();
    await carregarEquipes();
  } catch (erroServidor) {
    mostrarMensagem("mensagemFormulario", "Não foi possível salvar. Verifique se o JSONServer está ligado e se a equipe ainda existe.", "danger");
    avisarErroServidor();
  }
}

function editarEquipe(id) {
  explicar(
    "Você clicou no botão 'Editar'.\n\n" +
    "O que esta função faz: copia os dados da equipe da linha da tabela para o formulário lá em cima. " +
    "Depois é só mudar o que quiser e clicar em 'Atualizar equipe'.\n\n" +
    "Só quem cadastrou a equipe consegue usar este botão."
  );

  const equipe = listaEquipes.find(function (item) {
    return item.id === id;
  });
  if (!equipe || equipe.donoId !== obterDonoId()) {
    mostrarMensagem("mensagemFormulario", "Bloqueado: somente quem cadastrou esta equipe pode alterá-la.", "danger");
    return;
  }

  document.getElementById("campoNome").value = equipe.nome;
  document.getElementById("campoModalidade").value = equipe.modalidade;
  document.getElementById("campoResponsavel").value = equipe.responsavel;
  document.getElementById("campoInstagram").value = equipe.instagram || "";
  document.getElementById("campoWhatsapp").value = equipe.whatsapp || "";

  idEmEdicao = id;
  atualizarModoFormulario();
  document.getElementById("formEquipe").scrollIntoView({ behavior: "smooth", block: "center" });
  document.getElementById("campoNome").focus();
}

async function excluirEquipe(id) {
  explicar(
    "Você clicou no botão 'Excluir'.\n\n" +
    "O que esta função faz: pede uma confirmação e, se você confirmar, apaga a equipe do JSONServer (operação DELETE) e remove a linha da tabela.\n\n" +
    "Só quem cadastrou a equipe consegue usar este botão."
  );

  try {
    const atual = await requisicao("/equipes/" + id);
    if (atual.donoId !== obterDonoId()) {
      mostrarMensagem("mensagemFormulario", "Bloqueado: somente quem cadastrou esta equipe pode excluí-la.", "danger");
      await carregarEquipes();
      return;
    }
    if (!confirm("Tem certeza que deseja excluir a equipe '" + atual.nome + "'?\nEsta ação não pode ser desfeita.")) {
      return;
    }
    await requisicao("/equipes/" + id, { method: "DELETE" });
    if (idEmEdicao === id) {
      limparFormulario();
    }
    mostrarMensagem("mensagemFormulario", "Equipe excluída com sucesso!", "success");
    await carregarEquipes();
  } catch (erro) {
    mostrarMensagem("mensagemFormulario", "Não foi possível excluir. Verifique se o JSONServer está ligado e se a equipe ainda existe.", "danger");
    await carregarEquipes();
  }
}

function cancelarEdicao() {
  if (idEmEdicao === null) {
    explicar(
      "Você clicou no botão 'Cancelar edição'.\n\n" +
      "Nenhuma equipe está sendo editada agora, então esta função apenas limpa o formulário."
    );
  } else {
    explicar(
      "Você clicou no botão 'Cancelar edição'.\n\n" +
      "O que esta função faz: descarta as mudanças, limpa o formulário e volta para o modo 'Novo cadastro'. Nada é alterado no JSONServer."
    );
  }
  limparFormulario();
  document.getElementById("mensagemFormulario").classList.add("d-none");
}

function explicarVitrine() {
  explicar(
    "Você clicou em 'Ver vitrine de equipes'.\n\n" +
    "Isto leva você para a página lista.html, que mostra todas as equipes em cartões, com pesquisa, filtro por modalidade e ordenação."
  );
}

window.addEventListener("load", function () {
  configurarMenu();
  atualizarModoFormulario();
  carregarEquipes();

  document.getElementById("formEquipe").addEventListener("submit", salvarEquipe);
  document.getElementById("botaoCancelar").addEventListener("click", cancelarEdicao);
  document.getElementById("campoWhatsapp").addEventListener("input", aplicarMascaraWhatsapp);
  document.getElementById("linkVitrine").addEventListener("click", explicarVitrine);

  setTimeout(function () {
    explicar(
      "BEM-VINDO À PÁGINA 'GESTÃO DE EQUIPES'!\n\n" +
      "Aqui você faz o CRUD completo das equipes:\n" +
      "• Criar: preencha o formulário e clique em 'Salvar equipe'.\n" +
      "• Ler: a tabela 'Equipes cadastradas' mostra todos os registros do JSONServer.\n" +
      "• Atualizar: clique em 'Editar' na linha da sua equipe, mude os dados e clique em 'Atualizar equipe'.\n" +
      "• Excluir: clique em 'Excluir' na linha da sua equipe e confirme.\n\n" +
      "REGRA DE SEGURANÇA: cada equipe só pode ser editada ou excluída por quem a cadastrou. Nas equipes de outras pessoas, os botões ficam desativados."
    );
  }, 400);
});
