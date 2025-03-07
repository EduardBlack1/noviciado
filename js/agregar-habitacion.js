document.addEventListener('DOMContentLoaded', async function () {
    await cargarPropiedades();
});

// Cargar lista de propiedades en el <select>
async function cargarPropiedades() {
    const { data, error } = await supabaseClient.from('propiedades').select('id, nombre');

    if (error) {
        console.error('Error al obtener propiedades:', error);
        return;
    }

    const propiedadSelect = document.getElementById('propiedad');
    data.forEach(propiedad => {
        const option = document.createElement('option');
        option.value = propiedad.id;
        option.textContent = propiedad.nombre;
        propiedadSelect.appendChild(option);
    });
}

// Manejar el envío del formulario
document.getElementById('add-room-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obtener valores del formulario
    const propiedadId = document.getElementById('propiedad').value;
    const numero = document.getElementById('numero').value;
    const piso = document.getElementById('piso').value;
    const camas = document.getElementById('camas').value;
    const baño_privado = document.getElementById('baño_privado').checked;

    // Validar que se haya seleccionado una propiedad
    if (!propiedadId) {
        alert('Por favor, selecciona una propiedad.');
        return;
    }

    // Enviar datos a Supabase
    const { error } = await supabaseClient.from('habitaciones').insert([
        {
            propiedad_id: propiedadId,
            numero,
            piso,
            camas,
            baño_privado
        }
    ]);

    if (error) {
        console.error('Error al agregar habitación:', error);
        alert('Hubo un error al agregar la habitación.');
    } else {
        alert('Habitación agregada correctamente');
        window.location.href = 'habitaciones.html'; // Redirigir a la lista de habitaciones
    }
});