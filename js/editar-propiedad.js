// Obtener el ID de la propiedad desde la URL
const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get('id');

// Obtener el formulario de edición
const form = document.getElementById('edit-property-form');

// Función para cargar los detalles de la propiedad
async function loadPropertyDetails() {
    const { data, error } = await supabaseClient
        .from('propiedades')
        .select('nombre, direccion, descripcion')
        .eq('id', propertyId)
        .single();

    if (error) {
        console.error('Error al obtener los detalles de la propiedad:', error);
        return;
    }

    // Llenar el formulario con los datos de la propiedad
    document.getElementById('nombre').value = data.nombre;
    document.getElementById('direccion').value = data.direccion;
    document.getElementById('descripcion').value = data.descripcion;
}

// Cargar los detalles de la propiedad al cargar la página
loadPropertyDetails();

// Función para actualizar la propiedad
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const descripcion = document.getElementById('descripcion').value;

    const { error } = await supabaseClient
        .from('propiedades')
        .update({ nombre, direccion, descripcion })
        .eq('id', propertyId);

    if (error) {
        alert('Error al actualizar propiedad');
        console.error(error);
        return;
    }

    alert('Propiedad actualizada con éxito');
    window.location.href = 'index.html'; // Redirigir a la lista de propiedades
});