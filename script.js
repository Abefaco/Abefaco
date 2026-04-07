window.onload = function() {
    var btn = document.getElementById('btnAcessar');
    
    if (btn) {
        btn.onclick = function() {
            var emailUser = document.getElementById('email').value.trim().toLowerCase();
            var codUser = document.getElementById('codigo').value.trim();
            var msg = document.getElementById('mensagem');

            if (!emailUser || !codUser) {
                msg.innerHTML = "<span style='color:orange;'>Preencha os campos.</span>";
                return;
            }

            msg.innerHTML = "<span style='color:blue;'>Validando acesso...</span>";

            Papa.parse("database.csv", {
                download: true,
                header: true,
                skipEmptyLines: true,
                dynamicTyping: true, // Ajuda a ler números corretamente
                complete: function(res) {
                    var lista = res.data;
                    var encontrado = null;

                    for (var i = 0; i < lista.length; i++) {
                        // Compara o código ignorando espaços
                        if (String(lista[i].Número).trim() === codUser) {
                            encontrado = lista[i];
                            break;
                        }
                    }

                    if (encontrado) {
                        var emailsBanco = encontrado.Emails ? encontrado.Emails.toLowerCase() : "";
                        if (emailsBanco.indexOf(emailUser) !== -1) {
                            localStorage.setItem('trabalhoAtivo', JSON.stringify(encontrado));
                            window.location.href = "dashboard.html";
                        } else {
                            msg.innerHTML = "<span style='color:red;'>E-mail não autorizado para este trabalho.</span>";
                        }
                    } else {
                        msg.innerHTML = "<span style='color:red;'>Código não encontrado.</span>";
                    }
                },
                error: function() {
                    msg.innerHTML = "<span style='color:red;'>Erro ao carregar o arquivo database.csv.</span>";
                }
            });
        };
    }
};
