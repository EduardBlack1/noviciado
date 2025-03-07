// Configurar conexión con Supabase
const { createClient } = supabase;

// const supabaseUrl = 'https://vdbrreaogwrhaceqxtup.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYnJyZWFvZ3dyaGFjZXF4dHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDkyMDQsImV4cCI6MjA1NjUyNTIwNH0.P69PEImJVwfA3KwVTtxCrH63eyz2Z5DODQOrGh-n08s';
// const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Obtener y mostrar habitaciones
async function loadRooms() {
    const { data, error } = await supabaseClient.from('habitaciones').select('*');

    if (error) {
        console.error('Error al obtener habitaciones:', error);
        return;
    }

    const roomListDiv = document.getElementById('room-list');
    roomListDiv.innerHTML = ''; // Limpiar antes de cargar

    data.forEach(room => {
        const roomElement = document.createElement('div');
        roomElement.innerHTML = `
            <h2>Hab. ${room.number} - ${room.beds} camas</h2>
            <p>Baño: ${room.bathroom_inside ? 'Dentro' : 'Compartido'}</p>
            <p>Estado: ${room.is_available ? 'Disponible' : 'Ocupada'}</p>
            <a href="habitacion.html?id=${room.id}">Ver Detalles</a>
            <hr>
        `;
        roomListDiv.appendChild(roomElement);
    });
}

// Cargar habitaciones al abrir la página
document.addEventListener('DOMContentLoaded', loadRooms);