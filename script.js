let bancoDeDadosLocal = {}; 

const area = document.getElementById('area-conteudo');
const txtTitulo = document.getElementById('txt-titulo');
const txtSubtitulo = document.getElementById('txt-subtitulo');

function iniciarApresentacaoAdmin(id) {
    const trabalho = bancoDeDadosLocal[id];
    if (trabalho) {
        const dadosParaSalvar = { ...trabalho, modoApresentacao: true };
        localStorage.setItem('trabalhoAtivo', JSON.stringify(dadosParaSalvar));
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
            // AQUI ESTÁ O SEGREDO: O onclick agora só tem o ID numérico. Zero chances de vazar texto.
            campoAcoes.innerHTML = `
                <button onclick="iniciarApresentacaoAdmin('${id}')" 
                        style="background:#28a745; color:white; border:none; padding:8px 15px; border-radius:4px; cursor:pointer; font-weight:bold; display:flex; align-items:center; gap:5px;">
                    Play
                </button>`;
        } else {
            campoStatus.innerHTML = '<span style="color:#e67e22; font-weight:bold;">Pendente</span>';
            campoAcoes.innerHTML = `
                <a href="https://github.com/Abefaco/Abefaco/upload/main/posters" target="_blank" 
                   style="text-decoration:none; background:#34495e; color:white; padding:6px 12px; border-radius:4px; font-size:12px; display:inline-block;">
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
            bancoDeDadosLocal = {}; // Reinicia o cache
            
            let html = `
                <div style="margin-bottom:20px;">
                    <input type="text" id="inputBusca" onkeyup="filtrarTabela()" placeholder="Pesquisar por ID, Nome ou Título..." style="width:100%; padding:12px; border-radius:8px; border:1px solid #ddd;">
                </div>
                <table style="width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden;">
                    <thead>
                        <tr style="background:#f8f9fa; border-bottom:2px solid #eee;">
                            <th style="padding:15px; text-align:left;">ID</th>
                            <th style="padding:15px; text-align:left;">Título e Autores</th>
                            <th style="padding:15px; text-align:left;">Status</th>
                            <th style="padding:15px; text-align:left;">Ação</th>
                        </tr>
                    </thead>
                    <tbody id="corpoTabela">`;

            results.data.forEach(row => {
                const id = String(row.Número).trim();
                if (!id || id === "undefined") return;

                bancoDeDadosLocal[id] = row;

                html += `
                    <tr style="border-bottom:1px solid #eee;">
                        <td style="padding:15px;"><b>${id}</b></td>
                        <td style="padding:15px;">
                            <div style="font-weight:bold; color:#2c3e50;">${row.Título}</div>
                            <small style="color:#7f8c8d;">${row.Autores}</small>
                        </td>
                        <td id="st-${id}" style="padding:15px;">...</td>
                        <td id="acoes-${id}" style="padding:15px;"></td>
                    </tr>`;
                
                verificarArquivo(id);
            });

            html += "</tbody></table>";
            if (area) area.innerHTML = html;
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const msg = document.getElementById('mensagem');
    const btnAcessar = document.getElementById('btnAcessar');

    const userAtivo = JSON.parse(localStorage.getItem('trabalhoAtivo'));
    if (userAtivo && userAtivo.Número === "ADMIN") {
        renderizarAdmin();
    }

    if (btnAcessar) {
        btnAcessar.onclick = function() {
            const emailUser = document.getElementById('email').value.trim().toLowerCase();
            const codUser = document.getElementById('codigo').value.trim();

            if (emailUser === "abefaco@gmail.com" && codUser === "092026") {
                localStorage.setItem('trabalhoAtivo', JSON.stringify({Número: "ADMIN"}));
                window.location.href = "dashboard.html";
            } else {
            }
        };
    }
});

function filtrarTabela() {
    const input = document.getElementById("inputBusca");
    const filter = input.value.toUpperCase();
    const table = document.getElementById("corpoTabela");
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        const td = tr[i].getElementsByTagName("td")[1];
        if (td) {
            const txtValue = td.textContent || td.innerText;
            tr[i].style.display = txtValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
        }
    }
}
