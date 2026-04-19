// Esta linha garante que o script espere o HTML carregar antes de começar
document.addEventListener('DOMContentLoaded', function() {
    
    const msg = document.getElementById('mensagem');
    const btnAcessar = document.getElementById('btnAcessar');
    const btnApresentar = document.getElementById('btnApresentar');

    // --- 1. LÓGICA DE LOGIN TRADICIONAL (E-MAIL + ID) ---
    if (btnAcessar) {
        btnAcessar.onclick = function() {
            const emailUser = document.getElementById('email').value.trim().toLowerCase();
            const codUser = document.getElementById('codigo').value.trim();

            if (!emailUser || !codUser) {
                msg.innerHTML = "<span style='color:orange;'>Preencha os campos de login.</span>";
                return;
            }

            // PRIORIDADE ADMIN
            if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
                localStorage.setItem('trabalhoAtivo', JSON.stringify({
                    Número: "ADMIN",
                    Título: "PAINEL DE GESTÃO ABEFACO",
                    Autores: "Administrador"
                }));
                window.location.href = "dashboard.html";
                return;
            }

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
    }

    // --- 2. LÓGICA DO MODO APRESENTAÇÃO (APENAS CÓDIGO) ---
    if (btnApresentar) {
        btnApresentar.onclick = function() {
            const codUser = document.getElementById('codigoApresentacao').value.trim();

            if (!codUser) {
                msg.innerHTML = "<span style='color:orange;'>Digite o código para apresentar.</span>";
                return;
            }

            msg.innerHTML = "Buscando trabalho...";

            Papa.parse("database.csv", {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: function(results) {
                    const trabalhoEncontrado = results.data.find(t => 
                        String(t.Número).trim() === codUser
                    );

                    if (trabalhoEncontrado) {
                        // Inserimos a marcação de modo apresentação
                        trabalhoEncontrado.modoApresentacao = true;
                        localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalhoEncontrado));
                        window.location.href = "dashboard.html";
                    } else {
                        msg.innerHTML = "<span style='color:red;'>Código de apresentação não encontrado.</span>";
                    }
                },
                error: function() {
                    msg.innerHTML = "<span style='color:red;'>Erro ao carregar banco de dados.</span>";
                }
            });
        };
    }

    // --- 3. SUPORTE AO TECLADO (ENTER) ---
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            // Se o usuário estiver no campo de apresentação, clica no botão de apresentação
            if (document.activeElement.id === 'codigoApresentacao') {
                btnApresentar.click();
            } else {
                // Caso contrário, tenta o login normal
                if (btnAcessar) btnAcessar.click();
            }
        }
    });

});
