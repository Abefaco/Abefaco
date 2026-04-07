function autenticar() {
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const codigoInput = document.getElementById('codigo').value.trim();
    const mensagem = document.getElementById('mensagem');

    if (!emailInput || !codigoInput) {
        mensagem.innerHTML = "<span style='color:red;'>Preencha todos os campos.</span>";
        return;
    }

    mensagem.innerHTML = "Carregando...";

    Papa.parse("database.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const dados = results.data;
            // Busca o trabalho comparando o número como String para evitar erro de tipo
            const trabalho = dados.find(t => String(t.Número).trim() === codigoInput);

            if (trabalho) {
                const emailsNoBanco = trabalho.Emails ? trabalho.Emails.toLowerCase() : "";
                if (emailsNoBanco.includes(emailInput)) {
                    localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalho));
                    window.location.href = "dashboard.html";
                } else {
                    mensagem.innerHTML = "<span style='color:red;'>E-mail não autorizado.</span>";
                }
            } else {
                mensagem.innerHTML = "<span style='color:red;'>Código não encontrado.</span>";
            }
        },
        error: function() {
            mensagem.innerHTML = "<span style='color:red;'>Erro ao ler o banco (database.csv).</span>";
        }
    });
}
