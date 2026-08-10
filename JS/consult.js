const URL_SHEETS = "https://script.google.com/macros/s/AKfycbwMfcFTgzZLcuZJLi6TMg8hUPdTEbYivfWWbjSBjEBIuJKWwvUCCKsIhjkr-6zKWSph/exec";

document.getElementById("btn-consultar").addEventListener("click", function() {
    var dni = document.getElementById("dni").value.trim();
    var localidad = document.getElementById("localidad").value;

    if (!dni || !localidad) {
        alert("Por favor completá ambos campos.");
        return;
    }

    if (!/^\d{8}$/.test(dni)) {
        alert("El DNI debe contener exactamente 8 números.");
        return;
    }

    var container = document.getElementById("resultado-contenido");
    var resultadosDiv = document.getElementById("resultados");
    container.innerHTML = `<p class="loading-text">Buscando turnos...</p>`;
    resultadosDiv.style.display = "block";

    fetch(`${URL_SHEETS}?localidad=${localidad}`)
        .then(response => response.json())
        .then(data => {
            var turnosFiltrados = data.turnos.filter(t => t.dni == dni);

            if (turnosFiltrados.length === 0) {
                container.innerHTML = `<p class="sin-resultados">No se encontraron turnos para ese DNI en ${localidad}.</p>`;
            } else {
                var html = "";
                turnosFiltrados.forEach(turno => {
                    html += `
                        <div class="turno-resultado">
                            <p><strong>Turno #${turno.id}</strong></p>
                            <p>Nombre: ${turno.nombre}</p>
                            <p>Dirección: ${turno.direccion}</p>
                            <p>Teléfono: ${turno.telefono}</p>
                            <p>Fecha: ${turno.fechaYhora}</p>
                            <p>Estado: <span class="estado-${turno.estado.replace(/\s/g, '-')}">${turno.estado}</span></p>
                        </div>
                    `;
                });
                container.innerHTML = html;
            }
        })
        .catch(error => {
            console.error("Error al consultar turnos:", error);
            container.innerHTML = `<p class="sin-resultados">Error al consultar. Intentá de nuevo.</p>`;
        });
});
