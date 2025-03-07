// Obtener el ID de la habitación desde la URL
const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('id');

// Obtener el formulario de edición
const form = document.getElementById('edit-room-form');

// Función para cargar las propiedades en el <select>
async function cargarPropiedades(selectedPropertyId) {
    const { data, error } = await supabaseClient.from('propiedades').select('id, nombre');

    if (error) {
        console.error('Error al obtener propiedades:', error);
        return;
    }

    const propiedadSelect = document.getElementById('propiedad');
    propiedadSelect.innerHTML = '<option value="">Selecciona una propiedad</option>';

    data.forEach(propiedad => {
        const option = document.createElement('option');
        option.value = propiedad.id;
        option.textContent = propiedad.nombre;
        if (propiedad.id === selectedPropertyId) {
            option.selected = true;
        }
        propiedadSelect.appendChild(option);
    });
}

// Función para cargar los detalles de la habitación
async function loadRoomDetails() {
    const { data, error } = await supabaseClient
        .from('habitaciones')
        .select('propiedad_id, numero, piso, camas, baño_privado')
        .eq('id', roomId)
        .single();

    if (error) {
        console.error('Error al obtener los detalles de la habitación:', error);
        return;
    }

    // Cargar la lista de propiedades y marcar la propiedad actual
    await cargarPropiedades(data.propiedad_id);

    // Llenar el formulario con los datos de la habitación
    document.getElementById('numero').value = data.numero;
    document.getElementById('piso').value = data.piso;
    document.getElementById('camas').value = data.camas;
    document.getElementById('baño_privado').checked = data.baño_privado;
}

// Cargar los detalles de la habitación al cargar la página
loadRoomDetails();

// Función para actualizar la habitación
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const propiedadId = document.getElementById('propiedad').value;
    const numero = document.getElementById('numero').value;
    const piso = document.getElementById('piso').value;
    const camas = document.getElementById('camas').value;
    const baño_privado = document.getElementById('baño_privado').checked;

    const { error } = await supabaseClient
        .from('habitaciones')
        .update({ propiedad_id: propiedadId, numero, piso, camas, baño_privado })
        .eq('id', roomId);

    if (error) {
        alert('Error al actualizar habitación');
        console.error(error);
        return;
    }

    alert('Habitación actualizada con éxito');
    window.location.href = 'habitaciones.html'; // Redirigir a la lista de habitaciones
});