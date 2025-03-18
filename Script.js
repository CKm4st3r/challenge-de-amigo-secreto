// Arrays para almacenar participantes, amigos asignados y quienes han realizado el sorteo
let participantes = [];
let amigosAsignados = [];
let sorteadores = [];
const LIMITE_PARTICIPANTES = 20; // Límite máximo de participantes

// Función para agregar un participante
function agregarParticipante() {
    const entradaNombre = document.getElementById('entrada-nombre');
    const botonAgregar = document.getElementById('boton-agregar');

    // Verificar si la entrada está deshabilitada (juego en progreso)
    if (entradaNombre.disabled) {
        mostrarMensaje('No puedes agregar más participantes. Reinicia el juego para añadir nuevos.', true);
        return;
    }

    // Obtener y sanitizar el nombre
    const nombre = entradaNombre.value.trim().toUpperCase();

    // Validar que el nombre no esté vacío
    if (nombre === "") {
        mostrarMensaje('Por favor, ingresa un nombre válido.', true);
        return;
    }

    // Validar que el nombre contenga solo letras y caracteres especiales (tildes)
    if (!/^[a-zA-ZÁÉÍÓÚáéíóú\s]+$/.test(nombre)) {
        mostrarMensaje('Por favor, ingresa solo caracteres tipo letra.', true);
        return;
    }

    // Validar que el nombre no esté duplicado
    if (participantes.includes(nombre)) {
        mostrarMensaje('Este participante ya está en la lista.', true);
        return;
    }

    // Validar que no se exceda el límite de participantes
    if (participantes.length >= LIMITE_PARTICIPANTES) {
        mostrarMensaje(`Has alcanzado el límite de ${LIMITE_PARTICIPANTES} participantes.`, true);
        botonAgregar.disabled = true; // Deshabilitar el botón de agregar
        return;
    }

    // Agregar el nombre a la lista de participantes
    participantes.push(nombre);
    actualizarListaParticipantes();
    entradaNombre.value = '';
    mostrarMensaje('Participante añadido.', true);
}

// Función para actualizar la lista de participantes en la interfaz
function actualizarListaParticipantes() {
    const lista = document.getElementById('lista-participantes');
    lista.innerHTML = '';

    // Recorrer la lista de participantes y crear elementos <li>
    participantes.forEach(participante => {
        const elementoLista = document.createElement('li');
        elementoLista.textContent = participante; // Usar textContent para evitar problemas de seguridad
        lista.appendChild(elementoLista);
    });

    // Actualizar el contador de participantes
    document.getElementById('contador-participantes').textContent = `Participantes: ${participantes.length}`;
}

// Función para mostrar la sección de sorteo
function mostrarSeccionSorteo() {
    // Validar que haya al menos 2 participantes
    if (participantes.length < 2) {
        mostrarMensaje('Necesitas al menos 2 participantes para iniciar el sorteo.', true);
        return;
    }

    // Deshabilitar la entrada y el botón de agregar participantes
    document.getElementById('entrada-nombre').disabled = true;
    document.getElementById('boton-agregar').disabled = true;

    // Mostrar la sección de sorteo
    const seccionSorteo = document.getElementById('seccion-sorteo');
    seccionSorteo.style.display = 'block';
}

// Función para realizar el sorteo de un amigo secreto
function sortearAmigoSecreto() {
    const nombreSorteador = document.getElementById('nombre-sorteador').value.trim().toUpperCase();

    // Validar que el nombre del sorteador esté en la lista de participantes
    if (!participantes.includes(nombreSorteador)) {
        mostrarMensaje('El nombre no pertenece a la lista de participantes.', true);
        return;
    }

    // Validar que el sorteador no haya realizado ya su sorteo
    if (sorteadores.includes(nombreSorteador)) {
        mostrarMensaje('Ya realizaste tu sorteo.', true);
        return;
    }

    // Caso especial: solo queda un participante por asignar
    if (participantes.length - amigosAsignados.length === 1) {
        const amigoRestante = participantes.find(
            nombre => !amigosAsignados.includes(nombre) && nombre !== nombreSorteador
        );
        if (amigoRestante) {
            mostrarMensaje(`${nombreSorteador}, tu amigo secreto es: ${amigoRestante}`, true);

            amigosAsignados.push(amigoRestante);
            sorteadores.push(nombreSorteador);

            // Limpiar el campo del sorteador
            document.getElementById('nombre-sorteador').value = '';

            // Finalizar el juego después de 8 segundos
            setTimeout(() => {
                mostrarMensaje('Todos los participantes han sido asignados. El juego ha finalizado.', true);
                document.getElementById('seccion-sorteo').style.display = 'none';
            }, 8000);
            return;
        }
    }

    // Filtrar los amigos disponibles para el sorteo
    const amigosDisponibles = participantes.filter(
        nombre => nombre !== nombreSorteador && !amigosAsignados.includes(nombre)
    );

    // Validar que haya amigos disponibles
    if (amigosDisponibles.length === 0) {
        mostrarMensaje('No hay suficientes participantes disponibles para sortear.', true);
        return;
    }

    // Seleccionar un amigo secreto al azar
    const indiceAleatorio = Math.floor(Math.random() * amigosDisponibles.length);
    const amigoSecreto = amigosDisponibles[indiceAleatorio];

    mostrarMensaje(`${nombreSorteador}, tu amigo secreto es: ${amigoSecreto}`, true);

    // Registrar el amigo asignado y el sorteador
    amigosAsignados.push(amigoSecreto);
    sorteadores.push(nombreSorteador);

    // Limpiar el campo del sorteador
    document.getElementById('nombre-sorteador').value = '';

    // Verificar si el juego ha terminado
    verificarFinJuego();
}

// Función para verificar si el juego ha terminado
function verificarFinJuego() {
    if (amigosAsignados.length === participantes.length) {
        setTimeout(() => {
            mostrarMensaje('Todos los participantes han sido asignados. El juego ha finalizado.', true);
            document.getElementById('seccion-sorteo').style.display = 'none';
        }, 5000);
    }
}

// Función para reiniciar el juego
function reiniciarJuego() {
    participantes = [];
    amigosAsignados = [];
    sorteadores = [];
    actualizarListaParticipantes();
    mostrarMensaje('El juego ha sido reiniciado.', true);

    // Habilitar la entrada y el botón de agregar participantes
    document.getElementById('entrada-nombre').disabled = false;
    document.getElementById('boton-agregar').disabled = false;

    // Ocultar la sección de sorteo
    document.getElementById('seccion-sorteo').style.display = 'none';

    // Limpiar el campo del sorteador
    document.getElementById('nombre-sorteador').value = '';
}

// Función para mostrar mensajes en la interfaz
function mostrarMensaje(mensaje, animar = false) {
    const elementoMensaje = document.getElementById('mensaje');
    elementoMensaje.textContent = mensaje; // Usar textContent para evitar problemas de seguridad
    if (animar) {
        elementoMensaje.classList.add('animacion-revelar');
        setTimeout(() => elementoMensaje.classList.remove('animacion-revelar'), 1000);
    }
    // Borrar el mensaje después de 3 segundos
    setTimeout(() => {
        elementoMensaje.textContent = '';
    }, 3000);
}