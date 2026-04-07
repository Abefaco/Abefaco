function autenticar() {
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const codigoInput = document.getElementById('codigo').value.trim();
    const mensagem = document.getElementById('mensagem');

    if (!emailInput || !codigoInput) {
        mensagem.innerHTML = "<span style='color:red;'>Por favor, preencha todos os campos.</span>";
        return;
    }

    mensagem.innerHTML = "Carregando banco de dados...";

    Papa.parse("database.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const dados = results.data;
            
            // Busca o trabalho pelo campo "Número"
            const trabalho = dados.find(t => String(t.Número).trim() === codigoInput);

            if (trabalho) {
                // Garante que o campo Emails exista antes de converter para minúsculo
                const emailsNoBanco = trabalho.Emails ? trabalho.Emails.toLowerCase() : "";
                
                if (emailsNoBanco.includes(emailInput)) {
                    localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalho));
                    window.location.href = "dashboard.html";
                } else {
                    mensagem.innerHTML = "<span style='color:red;'>E-mail não autorizado para este código.</span>";
                }
            } else {
                mensagem.innerHTML = "<span style='color:red;'>Código de trabalho não encontrado.</span>";
            }
        },
        error: function() {
            mensagem.innerHTML = "<span style='color:red;'>Erro ao ler o arquivo CSV. Verifique se o nome é database.csv</span>";
        }
    });
}
