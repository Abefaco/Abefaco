btn.onclick = function() {
    const emailUser = document.getElementById('email').value.trim().toLowerCase();
    const codUser = document.getElementById('codigo').value.trim();
    const msg = document.getElementById('mensagem');

    if (!emailUser || !codUser) {
        msg.innerHTML = "<span style='color:orange;'>Preencha os campos.</span>";
        return;
    }

    // --- PRIMEIRO: VERIFICA SE É ADMIN ---
    // Fazemos isso antes de abrir o CSV para evitar o erro de "Código não encontrado"
    if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
        const dadosAdmin = {
            Número: "ADMIN",
            Título: "PAINEL DE CONTROLE ADMINISTRATIVO",
            Autores: "Gestão ABEFACO"
        };
        localStorage.setItem('trabalhoAtivo', JSON.stringify(dadosAdmin));
        window.location.href = "dashboard.html";
        return; // O 'return' impede que o código abaixo seja executado
    }

    // --- SEGUNDO: BUSCA NO BANCO DE DADOS (USUÁRIO COMUM) ---
    msg.innerHTML = "Validando...";
    Papa.parse("database.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const trabalhoEncontrado = results.data.find(t => String(t.Número).trim() === codUser);
            
            if (trabalhoEncontrado) {
                let emailsNoBanco = trabalhoEncontrado.Emails ? trabalhoEncontrado.Emails.toLowerCase() : "";
                if (emailsNoBanco.includes(emailUser)) {
                    localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalhoEncontrado));
                    window.location.href = "dashboard.html";
                } else {
                    msg.innerHTML = "<span style='color:red;'>E-mail não autorizado.</span>";
                }
            } else {
                msg.innerHTML = "<span style='color:red;'>Código não encontrado.</span>";
            }
        }
    });
};
