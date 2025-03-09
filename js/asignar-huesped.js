const urlParams = new URLSearchParams(window.location.search);
const habitacionId = urlParams.get('habitacion_id');

// Elementos del DOM
const estadoLimpiezaSelect = document.getElementById('estado-limpieza');
const estadoSabanasSelect = document.getElementById('estado-sabanas');
const guardarEstadoLimpiezaBtn = document.getElementById('guardar-estado-limpieza');
const guardarEstadoSabanasBtn = document.getElementById('guardar-estado-sabanas');


// Cargar información de la habitación
async function cargarHabitacion() {
    const { data: habitacion, error } = await supabaseClient
        .from('habitaciones')
        .select('numero, piso, camas, baño_privado, estado_limpieza, estado_sabanas')
        .eq('id', habitacionId)
        .single();

    if (error) {
        console.error('Error al cargar habitación:', error);
        return;
    }

    document.getElementById('habitacion-numero').textContent = habitacion.numero;
    document.getElementById('habitacion-piso').textContent = habitacion.piso;
    document.getElementById('habitacion-camas').textContent = habitacion.camas;
    document.getElementById('habitacion-bano').textContent = habitacion.baño_privado ? 'Sí' : 'No';

    // Cargar datos de la habitación en el formulario de edición
    document.getElementById('numero').value = habitacion.numero;
    document.getElementById('piso').value = habitacion.piso;
    document.getElementById('camas').value = habitacion.camas;
    document.getElementById('baño_privado').checked = habitacion.baño_privado;
    // Preseleccionar estado de limpieza y sábanas
    estadoLimpiezaSelect.value = habitacion.estado_limpieza;
    estadoSabanasSelect.value = habitacion.estado_sabanas;
}

// Guardar cambios en estado de limpieza
guardarEstadoLimpiezaBtn.addEventListener('click', async () => {
    const nuevoEstado = estadoLimpiezaSelect.value;

    const { error } = await supabaseClient
        .from('habitaciones')
        .update({ estado_limpieza: nuevoEstado })
        .eq('id', habitacionId);

    if (error) {
        console.error('Error al actualizar estado de limpieza:', error);
        return;
    }

    alert('Estado de limpieza actualizado correctamente.');
});


// Guardar cambios en estado de sábanas
guardarEstadoSabanasBtn.addEventListener('click', async () => {
    const nuevoEstado = estadoSabanasSelect.value;

    const { error } = await supabaseClient
        .from('habitaciones')
        .update({ estado_sabanas: nuevoEstado })
        .eq('id', habitacionId);

    if (error) {
        console.error('Error al actualizar estado de sábanas:', error);
        return;
    }

    alert('Estado de sábanas actualizado correctamente.');
});


// Cargar los huéspedes asignados a la habitación
async function cargarHuespedesAsignados() {
    const { data: reservas, error } = await supabaseClient
        .from('reservas')
        .select('huesped_id, fecha_inicio, fecha_fin')
        .eq('habitacion_id', habitacionId)
        .eq('estado', 'activa');

    if (error) {
        console.error('Error al cargar huéspedes asignados:', error);
        return;
    }

    const { data: huespedes, errorHuespedes } = await supabaseClient
        .from('huespedes')
        .select('id, nombre, apellido');

    if (errorHuespedes) {
        console.error('Error al cargar huéspedes:', errorHuespedes);
        return;
    }

    const huespedesAsignados = reservas.map(reserva => {
        const huesped = huespedes.find(h => h.id === reserva.huesped_id);
        return { id: huesped.id, nombre: `${huesped.nombre} ${huesped.apellido}` };
    });

    const huespedesList = document.getElementById('huespedes-list');
    huespedesList.innerHTML = '';

    if (huespedesAsignados.length === 0) {
        huespedesList.innerHTML = '<p>No hay huéspedes asignados a esta habitación.</p>';
    } else {
        reservas.forEach(reserva => {
            const huesped = huespedes.find(h => h.id === reserva.huesped_id);
            if (!huesped) return;

            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerHTML = `
                <strong>${huesped.nombre} ${huesped.apellido}</strong><br>
                <small><strong>Entrada:</strong> ${reserva.fecha_inicio}</small> - 
                <small><strong>Salida:</strong> ${reserva.fecha_fin}</small>
            `;

            // Botón para quitar huésped
            const removeButton = document.createElement('button');
            removeButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-3');
            removeButton.textContent = 'Quitar';
            removeButton.onclick = () => quitarHuesped(huesped.id);
            li.appendChild(removeButton);

            huespedesList.appendChild(li);
        });
    }
}

// Cargar los huéspedes disponibles para asignar
async function cargarHuespedesDisponibles() {
    // Obtener todos los huéspedes
    const { data: huespedes, error: errorHuespedes } = await supabaseClient
        .from('huespedes')
        .select('id, nombre, apellido');

    if (errorHuespedes) {
        console.error('Error al cargar huéspedes:', errorHuespedes);
        return;
    }

    // Obtener los huéspedes que ya tienen una reserva activa
    const { data: reservas, error: errorReservas } = await supabaseClient
        .from('reservas')
        .select('huesped_id')
        .eq('estado', 'activa');

    if (errorReservas) {
        console.error('Error al cargar reservas activas:', errorReservas);
        return;
    }

    // Crear una lista con los IDs de los huéspedes ya asignados
    const huespedesAsignadosIds = reservas.map(reserva => reserva.huesped_id);

    // Filtrar los huéspedes que NO están en la lista de asignados
    const huespedesDisponibles = huespedes.filter(huesped => !huespedesAsignadosIds.includes(huesped.id));

    // Poblar el select con los huéspedes disponibles
    const huespedSelect = document.getElementById('huesped');
    huespedSelect.innerHTML = '<option value="">Selecciona un huésped</option>';
    
    huespedesDisponibles.forEach(huesped => {
        const option = document.createElement('option');
        option.value = huesped.id;
        option.textContent = `${huesped.nombre} ${huesped.apellido}`;
        huespedSelect.appendChild(option);
    });
}

// Asignar un huésped a la habitación
async function asignarHuesped(event) {
    event.preventDefault();

    const huespedId = document.getElementById('huesped').value;
    const fechaEntrada = document.getElementById('fecha-entrada').value;
    const fechaSalida = document.getElementById('fecha-salida').value;

    if (!huespedId || !fechaEntrada || !fechaSalida) {
        alert('Por favor completa todos los campos.');
        return;
    }

    if (fechaSalida <= fechaEntrada) {
        alert('La fecha de salida debe ser posterior a la fecha de entrada.');
        return;
    }

    const { error } = await supabaseClient
        .from('reservas')
        .upsert([
            {
                habitacion_id: habitacionId,
                huesped_id: huespedId,
                fecha_inicio: fechaEntrada,
                fecha_fin: fechaSalida,
                estado: 'activa',
            }
        ]);

    if (error) {
        console.error('Error al asignar huésped:', error);
        alert('Hubo un error al asignar el huésped.');
        return;
    }

    alert('Huésped asignado correctamente.');
    location.reload(); // Recargar la página para mostrar los cambios
}

// Quitar un huésped de la habitación
async function quitarHuesped(huespedId) {
    const { error } = await supabaseClient
        .from('reservas')
        .delete()
        .eq('habitacion_id', habitacionId)
        .eq('huesped_id', huespedId)
        .eq('estado', 'activa');

    if (error) {
        console.error('Error al quitar huésped:', error);
        return;
    }

    alert('Huésped eliminado correctamente');
    location.reload(); // Recargar la página para mostrar los cambios
}

// Editar información de la habitación
async function editarHabitacion(event) {
    event.preventDefault();

    const numero =

 document.getElementById('numero').value;
    const piso = document.getElementById('piso').value;
    const camas = document.getElementById('camas').value;
    const bañoPrivado = document.getElementById('baño_privado').checked;

    const { error } = await supabaseClient
        .from('habitaciones')
        .update({ numero, piso, camas, baño_privado: bañoPrivado })
        .eq('id', habitacionId);

    if (error) {
        console.error('Error al editar habitación:', error);
        return;
    }

    alert('Habitación editada correctamente');
    location.reload(); // Recargar la página para mostrar los cambios
}



// Inicializar la página
async function init() {
    await cargarHabitacion();
    await cargarHuespedesAsignados();
    await cargarHuespedesDisponibles();

    // Manejar formulario de asignación de huésped
    const assignGuestForm = document.getElementById('assign-guest-form');
    assignGuestForm.addEventListener('submit', asignarHuesped);

    // Manejar formulario de edición de habitación
    const editRoomForm = document.getElementById('edit-room-form');
    editRoomForm.addEventListener('submit', editarHabitacion);
}

init();