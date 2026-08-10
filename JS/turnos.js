const turno = {
    nombre: null,
    dni: null,
    direccion: null,
    localidad: null,
    telefono: null,
}

const URL_SHEETS = "https://script.google.com/macros/s/AKfycbwMfcFTgzZLcuZJLi6TMg8hUPdTEbYivfWWbjSBjEBIuJKWwvUCCKsIhjkr-6zKWSph/exec";

function guardarTurno() {
    turno.nombre = document.getElementById("nombre").value;
    turno.dni = document.getElementById("dni").value;
    turno.direccion = document.getElementById("direccion").value;
    turno.localidad = document.getElementById("localidad").value;
    turno.telefono = document.getElementById("telefono").value;
}

function enviarTurno(turno) {
    const now = new Date();
    const fechaYhora = now.toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" });

    return fetch(URL_SHEETS, {
        method: "POST",
        body: JSON.stringify({
            nombre: turno.nombre,
            dni: turno.dni,
            direccion: turno.direccion,
            localidad: turno.localidad,
            telefono: turno.telefono,
            fechaYhora: fechaYhora
        })
    });
}

document.getElementById("enviar").addEventListener("click", function(event) {
    event.preventDefault();
    guardarTurno();
    enviarTurno(turno)
        .then(() => {
            document.getElementById("modal-exito").style.display = "flex";
        })
        .catch(error => {
            console.error("Error al enviar turno:", error);
            alert("Hubo un error al enviar el turno. Intentá de nuevo.");
        });
});