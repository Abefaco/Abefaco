document.addEventListener('DOMContentLoaded', function() {
    
    const msg = document.getElementById('mensagem');
    const btnAcessar = document.getElementById('btnAcessar');
    const btnApresentar = document.getElementById('btnApresentar');

    // --- LOGIN TRADICIONAL (E-MAIL + ID) ---
    if (btnAcessar) {
        btnAcessar.onclick = function() {
            const emailUser = document.getElementById('email').value.trim().toLowerCase();
            const codUser = document.getElementById('codigo').value.trim();

            if (!emailUser || !codUser) {
                msg.innerHTML = "<span style='color:orange;'>Preencha e-mail e código.</span>";
                return;
            }

            // ADMIN
            if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
                localStorage.setItem('trabalhoAtivo', JSON.stringify({
                    Número: "ADMIN", Título: "PAINEL DE GESTÃO ABEFACO", Autores: "Administrador"
                }));
                window.location.href = "dashboard.html";
                return;
            }

            msg.innerHTML = "Validando...";
            Papa.parse("database.csv", {
                download: true, header: true, skipEmptyLines: true,
                complete: function(results) {
                    const trabalho = results.data.find(t => String(t.Número).trim() === codUser);
                    if (trabalho) {
                        let emailsNoBanco = trabalho.Emails ? trabalho.Emails.toLowerCase() : "";
                        if (emailsNoBanco.includes(emailUser)) {
                            localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalho));
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
    }

    // --- MODO APRESENTAÇÃO (APENAS ID) ---
    if (btnApresentar) {
        btnApresentar.onclick = function() {
            const codUser = document.getElementById('codigoApresentacao').value.trim();

            if (!codUser) {
                msg.innerHTML = "<span style='color:orange;'>Digite o código para apresentar.</span>";
                return;
            }

            msg.innerHTML = "Buscando...";
            Papa.parse("database.csv", {
                download: true, header: true, skipEmptyLines: true,
                complete: function(results) {
                    const trabalho = results.data.find(t => String(t.Número).trim() === codUser);
                    if (trabalho) {
                        trabalho.modoApresentacao = true; // SINAL PARA O DASHBOARD
                        localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalho));
                        window.location.href = "dashboard.html";
                    } else {
                        msg.innerHTML = "<span style='color:red;'>Código não encontrado.</span>";
                    }
                }
            });
        };
    }
});
