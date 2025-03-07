document.getElementById('add-property-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const direccion = document.getElementById('direccion').value;
    const descripcion = document.getElementById('descripcion').value;

    const { error } = await supabaseClient.from('propiedades').insert([
        { nombre, direccion, descripcion }
    ]);

    if (error) {
        console.error('Error al agregar propiedad:', error);
        alert('Hubo un error al agregar la propiedad.');
    } else {
        alert('Propiedad agregada correctamente');
        window.location.href = 'index.html'; // Redirigir a la lista de propiedades
    }
});