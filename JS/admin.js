const URL_SHEETS = "https://script.google.com/macros/s/AKfycbwMfcFTgzZLcuZJLi6TMg8hUPdTEbYivfWWbjSBjEBIuJKWwvUCCKsIhjkr-6zKWSph/exec";

let TARIFAS = {};
let turnoSeleccionado = null;
let localidadSeleccionada = null;

// Cargar tarifas al iniciar
fetch(`${URL_SHEETS}?action=tarifas`)
    .then(response => response.json())
    .then(data => {
        TARIFAS = data.tarifas;
    })
    .catch(error => console.error("Error al cargar tarifas:", error));

// Cargar turnos al seleccionar localidad
document.getElementById("localidad-select").addEventListener("change", function() {
    localidadSeleccionada = this.value;
    cargarTurnos();
});

function cargarTurnos() {
    const tbody = document.getElementById("turnos-body");
    tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--blanco-70);">Cargando turnos...</td></tr>`;
    document.getElementById("tabla-container").style.display = "block";

    fetch(`${URL_SHEETS}?localidad=${localidadSeleccionada}`)
        .then(response => response.json())
        .then(data => {
            tbody.innerHTML = "";

            const turnosNoCompletados = data.turnos.filter(t => t.estado !== "Completado");

            if (turnosNoCompletados.length === 0) {
                tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--blanco-70);">No hay turnos pendientes</td></tr>`;
            } else {
                turnosNoCompletados.forEach(turno => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${turno.nombre}</td>
                        <td>${turno.direccion}</td>
                        <td>${turno.telefono}</td>
                        <td>${turno.localidad}</td>
                        <td><button class="btn-completar" onclick='abrirModal(${JSON.stringify(turno)})'>Completar</button></td>
                    `;
                    tbody.appendChild(row);
                });
            }
        })
        .catch(error => {
            console.error("Error al cargar turnos:", error);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--blanco-70);">Error al cargar. Intentá de nuevo.</td></tr>`;
        });
}

function abrirModal(turno) {
    turnoSeleccionado = turno;
    document.getElementById("modal-info").textContent = `Turno #${turno.id} - ${turno.nombre}`;

    const tarifas = TARIFAS[localidadSeleccionada];
    if (tarifas) {
        document.getElementById("label-tarifa-aros").textContent = `Costo Aros: $${tarifas.aros.toLocaleString("es-AR")}`;
        document.getElementById("label-tarifa-tanques").textContent = `Costo Tanques: $${tarifas.tanques.toLocaleString("es-AR")}`;
    }

    document.getElementById("cantidad-aros").value = 0;
    document.getElementById("cantidad-tanques").value = 0;
    actualizarTotal();
    document.getElementById("modal-trabajo").style.display = "flex";
}

function actualizarTotal() {
    const cantAros = parseInt(document.getElementById("cantidad-aros").value) || 0;
    const cantTanques = parseInt(document.getElementById("cantidad-tanques").value) || 0;
    const tarifas = TARIFAS[localidadSeleccionada];
    const total = (cantAros * tarifas.aros) + (cantTanques * tarifas.tanques);
    document.getElementById("total-cost").textContent = `Total: $${total.toLocaleString("es-AR")}`;
}

document.getElementById("cantidad-aros").addEventListener("input", actualizarTotal);
document.getElementById("cantidad-tanques").addEventListener("input", actualizarTotal);

document.getElementById("confirmar-trabajo").addEventListener("click", function() {
    const cantAros = parseInt(document.getElementById("cantidad-aros").value) || 0;
    const cantTanques = parseInt(document.getElementById("cantidad-tanques").value) || 0;

    if (cantAros === 0 && cantTanques === 0) {
        alert("Debe ingresar al menos una cantidad.");
        return;
    }

    const tarifas = TARIFAS[localidadSeleccionada];
    const total = (cantAros * tarifas.aros) + (cantTanques * tarifas.tanques);

    const trabajo = {
        id: turnoSeleccionado.id,
        localidad: localidadSeleccionada,
        estado: "Completado",
        aros: cantAros,
        tanques: cantTanques,
        total: total
    };

    fetch(URL_SHEETS, {
        method: "POST",
        body: JSON.stringify({ action: "completar", ...trabajo })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById("modal-trabajo").style.display = "none";
        document.getElementById("modal-exito").style.display = "flex";
    })
    .catch(error => {
        console.error("Error al completar turno:", error);
        alert("Error al completar el turno. Intentá de nuevo.");
    });
});
