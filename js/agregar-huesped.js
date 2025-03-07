document.getElementById('add-guest-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;

    const { error } = await supabaseClient.from('huespedes').insert([
        { nombre, apellido, email, telefono }
    ]);

    if (error) {
        console.error('Error al agregar huésped:', error);
        alert('Hubo un error al agregar el huésped.');
    } else {
        alert('Huésped agregado correctamente');
        window.location.href = 'huespedes.html'; // Redirigir a la lista de huéspedes
    }
});