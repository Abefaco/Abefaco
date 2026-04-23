let bancoDeDadosLocal = {}; 

const area = document.getElementById('area-conteudo');
const txtTitulo = document.getElementById('txt-titulo');
const txtSubtitulo = document.getElementById('txt-subtitulo');

function iniciarApresentacaoAdmin(id) {
    const trabalho = bancoDeDadosLocal[id];
    if (trabalho) {
        const payload = { ...trabalho, modoApresentacao: true };
        localStorage.setItem('trabalhoAtivo', JSON.stringify(payload));
        window.location.reload(); 
    }
}

function verificarArquivo(id) {
    fetch(`posters/${id}.pdf`, { method: 'HEAD' })
    .then(res => {
        const campoStatus = document.getElementById('st-' + id);
        const campoAcoes = document.getElementById('acoes-' + id);
        if (!campoStatus || !campoAcoes) return;

        if (res.ok) {
            campoStatus.innerHTML = '<span style="color:#27ae60; font-weight:bold;">No Ar</span>';
            campoAcoes.innerHTML = `
                <button onclick="iniciarApresentacaoAdmin('${id}')" 
                        style="background:#28a745; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:bold;">
                    Play
                </button>`;
        } else {
            campoStatus.innerHTML = '<span style="color:#e67e22;">Pendente</span>';
            campoAcoes.innerHTML = `
                <a href="https://github.com/Abefaco/Abefaco/upload/main/posters" target="_blank" 
                   style="text-decoration:none; background:#34495e; color:white; padding:6px 12px; border-radius:4px; font-size:12px;">
                   Subir
                </a>`;
        }
    });
}

function renderizarAdmin() {
    if (txtTitulo) txtTitulo.innerText = "Gestão de e-Posters ABEFACO";
    
    Papa.parse("database.csv", {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            bancoDeDadosLocal = {}; 
            
            let htmlBase = `
                <div style="margin-bottom:20px;">
                    <input type="text" id="inputBusca" onkeyup="filtrarTabela()" placeholder="Pesquisar..." style="width:100%; padding:12px; border-radius:8px; border:1px solid #ddd;">
                </div>
                <table style="width:100%; border-collapse:collapse; background:white;">
                    <thead>
                        <tr style="background:#f8f9fa; border-bottom:2px solid #eee;">
                            <th style="padding:15px; text-align:left;">ID</th>
                            <th style="padding:15px; text-align:left;">Trabalho</th>
                            <th style="padding:15px; text-align:left;">Status</th>
                            <th style="padding:15px; text-align:left;">Ação</th>
                        </tr>
                    </thead>
                    <tbody id="corpoTabela"></tbody>
                </table>`;

            area.innerHTML = htmlBase;
            const tbody = document.getElementById('corpoTabela');

            results.data.forEach(row => {
                const id = String(row.Número).trim();
                if (!id || id === "" || id === "undefined") return;

                bancoDeDadosLocal[id] = row;

                const tr = document.createElement('tr');
                tr.style.borderBottom = "1px solid #eee";
                
                tr.innerHTML = `
                    <td style="padding:15px;"><b>${id}</b></td>
                    <td style="padding:15px;">
                        <div id="tit-${id}" style="font-weight:bold; color:#2c3e50;"></div>
                        <small id="aut-${id}" style="color:#7f8c8d;"></small>
                    </td>
                    <td id="st-${id}" style="padding:15px; font-size:13px;">Verificando...</td>
                    <td id="acoes-${id}" style="padding:15px;"></td>
                `;
                
                tbody.appendChild(tr);

                document.getElementById(`tit-${id}`).textContent = row.Título;
                document.getElementById(`aut-${id}`).textContent = row.Autores;

                verificarArquivo(id);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const btnAcessar = document.getElementById('btnAcessar');
    const msg = document.getElementById('mensagem');
    
    const user = JSON.parse(localStorage.getItem('trabalhoAtivo'));
    if (user && user.Número === "ADMIN") {
        renderizarAdmin();
    }

    if (btnAcessar) {
        btnAcessar.onclick = function() {
            const email = document.getElementById('email').value.trim().toLowerCase();
            const codigo = document.getElementById('codigo').value.trim();

            if (email === "abefaco@gmail.com" && codigo === "092026") {
                localStorage.setItem('trabalhoAtivo', JSON.stringify({Número: "ADMIN"}));
                window.location.href = "dashboard.html";
            } else {
                msg.innerHTML = "Validando...";
                Papa.parse("database.csv", {
                    download: true, header: true, skipEmptyLines: true,
                    complete: function(results) {
                        const trabalho = results.data.find(t => String(t.Número).trim() === codigo);
                        if (trabalho) {
                            let emailsNoBanco = trabalho.Emails ? trabalho.Emails.toLowerCase() : "";
                            if (emailsNoBanco.includes(email)) {
                                localStorage.setItem('trabalhoAtivo', JSON.stringify(trabalho));
                                window.location.href = "dashboard.html";
                            } else {
                                msg.innerHTML = "E-mail não autorizado.";
                            }
                        } else {
                            msg.innerHTML = "Código não encontrado.";
                        }
                    }
                });
            }
        };
    }
});

function filtrarTabela() {
    const input = document.getElementById("inputBusca");
    const filter = input.value.toUpperCase();
    const rows = document.querySelectorAll("#corpoTabela tr");

    rows.forEach(row => {
        const text = row.innerText.toUpperCase();
        row.style.display = text.indexOf(filter) > -1 ? "" : "none";
    });
}
