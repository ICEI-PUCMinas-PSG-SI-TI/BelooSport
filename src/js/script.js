// ======================================
// CONFIGURAÇÃO DA API
// ======================================

const API_URL = "http://localhost:3000/mensagens_forum";

// ======================================
// ELEMENTOS HTML
// ======================================

const formulario = document.getElementById("form-mensagem");
const campoNome = document.getElementById("nome");
const campoEmail = document.getElementById("email");
const campoMensagem = document.getElementById("mensagem");

const listaMensagens = document.getElementById("mensagens");
const formularioNewsletter = document.getElementById("form-newsletter");

let mensagemEmEdicao = null;

// Botão de envio
const botaoEnviar = formulario.querySelector('button[type="submit"]');

// Botão para cancelar edição
const botaoCancelar = document.createElement("button");

botaoCancelar.type = "button";
botaoCancelar.textContent = "Cancelar edição";
botaoCancelar.hidden = true;

formulario.appendChild(botaoCancelar);


// ======================================
// CARREGAR MENSAGENS - READ
// ======================================

async function carregarMensagens() {

    try {

        const resposta = await fetch(API_URL);

        if (!resposta.ok) {
            throw new Error("Erro ao consultar a API.");
        }

        const mensagens = await resposta.json();

        listaMensagens.innerHTML = "";

        mensagens.sort((a, b) => {
            return new Date(b.dataEnvio) - new Date(a.dataEnvio);
        });

        if (mensagens.length === 0) {

            listaMensagens.textContent =
                "Ainda não existem mensagens. Seja a primeira pessoa a participar!";

            return;
        }

        mensagens.forEach(exibirMensagem);

    } catch (erro) {

        console.error("Erro ao carregar mensagens:", erro);

        listaMensagens.textContent =
            "Não foi possível carregar o fórum. Verifique a conexão com o JSON Server.";

    }

}


// ======================================
// EXIBIR MENSAGENS
// ======================================

function exibirMensagem(mensagem) {

    const cartao = document.createElement("article");
    cartao.className = "mensagem-forum";

    const nome = document.createElement("h3");
    nome.textContent = mensagem.nome;

    const email = document.createElement("p");
    email.textContent = mensagem.email;

    const texto = document.createElement("p");
    texto.textContent = mensagem.mensagem;

    const data = document.createElement("small");

    data.textContent = mensagem.dataEnvio
        ? "Enviado em: " +
          new Date(mensagem.dataEnvio).toLocaleString("pt-BR")
        : "";

    const botoes = document.createElement("div");
    botoes.className = "acoes-mensagem";

    const botaoEditar = document.createElement("button");

    botaoEditar.type = "button";
    botaoEditar.textContent = "Editar";
    botaoEditar.dataset.acao = "editar";
    botaoEditar.dataset.id = mensagem.id;

    const botaoExcluir = document.createElement("button");

    botaoExcluir.type = "button";
    botaoExcluir.textContent = "Excluir";
    botaoExcluir.dataset.acao = "excluir";
    botaoExcluir.dataset.id = mensagem.id;

    botoes.appendChild(botaoEditar);
    botoes.appendChild(botaoExcluir);

    cartao.appendChild(nome);
    cartao.appendChild(email);
    cartao.appendChild(texto);
    cartao.appendChild(data);
    cartao.appendChild(botoes);

    listaMensagens.appendChild(cartao);

}


// ======================================
// CADASTRAR E EDITAR - CREATE / UPDATE
// ======================================

formulario.addEventListener("submit", async function(evento) {

    evento.preventDefault();

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    const mensagem = campoMensagem.value.trim();

    if (!nome || !email || !mensagem) {

        alert("Preencha todos os campos.");

        return;
    }

    const dados = {
        nome: nome,
        email: email,
        mensagem: mensagem,
        dataEnvio: new Date().toISOString()
    };

    try {

        let resposta;

        if (mensagemEmEdicao !== null) {

            resposta = await fetch(
                `${API_URL}/${mensagemEmEdicao}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                }
            );

        } else {

            resposta = await fetch(
                API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(dados)
                }
            );

        }

        if (!resposta.ok) {
            throw new Error("Erro ao salvar mensagem.");
        }

        alert(
            mensagemEmEdicao !== null
                ? "Mensagem atualizada com sucesso!"
                : "Mensagem publicada com sucesso!"
        );

        formulario.reset();

        mensagemEmEdicao = null;

        botaoEnviar.textContent = "ENVIAR MENSAGEM";

        botaoCancelar.hidden = true;

        await carregarMensagens();

    } catch (erro) {

        console.error("Erro ao salvar:", erro);

        alert("Não foi possível salvar a mensagem.");

    }

});


// ======================================
// CANCELAR EDIÇÃO
// ======================================

botaoCancelar.addEventListener("click", function() {

    formulario.reset();

    mensagemEmEdicao = null;

    botaoEnviar.textContent = "ENVIAR MENSAGEM";

    botaoCancelar.hidden = true;

});


// ======================================
// EDITAR E EXCLUIR - UPDATE / DELETE
// ======================================

listaMensagens.addEventListener("click", async function(evento) {

    const botao = evento.target.closest("button[data-acao]");

    if (!botao) {
        return;
    }

    const id = botao.dataset.id;
    const acao = botao.dataset.acao;

    try {

        // EDITAR MENSAGEM

        if (acao === "editar") {

            const resposta = await fetch(`${API_URL}/${id}`);

            if (!resposta.ok) {
                throw new Error("Mensagem não encontrada.");
            }

            const mensagem = await resposta.json();

            campoNome.value = mensagem.nome;
            campoEmail.value = mensagem.email;
            campoMensagem.value = mensagem.mensagem;

            mensagemEmEdicao = id;

            botaoEnviar.textContent = "SALVAR ALTERAÇÕES";

            botaoCancelar.hidden = false;

            formulario.scrollIntoView({
                behavior: "smooth"
            });

        }


        // EXCLUIR MENSAGEM

        if (acao === "excluir") {

            const confirmar = confirm(
                "Deseja realmente excluir esta mensagem?"
            );

            if (!confirmar) {
                return;
            }

            const resposta = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!resposta.ok) {
                throw new Error("Erro ao excluir mensagem.");
            }

            alert("Mensagem excluída com sucesso!");

            await carregarMensagens();

        }

    } catch (erro) {

        console.error("Erro na operação:", erro);

        alert("Não foi possível realizar esta operação.");

    }

});


// ======================================
// NEWSLETTER
// ======================================

if (formularioNewsletter) {

    formularioNewsletter.addEventListener("submit", function(evento) {

        evento.preventDefault();

        alert(
            "O cadastro da newsletter será integrado ao requisito correspondente."
        );

    });

}


// ======================================
// EVENTO DE CARREGAMENTO DA PÁGINA
// ======================================

document.addEventListener("DOMContentLoaded", carregarMensagens);