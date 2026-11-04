function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

async function assinarNewsletter(evento) {
  evento.preventDefault();

  explicar(
    "Você clicou no botão 'Enviar' da newsletter.\n\n" +
    "O que esta função faz:\n" +
    "1. Lê o e-mail digitado no campo\n" +
    "2. Confere se o e-mail é válido e se ainda não foi cadastrado\n" +
    "3. Guarda o e-mail no JSONServer (arquivo db.json, lista 'newsletter')"
  );

  const campoEmail = document.getElementById("campoEmail");
  const email = campoEmail.value.trim().toLowerCase();

  if (!emailValido(email)) {
    mostrarMensagem("mensagemNewsletter", "Digite um e-mail válido. Exemplo: nome@email.com", "danger");
    campoEmail.focus();
    return;
  }

  try {
    const existentes = await requisicao("/newsletter?email=" + encodeURIComponent(email));
    if (existentes.length > 0) {
      mostrarMensagem("mensagemNewsletter", "Este e-mail já está cadastrado na newsletter.", "warning");
      return;
    }

    await requisicao("/newsletter", enviarJson("POST", {
      email: email,
      dataInscricao: new Date().toISOString()
    }));

    campoEmail.value = "";
    mostrarMensagem("mensagemNewsletter", "Pronto! Seu e-mail foi cadastrado na newsletter.", "success");
  } catch (erro) {
    mostrarMensagem("mensagemNewsletter", "Não foi possível salvar o e-mail agora. O JSONServer está ligado?", "danger");
    avisarErroServidor();
  }
}

function explicarBotaoCadastrar() {
  explicar(
    "Você clicou no botão 'Cadastrar equipes +'.\n\n" +
    "O que esta função faz: redireciona você para a página do formulário (cadastro.html), onde é possível cadastrar, editar e excluir equipes."
  );
}

window.addEventListener("load", function () {
  configurarMenu();

  document.getElementById("formNewsletter").addEventListener("submit", assinarNewsletter);
  document.getElementById("botaoCadastrar").addEventListener("click", explicarBotaoCadastrar);

  setTimeout(function () {
    explicar(
      "BEM-VINDO À PÁGINA INICIAL DE 'EQUIPES'!\n\n" +
      "Esta página tem apenas duas funções:\n" +
      "1: cadastrar o e-mail do usuário na nossa newsletter (campo de e-mail + botão 'Enviar').\n" +
      "2: redirecionar o usuário para a página do formulário através do clique no botão 'Cadastrar equipes +'.\n\n" +
      "Os botões do menu (Início, Esportes, Eventos, Mapa, Sobre e Informações) pertencem a outras Sprints e só mostram um aviso."
    );
  }, 400);
});
