const guestListDiv = document.getElementById('guest-list');
const searchInput = document.getElementById('search-input');
let huespedesGlobal = []; // Guardará todos los huéspedes para la búsqueda

// Cargar huéspedes desde Supabase
async function cargarHuespedes() {
    const { data, error } = await supabaseClient.from('huespedes').select('*');

    if (error) {
        console.error('Error al obtener huéspedes:', error);
        return;
    }

    // Guardar los datos en la variable global y renderizar
    huespedesGlobal = data;
    renderizarHuespedes(data);
}

// Renderizar la lista de huéspedes
function renderizarHuespedes(huespedes) {
    guestListDiv.innerHTML = ''; // Limpiar antes de cargar

    if (huespedes.length === 0) {
        guestListDiv.innerHTML = '<p>No se encontraron huéspedes.</p>';
        return;
    }

    huespedes.forEach(huesped => {
        const guestElement = document.createElement('div');
        guestElement.classList.add('guest-card');
        guestElement.innerHTML = `
            <h2>${huesped.nombre} ${huesped.apellido}</h2>
            <p><strong>Email:</strong> ${huesped.email || 'No especificado'}</p>
            <p><strong>Teléfono:</strong> ${huesped.telefono || 'No especificado'}</p>
            <a href="editar-huesped.html?id=${huesped.id}">
                <button class="btn btn-primary btn-sm">Editar</button>
            </a>
            <button onclick="eliminarHuesped('${huesped.id}')" class="btn btn-danger btn-sm">Eliminar</button>
            <hr>
        `;
        guestListDiv.appendChild(guestElement);
    });
}

// Filtrar huéspedes en tiempo real
searchInput.addEventListener('input', function () {
    const filtro = searchInput.value.toLowerCase();

    const huespedesFiltrados = huespedesGlobal.filter(huesped =>
        huesped.nombre.toLowerCase().includes(filtro) ||
        huesped.apellido.toLowerCase().includes(filtro) ||
        (huesped.email && huesped.email.toLowerCase().includes(filtro)) ||
        (huesped.telefono && huesped.telefono.toLowerCase().includes(filtro))
    );

    renderizarHuespedes(huespedesFiltrados);
});

// Función para eliminar un huésped
async function eliminarHuesped(huespedId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este huésped?')) return;

    const { error } = await supabaseClient.from('huespedes').delete().eq('id', huespedId);

    if (error) {
        console.error('Error al eliminar huésped:', error);
        alert('Hubo un error al eliminar el huésped.');
    } else {
        alert('Huésped eliminado correctamente');
        cargarHuespedes(); // Recargar la lista
    }
}

// Inicializar la carga de huéspedes
document.addEventListener('DOMContentLoaded', cargarHuespedes);