document.addEventListener('DOMContentLoaded', async function () {
    await cargarPropiedades();
});

async function cargarPropiedades() {
    const { data, error } = await supabaseClient.from('propiedades').select('*');

    if (error) {
        console.error('Error al obtener propiedades:', error);
        return;
    }

    const propertyListDiv = document.getElementById('property-list');
    propertyListDiv.innerHTML = ''; // Limpiar antes de cargar

    data.forEach(propiedad => {
        const propertyElement = document.createElement('div');
        propertyElement.classList.add('property-card');
        propertyElement.innerHTML = `
            <h2>${propiedad.nombre}</h2>
            <p><strong>Dirección:</strong> ${propiedad.direccion || 'No especificada'}</p>
            <p><strong>Descripción:</strong> ${propiedad.descripcion || 'Sin descripción'}</p>
            <a href="editar-propiedad.html?id=${propiedad.id}">
                <button class="btn btn-primary btn-sm">Editar</button>
            </a>
            <button onclick="eliminarPropiedad('${propiedad.id}')" class="btn btn-danger btn-sm">Eliminar</button>
            <hr>
        `;
        propertyListDiv.appendChild(propertyElement);
    });
}

// Función para eliminar una propiedad
async function eliminarPropiedad(propiedadId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta propiedad?')) return;

    const { error } = await supabaseClient.from('propiedades').delete().eq('id', propiedadId);

    if (error) {
        console.error('Error al eliminar propiedad:', error);
        alert('Hubo un error al eliminar la propiedad.');
    } else {
        alert('Propiedad eliminada correctamente');
        cargarPropiedades(); // Recargar la lista
    }
}