function buscarProfissionaisComFiltro() {
    if (validaDadosPesquisa()) {
        $.post("Profissional/BuscaComFiltro", { nomeCompleto: $("#nomeCompleto").val(), ativo: $("#apenasAtivos").is(":checked"), rangeMenor: $("#rangeMenor").val(), rangeMaior: $("#rangeMaior").val() }, function (data) {
            if (data) {
                $("#listaProfissionais").html("");
                for (i = 0; i < data.length; i++) {
                    var ativoInfo = "Não";
                    if (data[i].ativo) {
                        ativoInfo = "Sim";
                    }
                    $("#listaProfissionais").append("<tr>" +
                        "<td>" + data[i].numeroRegistro + "</td>" +
                        "<td>" + data[i].nomeCompleto + "</td>" +
                        "<td>" + data[i].cpf + "</td>" +
                        "<td>" + ativoInfo + "</td>" +
                        "<td>" + formatarDataNascimentoApresentacao(data[i].dataCriacao) + "</td>" +
                        "<td> <button type='button' onclick='buscarRegistroDeProfissional(" + data[i].id + ")' data-bs-toggle='modal' data-bs-target='#cadastro' class='btn btn-primary botaoEditarProfissional'>Editar</button> " +
                        "<button type='button' onclick='excluirRegistroDeProfissional(" + data[i].id + ")' class='btn btn-danger'>Excluir</button></td>" +
                        "</tr>");
                }
            }
        });
    }
}

function formatarDataNascimentoApresentacao(dataC) {
    var novaData = dataC.substring(8, 10) + "/" + dataC.substring(7, 5) + "/" + dataC.substring(0, 4);
    return novaData;
}

function verificarDados() {

    if ($("#inputNomeCompleto").val() == "") {
        alert("O Campo Nome é obrigatório!");
        $("#inputNomeCompleto").val().focus;
        return false;
    } else if ($("#inputCPF").val() == "") {
        alert("O Campo CPF é obrigatório!");
        $("#inputCPF").val().focus;
        return false;
    } else if ($("#inputDataNascimento").val() == "") {
        alert("O Campo Data Nascimento é obrigatório!");
        $("#inputDataNascimento").val().focus;
        return false;
    } else if ($("#inputSexo").val() == null) {
        alert("O Campo Sexo é obrigatório!");
        $("#inputSexo").val().focus;
        return false;
    } else if (verificaCPF($("#inputCPF").val())) {
        alert("O CPF informado é inválido!");
        $("#inputCPF").val().focus;
        return false;
    } else if (calculaIdade($("#inputDataNascimento").val())) {
        alert("O Profissional deve ser maior de 18 anos!");
        $("#inputDataNascimento").val().focus;
        return false;
    } else {
        return true;
    }
}

function verificaCPF(strCpf) {
    var soma;
    var resto;
    soma = 0;
    if (strCpf == "00000000000") {
        return true;
    }
    for (i = 1; i <= 9; i++) {
        soma = soma + parseInt(strCpf.substring(i - 1, i)) * (11 - i);
    }
    resto = soma % 11;
    if (resto == 10 || resto == 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }
    if (resto != parseInt(strCpf.substring(9, 10))) {
        return true;
    }
    soma = 0;
    for (i = 1; i <= 10; i++) {
        soma = soma + parseInt(strCpf.substring(i - 1, i)) * (12 - i);
    }
    resto = soma % 11;
    if (resto == 10 || resto == 11 || resto < 2) {
        resto = 0;
    } else {
        resto = 11 - resto;
    }
    if (resto != parseInt(strCpf.substring(10, 11))) {
        return true;
    }
    return false;
}

function calculaIdade(dataNasc) {
    var dataAtual = new Date();
    var anoAtual = dataAtual.getFullYear();
    var anoNascParts = dataNasc.split('-');
    var diaNasc = anoNascParts[2];
    var mesNasc = anoNascParts[1];
    var anoNasc = anoNascParts[0];
    var idade = anoAtual - anoNasc;
    var mesAtual = dataAtual.getMonth() + 1;
    //Se mes atual for menor que o nascimento, nao fez aniversario ainda;  
    if (mesAtual < mesNasc) {
        idade--;
    } else {
        //Se estiver no mes do nascimento, verificar o dia
        if (mesAtual == mesNasc) {
            if (new Date().getDate() < diaNasc) {
                //Se a data atual for menor que o dia de nascimento ele ainda nao fez aniversario
                idade--;
            }
        }
    }

    if (idade >= 18) {
        return false;
    } else {
        return true;
    }
}

function salvarProfissional() {

    if (verificarDados()) {

        var cadastroProfissional = {
            Id: $("#inputId").val(),
            NomeCompleto: $("#inputNomeCompleto").val(),
            CPF: $("#inputCPF").val(),
            DataNascimento: $("#inputDataNascimento").val(),
            Sexo: $("#inputSexo").val(),
            Ativo: $("#inputAtivo").is(":checked"),
            NumeroRegistro: $("#inputNumeroRegistro").val(),
            CEP: $("#inputCEP").val(),
            Cidade: $("#inputCidade").val(),
            ValorRenda: $("#inputValorRenda").val(),
            DataCriacao: new Date()
        }

        $.post("Profissional/SalvarProfissional", { profissionalModel : cadastroProfissional }, function (data) {
            if (data == "Já existe um registro com o mesmo nome!") {

                Swal.fire({
                    title: 'OPS',
                    text: data,
                    icon: 'error',
                    confirmButtonText: 'Ok',
                    timer: 4000
                });
            } else {
                Swal.fire({
                    title: 'OBA',
                    text: data,
                    icon: 'success',
                    confirmButtonText: 'Ok',
                    timer: 4000
                });
                limparFormulario();
            }

        });
    }

}

function buscarRegistroDeProfissional(codigo) {

    $.post("Profissional/BuscarRegistroDeProfissional", { codigo: codigo }, function (data) {
        if (data) {
            $("#inputNumeroRegistro").val(data.numeroRegistro);
            $("#inputId").val(data.id);
            $("#inputNomeCompleto").val(data.nomeCompleto);
            $("#inputCPF").val(data.cpf);
            $("#inputDataNascimento").val(data.dataNascimento.substring(0, 10));
            $("#inputSexo").val(data.sexo);
            $("#inputCEP").val(data.cep);
            $("#inputCidade").val(data.cidade);
            $("#inputValorRenda").val(data.valorRenda);

            if (data.ativo) {
                $("#inputAtivo").attr("checked", true);
            }
            
        }
    });
}

function limparFormulario() {
    $("#inputNumeroRegistro").val("");
    $("#inputId").val("");
    $("#inputNomeCompleto").val("");
    $("#inputCPF").val("");
    $("#inputDataNascimento").val("");
    $("#inputSexo").val("");
    $("#inputCEP").val("");
    $("#inputCidade").val("");
    $("#inputValorRenda").val("");
    $("#inputAtivo").attr("checked", false);
}

function excluirRegistroDeProfissional(codigo) {
    Swal.fire({
        title: 'Confirma?',
        text: "Você tem certeza que quer excluir?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#f5365c',
        confirmButtonText: '<i class="far fa-thumbs-up"></i> Sim, excluir!',
        cancelButtonColor: '#888',
        cancelButtonText: '<i class="far fa-thumbs-down"></i> Não'
    }).then((result) => {
        if (result.value) {
            $.post("Profissional/ExcluirRegistroDeProfissional", { codigo: codigo }, function (data) {
                if (data) {
                    Swal.fire({
                        title: 'Excluído!',
                        text: 'Registro excluído com sucesso',
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        timer: 4000
                    })
                    document.getElementById('exclusao').innerHTML =
                        '<span class="text-danger">Registro excluído com sucesso!</span>';
                    location.reload();
                } else {
                    document.getElementById('exclusao').innerHTML =
                        '<span class="text-primary">O registro não foi excluído!</span>';
                }
            });
        } else {
            document.getElementById('exclusao').innerHTML =
                '<span class="text-primary">O registro não foi excluído!</span>';
        }
    })
}

function validaDadosPesquisa() {
    if (($("#rangeMenor").val() > 0 && $("#rangeMaior").val() == "") || ($("#rangeMaior").val() > 0 && $("#rangeMenor").val() == "")) {
        alert("Favor preencher ambos os campos de pesquisa de range!");
        return false;
    } else if ($("#rangeMenor").val() > $("#rangeMaior").val()) {
        alert("O número final deve ser menor que o inicial na pesquisa de range!");
    }
    return true;
}