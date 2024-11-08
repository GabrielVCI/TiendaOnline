﻿function MensajeDeExito(mensaje) {

    Swal.fire({
        title: "Listo",
        text: mensaje,
        icon: "success"
    });
}

async function manejarErrorApi(respuesta) {

    let mensajeError = '';

    if (respuesta.status === 400) {
        mensajeError = await respuesta.text();
    } else if (respuesta.status === 404) {
        mensajeError = "Este recurso no ha sido encontrado.";
    } else if (respuesta.status == 422) {
        mensajeError = "Ya existe un recurso con este nombre."
    } else {
        mensajeError = "Ha surgido un error inesperado.";
    }

    mostrarMensajeError(mensajeError);
}

function mostrarMensajeError(mensaje) {

    Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: mensaje
    });
}

function confirmarAction({ callbackAceptar, callbackCancelar, titulo, mensaje }) {

    Swal.fire({
        title: titulo || '¿Realmente deseas hacer esto?',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        confirmButtonText: 'Si',
        focusConfirm: true,
        text: mensaje
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            callbackAceptar();
        }
        else if (callbackCancelar) {
            callbackCancelar();
        }
    });
}