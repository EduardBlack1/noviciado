// Obtener el ID del huésped desde la URL
const urlParams = new URLSearchParams(window.location.search);
const guestId = urlParams.get('id');

// Obtener el formulario de edición
const form = document.getElementById('edit-guest-form');

// Función para cargar los detalles del huésped
async function loadGuestDetails() {
    const { data, error } = await supabaseClient
        .from('huespedes')
        .select('nombre, apellido, email, telefono')
        .eq('id', guestId)
        .single();

    if (error) {
        console.error('Error al obtener los detalles del huésped:', error);
        return;
    }

    // Llenar el formulario con los datos del huésped
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('apellido').value = data.apellido;
    document.getElementById('email').value = data.email;
    document.getElementById('telefono').value = data.telefono;
}

// Cargar los detalles del huésped al cargar la página
loadGuestDetails();

// Función para actualizar el huésped
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    const { error } = await supabaseClient
        .from('huespedes')
        .update({ nombre, apellido, email, telefono })
        .eq('id', guestId);

    if (error) {
        alert('Error al actualizar huésped');
        console.error(error);
        return;
    }

    alert('Huésped actualizado con éxito');
    window.location.href = 'huespedes.html'; // Redirigir a la lista de huéspedes
});