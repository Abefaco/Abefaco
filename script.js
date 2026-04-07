function autenticar() {
    var emailInput = document.getElementById('email').value.trim().toLowerCase();
    var codigoInput = document.getElementById('codigo').value.trim();
    var mensagem = document.getElementById('mensagem');

    if (!emailInput || !codigoInput) {
        mensagem.innerHTML = "Preencha todos os campos.";
        return;
    }

    mensagem.innerHTML = "Verificando...";

    Papa.parse("database.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            var dados = results.data;
            var trabalhoEncontrado = null;

            // Busca manual para evitar erros de funções modernas
            for (var i = 0; i < dados.length; i++) {
                if (String(dados[i].Número).trim() === codigoInput) {
                    trabalhoEncontrado = dados[i];
                    break;
                }
            }

            if (trabalhoEncontrado) {
                var emailsValidos = trabalhoEncontrado.Emails ? trabalhoEncontrado.Emails.toLowerCase() : "";
                if (emailsValidos.indexOf(emailInput) !== -1) {
                    localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalhoEncontrado));
                    window.location.href = "dashboard.html";
                } else {
                    mensagem.innerHTML = "E-mail não autorizado.";
                }
            } else {
                mensagem.innerHTML = "Código não encontrado.";
            }
        },
        error: function() {
            mensagem.innerHTML = "Erro ao carregar database.csv";
        }
    });
}
