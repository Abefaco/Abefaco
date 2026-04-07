window.onload = function() {
    const btn = document.getElementById('btnAcessar');
    
    if (btn) {
        btn.onclick = function() {
            const emailUser = document.getElementById('email').value.trim().toLowerCase();
            const codUser = document.getElementById('codigo').value.trim();
            const msg = document.getElementById('mensagem');

            // Validação básica de campos vazios
            if (!emailUser || !codUser) {
                msg.innerHTML = "<span style='color:orange;'>Por favor, preencha todos os campos.</span>";
                return;
            }

            msg.innerHTML = "<span style='color:blue;'>A validar acesso...</span>";

            // 1. LÓGICA DE ADMINISTRADOR (EXCEÇÃO DE FLUXO)
            // Este bloco ignora o CSV e dá acesso direto ao painel de gestão
            if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
                const dadosAdmin = {
                    Número: "ADMIN",
                    Título: "PAINEL DE CONTROLE ADMINISTRATIVO",
                    Autores: "Gestão ABEFACO"
                };
                localStorage.setItem('trabalhoAtivo', JSON.stringify(dadosAdmin));
                window.location.href = "dashboard.html";
                return;
            }

            // 2. LÓGICA DE AUTOR COMUM (PROCESSAMENTO DO DATABASE.CSV)
            Papa.parse("database.csv", {
                download: true,
                header: true,
                skipEmptyLines: true,
                dynamicTyping: false, // Mantemos como string para não perder zeros à esquerda em IDs
                complete: function(results) {
                    const listaTrabalhos = results.data;
                    let trabalhoEncontrado = null;

                    // Procura o trabalho pelo Número (ID)
                    for (let i = 0; i < listaTrabalhos.length; i++) {
                        let idBanco = String(listaTrabalhos[i].Número).trim();
                        if (idBanco === codUser) {
                            trabalhoEncontrado = listaTrabalhos[i];
                            break;
                        }
                    }

                    if (trabalhoEncontrado) {
                        // Verifica se o e-mail digitado consta na coluna de e-mails do trabalho
                        // Usamos .includes para suportar casos com múltiplos e-mails na mesma célula
                        let emailsNoBanco = trabalhoEncontrado.Emails ? trabalhoEncontrado.Emails.toLowerCase() : "";
                        
                        if (emailsNoBanco.includes(emailUser)) {
                            // Salva os dados no navegador para usar no Dashboard
                            localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalhoEncontrado));
                            window.location.href = "dashboard.html";
                        } else {
                            msg.innerHTML = "<span style='color:red;'>E-mail não autorizado para este código de trabalho.</span>";
                        }
                    } else {
                        msg.innerHTML = "<span style='color:red;'>Código de trabalho não encontrado na base de dados.</span>";
                    }
                },
                error: function(err) {
                    console.error("Erro ao processar CSV:", err);
                    msg.innerHTML = "<span style='color:red;'>Erro ao carregar a base de dados. Verifique o ficheiro database.csv.</span>";
                }
            });
        };
    }
};
