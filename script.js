// Aguarda o DOM (HTML) carregar completamente antes de rodar o script
document.addEventListener('DOMContentLoaded', function() {
    
    // Captura o botão pelo ID que está no seu index.html
    const btn = document.getElementById('btnAcessar');
    const msg = document.getElementById('mensagem');

    if (btn) {
        btn.onclick = function() {
            const emailUser = document.getElementById('email').value.trim().toLowerCase();
            const codUser = document.getElementById('codigo').value.trim();

            if (!emailUser || !codUser) {
                msg.innerHTML = "<span style='color:orange;'>Preencha os campos.</span>";
                return;
            }

            // 1. REGRA DE OURO: ADMIN PRIMEIRO
            // Isso evita que o código 092026 seja buscado no CSV
            if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
                localStorage.setItem('trabalhoAtivo', JSON.stringify({
                    Número: "ADMIN",
                    Título: "PAINEL DE GESTÃO ABEFACO",
                    Autores: "Administrador"
                }));
                window.location.href = "dashboard.html";
                return;
            }

            // 2. BUSCA NO CSV (USUÁRIO COMUM)
            msg.innerHTML = "Validando...";
            
            Papa.parse("database.csv", {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    // Procura o trabalho pelo número
                    const trabalhoEncontrado = results.data.find(t => 
                        String(t.Número).trim() === codUser
                    );

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
                },
                error: function() {
                    msg.innerHTML = "<span style='color:red;'>Erro ao ler banco de dados.</span>";
                }
            });
        };
    } else {
        console.error("Erro: O botão com ID 'btnAcessar' não foi encontrado no HTML.");
    }
});
