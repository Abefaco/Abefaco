// --- VARIÁVEIS GLOBAIS ---
// Cache para evitar que aspas no CSV quebrem o HTML dos botões no painel admin
let bancoDeDadosLocal = {}; 

const area = document.getElementById('area-conteudo');
const txtTitulo = document.getElementById('txt-titulo');
const txtSubtitulo = document.getElementById('txt-subtitulo');

// --- FUNÇÕES DE APOIO (Acessíveis globalmente) ---

/**
 * Inicia a apresentação recuperando os dados limpos do cache pelo ID
 */
function iniciarApresentacaoAdmin(id) {
    const trabalho = bancoDeDadosLocal[id];
    if (trabalho) {
        // Clonamos o objeto e adicionamos a flag de apresentação
        const dadosParaSalvar = { ...trabalho, modoApresentacao: true };
        localStorage.setItem('trabalhoAtivo', JSON.stringify(dadosParaSalvar));
        
        // Redireciona ou recarrega para abrir o visualizador de PDF
        window.location.reload(); 
    } else {
        alert("Erro ao recuperar dados do trabalho " + id);
    }
}

/**
 * Filtra a tabela de gestão em tempo real
 */
function filtrarTabela() {
    const input = document.getElementById("inputBusca");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("corpoTabela");
    if (!table) return;
    
    const tr = table.getElementsByTagName("tr");
    for (let i = 0; i < tr.length; i++) {
        const tdDescricao = tr[i].getElementsByTagName("td")[1]; // Título/Autores
        const tdId = tr[i].getElementsByTagName("td")[0];        // ID
        if (tdDescricao || tdId) {
            const txtValue = (tdDescricao.textContent || tdDescricao.innerText) + 
                             (tdId.textContent || tdId.innerText);
            tr[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}

/**
 * Verifica se o PDF existe e renderiza o botão Play de forma segura
 */
function verificarArquivo(id) {
    fetch(`posters/${id}.pdf`, { method: 'HEAD' })
    .then(res => {
        const campoStatus = document.getElementById('st-' + id);
        const campoAcoes = document.getElementById('acoes-' + id);
        if (!campoStatus || !campoAcoes) return;

        if (res.ok) {
            campoStatus.innerHTML = '<span style="color:#27ae60; font-weight:bold;">✅ No Ar</span>';
            // SEGURANÇA: O onclick agora só recebe o ID (número), sem textos do CSV
            campoAcoes.innerHTML = `
                <button onclick="iniciarApresentacaoAdmin('${id}')" 
                        style="background:#28a745; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:bold;">
                    ▶️ Play
                </button>`;
        } else {
            campoStatus.innerHTML = '<span style="color:#e67e22;">❌ Pendente</span>';
            campoAcoes.innerHTML = `
                <a href="https://github.com/Abefaco/Abefaco/upload/main/posters" target="_blank" 
                   style="text-decoration:none; background:#34495e; color:white; padding:6px 12px; border-radius:4px; font-size:12px;">
                   ⬆️ Subir
                </a>`;
        }
    })
    .catch(() => {
        const campoStatus = document.getElementById('st-' + id);
        if (campoStatus) campoStatus.innerHTML = "Erro";
    });
}

/**
 * Renderiza a interface administrativa
 */
function renderizarAdmin() {
    if (txtTitulo) txtTitulo.innerText = "Gestão de e-Posters ABEFACO";
    if (txtSubtitulo) txtSubtitulo.innerText = "Monitore submissões e realize apresentações.";

    Papa.parse("database.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            bancoDeDadosLocal = {}; // Limpa o cache antes de preencher
            
            let html = `
                <div style="margin-bottom:20px;">
                    <input type="text" id="inputBusca" onkeyup="filtrarTabela()" 
                           placeholder="🔍 Pesquisar por ID, Nome ou Título..." 
                           style="width:100%; padding:12px; border-radius:8px; border:1px solid #ddd; font-size:16px;">
                </div>
                <div style="overflow-x:auto; background:white; border-radius:8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                <table style="width:100%; border-collapse:collapse;">
                    <thead>
                        <tr style="background:#f8f9fa; border-bottom:2px solid #eee;">
                            <th style="padding:15px; text-align:left;">ID</th>
                            <th style="padding:15px; text-align:left;">Título e Autores</th>
                            <th style="padding:15px; text-align:left;">Status PDF</th>
                            <th style="padding:15px; text-align:left;">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="corpoTabela">`;

            results.data.forEach(row => {
                const id = String(row.Número).trim();
                if (!id || id === "undefined" || id === "") return;

                // Salva a linha no cache usando o ID como chave única
                bancoDeDadosLocal[id] = row;

                html += `
                    <tr style="border-bottom:1px solid #f1f1f1;">
                        <td style="padding:15px;"><b>${id}</b></td>
                        <td style="padding:15px;">
                            <div style="font-weight:bold; color:#2c3e50; margin-bottom:4px;">${row.Título}</div>
                            <small style="color:#7f8c8d;">${row.Autores}</small>
                        </td>
                        <td id="st-${id}" style="padding:15px; font-size:13px;">⌛ Verificando...</td>
                        <td id="acoes-${id}" style="padding:15px;"></td>
                    </tr>`;
                
                verificarArquivo(id);
            });

            html += "</tbody></table></div>";
            if (area) area.innerHTML = html;
        }
    });
}

// --- INICIALIZAÇÃO DO DOM ---

document.addEventListener('DOMContentLoaded', function() {
    const msg = document.getElementById('mensagem');
    const btnAcessar = document.getElementById('btnAcessar');
    const btnApresentar = document.getElementById('btnApresentar');

    // Verifica se já estamos logados como admin para mostrar a tabela
    const userAtivo = JSON.parse(localStorage.getItem('trabalhoAtivo'));
    if (userAtivo && userAtivo.Número === "ADMIN") {
        renderizarAdmin();
    }

    // --- LÓGICA DE LOGIN (E-MAIL + ID) ---
    if (btnAcessar) {
        btnAcessar.onclick = function() {
            const emailUser = document.getElementById('email').value.trim().toLowerCase();
            const codUser = document.getElementById('codigo').value.trim();

            if (!emailUser || !codUser) {
                msg.innerHTML = "<span style='color:orange;'>Preencha e-mail e código.</span>";
                return;
            }

            // LOGIN ADMINISTRADOR
            if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
                localStorage.setItem('trabalhoAtivo', JSON.stringify({
                    Número: "ADMIN", Título: "PAINEL DE GESTÃO ABEFACO", Autores: "Administrador"
                }));
                window.location.href = "dashboard.html";
                return;
            }

            // LOGIN USUÁRIO COMUM
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
                            msg.innerHTML = "<span style='color:red;'>E-mail não autorizado para este código.</span>";
                        }
                    } else {
                        msg.innerHTML = "<span style='color:red;'>Código não encontrado no sistema.</span>";
                    }
                }
            });
        };
    }

    // --- MODO APRESENTAÇÃO RÁPIDA ---
    if (btnApresentar) {
        btnApresentar.onclick = function() {
            const codUser = document.getElementById('codigoApresentacao').value.trim();

            if (!codUser) {
                msg.innerHTML = "<span style='color:orange;'>Digite o código para apresentar.</span>";
                return;
            }

            msg.innerHTML = "Localizando trabalho...";
            Papa.parse("database.csv", {
                download: true, header: true, skipEmptyLines: true,
                complete: function(results) {
                    const trabalho = results.data.find(t => String(t.Número).trim() === codUser);
                    if (trabalho) {
                        trabalho.modoApresentacao = true;
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
