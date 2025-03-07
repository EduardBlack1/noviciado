const roomList = document.getElementById('room-list');
const searchInput = document.getElementById('search-input');
let habitacionesGlobal = []; // Guardará todas las habitaciones para la búsqueda

// Cargar habitaciones
async function cargarHabitaciones() {
    const { data: habitaciones, error: errorHabitaciones } = await supabaseClient
        .from('habitaciones')
        .select('id, numero, propiedad_id, estado_limpieza');

    if (errorHabitaciones) {
        console.error('Error al cargar habitaciones:', errorHabitaciones);
        return;
    }

    // Obtener reservas activas
    const { data: reservas, error: errorReservas } = await supabaseClient
        .from('reservas')
        .select('habitacion_id, huesped_id')
        .eq('estado', 'activa');

    if (errorReservas) {
        console.error('Error al cargar reservas:', errorReservas);
        return;
    }

    // Obtener propiedades
    const { data: propiedades, error: errorPropiedades } = await supabaseClient
        .from('propiedades')
        .select('id, nombre');

    if (errorPropiedades) {
        console.error('Error al cargar propiedades:', errorPropiedades);
        return;
    }

    // Obtener huéspedes
    const { data: huespedes, error: errorHuespedes } = await supabaseClient
        .from('huespedes')
        .select('id, nombre, apellido');

    if (errorHuespedes) {
        console.error('Error al cargar huéspedes:', errorHuespedes);
        return;
    }

    // Agregar la información de reservas, huéspedes y propiedades a cada habitación
    habitaciones.forEach(habitacion => {
        habitacion.propiedad_nombre = propiedades.find(prop => prop.id === habitacion.propiedad_id)?.nombre || 'Propiedad desconocida';

        const reservasHabitacion = reservas.filter(reserva => reserva.habitacion_id === habitacion.id);
        habitacion.huespedes = reservasHabitacion.map(reserva => {
            const huesped = huespedes.find(h => h.id === reserva.huesped_id);
            return huesped ? `${huesped.nombre} ${huesped.apellido}` : 'Sin asignar';
        }).join(', ');
    });

    // Guardar en la variable global y renderizar
    habitacionesGlobal = habitaciones;
    renderizarHabitaciones(habitaciones);
}

// Renderizar habitaciones en la tabla
function renderizarHabitaciones(habitaciones) {
    roomList.innerHTML = '';

    habitaciones.forEach(habitacion => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${habitacion.numero}</td>
            <td>${habitacion.propiedad_nombre}</td>
            <td>${habitacion.huespedes || 'Sin huéspedes'}</td>
            <td>${habitacion.estado_limpieza}</td>
            <td>
                <a href="asignar-huesped.html?habitacion_id=${habitacion.id}" class="btn btn-primary btn-sm">Ver/Asignar</a>
                <button class="btn btn-danger btn-sm" onclick="eliminarHabitacion('${habitacion.id}')">X</button>
            </td>
        `;
        roomList.appendChild(row);
    });
}

// Eliminar habitación
async function eliminarHabitacion(habitacionId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta habitación?')) return;

    const { error } = await supabaseClient.from('habitaciones').delete().eq('id', habitacionId);

    if (error) {
        console.error('Error al eliminar habitación:', error);
        alert('Hubo un error al eliminar la habitación.');
    } else {
        alert('Habitación eliminada correctamente');
        cargarHabitaciones(); // Recargar la lista
    }
}

// Filtrar habitaciones en tiempo real
searchInput.addEventListener('input', function () {
    const filtro = searchInput.value.toLowerCase();

    const habitacionesFiltradas = habitacionesGlobal.filter(habitacion => 
        habitacion.numero.toLowerCase().includes(filtro) ||
        habitacion.propiedad_nombre.toLowerCase().includes(filtro) ||
        (habitacion.huespedes && habitacion.huespedes.toLowerCase().includes(filtro))
    );

    renderizarHabitaciones(habitacionesFiltradas);
});

// Inicializar la carga de habitaciones
cargarHabitaciones();