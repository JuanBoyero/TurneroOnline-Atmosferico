const URL_SHEETS = "https://script.google.com/macros/s/AKfycbwMfcFTgzZLcuZJLi6TMg8hUPdTEbYivfWWbjSBjEBIuJKWwvUCCKsIhjkr-6zKWSph/exec";

document.getElementById("btn-consultar").addEventListener("click", function() {
    var dni = document.getElementById("dni").value.trim();
    var localidad = document.getElementById("localidad").value;

    if (!dni || !localidad) {
        alert("Por favor completá ambos campos.");
        return;
    }

    fetch(`${URL_SHEETS}?localidad=${localidad}`)
        .then(response => response.json())
        .then(data => {
            var turnosFiltrados = data.turnos.filter(t => t.dni == dni);

            var container = document.getElementById("resultado-contenido");
            var resultadosDiv = document.getElementById("resultados");

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

            resultadosDiv.style.display = "block";
        })
        .catch(error => {
            console.error("Error al consultar turnos:", error);
            alert("Error al consultar. Intentá de nuevo.");
        });
});
