/*
  --------------------------------------------------------------------------------------
  Função para obter a lista de encomendas do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const listarEncomendas = async () => {
  let url = 'http://127.0.0.1:5000/listar_encomendas';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {

      data.encomendas.forEach(item => incluirListaEnc(item.nome, item.casa, item.quantidade_p, item.pacote))
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Ocorreu um erro no serviço. Favor entrar em contato.')
    });
}

/*
  --------------------------------------------------------------------------------------
  Carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
listarEncomendas()


/*
  --------------------------------------------------------------------------------------
  Função para adicionar uma encomenda na lista do servidor via requisição post
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputNomeEncomenda, inputCasa, inputQuantidade_p, inputPacote) => {
  const formData = new FormData();
  formData.append('nome', inputNomeEncomenda);
  formData.append('casa', inputCasa);
  formData.append('quantidade_p', inputQuantidade_p);
  formData.append('pacote', inputPacote);

  let url = 'http://127.0.0.1:5000/encomenda';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => {
      if (response.status === 200) {
        incluirListaEnc(inputNomeEncomenda, inputCasa, inputQuantidade_p, inputPacote);
        alert('Encomenda adicionada com sucesso');
      } else {
        response.json().then((data) => {
          if (data && data.mensagem) {
            alert(data.mensagem);
          } else {
            alert("Erro desconhecido ao adicionar a encomenda. Favor entrar em contato.");
          }
        });
      }
    })
    .catch((error) => {
      alert('Ocorreu um erro no serviço. Favor entrar em contato.');
      console.log('Error: ', error);
    });
}
/*
  --------------------------------------------------------------------------------------
  Função para excluir uma encomenda do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteEncomenda = (item) => {

  let url = 'http://127.0.0.1:5000/encomenda?nome=' + item;

  fetch(url, {
    method: 'delete'
  })
    .then((response) => {
      if (response.status === 200) {
        alert('Encomenda excluída com sucesso')
      } else {
        // Tratar casos em que a resposta não tem status 200 (erro do servidor, por exemplo)
        response.json().then((data) => {
          // Exibir mensagem de erro, se disponível na resposta
          if (data && data.mensagem) {
            alert(data.mensagem);
          } else {
            alert("Erro desconhecido ao remover o item.");
          }
        });
      }
    })
    .catch((error) => {
      // Tratar erros de rede ou problemas na solicitação
      console.log('Error: ', error)
      alert('Erro na solicitação: ' + error.message);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chame a função adicionarEncomenda quando desejar adicionar uma encomenda.
  --------------------------------------------------------------------------------------
*/
const adicionarEncomenda = () => {

  // Verifica o tipo de receita
  if (typeof (document.getElementById("newPacote").value) === "undefined" ||
    typeof (document.getElementById("newPacote").value) === null) {
    alert("Tipo de encomenda inválida. Por favor, verifique.")
  }
  else {
    // Verifica as demais informações
    let inputNomeEncomenda = document.getElementById("newNomeEncomenda").value;
    let inputCasa = document.getElementById("newCasa").value;
    let inputQuantidade_p = document.getElementById("newQuantidade_p").value;
    let inputPacote = document.getElementById("newPacote").value;

    if (inputNomeEncomenda === '' || inputPacote === '') {
      alert("O nome da encomenda e o tipo de pacote são obrigatórios para o cadastro");
    }
    else if (inputPacote != "P" && inputPacote != "M" && inputPacote != "G") {
      alert("Tipo de encomenda inválida. Por favor verifique.");
    } else {
      try {
        postItem(inputNomeEncomenda, inputCasa, inputQuantidade_p, inputPacote);
      } catch (error) {
        alert("Erro ao cadastrar encomenda: " + error.message);
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Chame a função incluirListEnc quando desejar incluir uma encomenda na 
  lista de encomendas.
  --------------------------------------------------------------------------------------
*/
const incluirListaEnc = (nome, casa, quantidade_p, pacote) => {
  var table = document.getElementById('tab_enc');
  var row = table.insertRow();

  // Adiciona a propriedade "data-encomenda" para controle da seleção da linha
  // evento click
  row.setAttribute('data-encomenda', nome);

  // Trata o tipo de receita
  if (typeof pacote === 'undefined' || pacote === null) {
    tipo_pacote = "-"
  } else if (pacote === "P") {
    tipo_pacote = "Pequeno"
  } else if (pacote === "M") {
    tipo_pacote = "Medio"
  } else {
    tipo_pacote = "Grande"
  }

  var item = [nome, casa, quantidade_p, tipo_pacote]

  // Gera a lista de encomendas
  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }

  insertButtonExclusao(row.insertCell(-1))
  configuraOpEncomenda()

  document.getElementById("newNomeEncomenda").value = "";
  document.getElementById("newCasa").value = "";
  document.getElementById("newQuantidade_p").value = "";
  document.getElementById("newPacote").value = "";

}



/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista de encomendas
  --------------------------------------------------------------------------------------
*/
const insertButtonExclusao = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
  // Tooltip
  span.title = "Excluir encomenda";
}

/*
  --------------------------------------------------------------------------------------
  Função que define o script de operação na encomenda
  --------------------------------------------------------------------------------------
*/
const configuraOpEncomenda = () => {

  let close = document.getElementsByClassName("close");

  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Deseja realmente excluir " + nomeItem + "?")) {
        deleteEncomenda(nomeItem)
        div.remove()
      }
    }
  }

}
