function autenticar() {
    const emailInput = document.getElementById('email').value.trim().toLowerCase();
    const codigoInput = document.getElementById('codigo').value.trim();
    const mensagem = document.getElementById('mensagem');

    mensagem.innerHTML = "Carregando banco de dados...";

    // Lendo o arquivo CSV que você subiu no GitHub
    Papa.parse("database.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const dados = results.data;
            
            // Procura o trabalho pelo "Número"
            const trabalho = dados.find(t => t.Número === codigoInput);

            if (trabalho) {
                // Verifica se o email está na lista de emails (separados por vírgula no Even3)
                const emailsNoBanco = trabalho.Emails.toLowerCase();
                
                if (emailsNoBanco.includes(emailInput)) {
                    // Se for sucesso, salva os dados na sessão e vai para o painel
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
            mensagem.innerHTML = "<span style='color:red;'>Erro ao ler o banco de dados. Verifique o arquivo CSV.</span>";
        }
    });
}