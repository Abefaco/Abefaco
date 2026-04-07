// Esta linha garante que o script espere o HTML carregar antes de começar
document.addEventListener('DOMContentLoaded', function() {
    
    // Agora o navegador consegue encontrar o botão e a div de mensagem
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

            // 1. PRIORIDADE ADMIN: Verifica antes de qualquer outra lógica
            if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
                localStorage.setItem('trabalhoAtivo', JSON.stringify({
                    Número: "ADMIN",
                    Título: "PAINEL DE GESTÃO ABEFACO",
                    Autores: "Administrador"
                }));
                window.location.href = "dashboard.html";
                return; // Impede que o código continue para o CSV
            }

            // 2. BUSCA NO BANCO DE DADOS (USUÁRIO COMUM)
            msg.innerHTML = "Validando...";
            
            Papa.parse("database.csv", {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
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
                    msg.innerHTML = "<span style='color:red;'>Erro ao carregar banco de dados.</span>";
                }
            });
        };
    } else {
        // Se este erro aparecer no console, o ID do botão no seu HTML está errado
        console.error("Botão 'btnAcessar' não encontrado no HTML.");
    }
});
