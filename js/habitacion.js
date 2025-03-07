const urlParams = new URLSearchParams(window.location.search);
const roomId = urlParams.get('id');

const { createClient } = supabase;
// const supabaseUrl = 'https://vdbrreaogwrhaceqxtup.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYnJyZWFvZ3dyaGFjZXF4dHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDkyMDQsImV4cCI6MjA1NjUyNTIwNH0.P69PEImJVwfA3KwVTtxCrH63eyz2Z5DODQOrGh-n08s';
// const supabaseClient = createClient(supabaseUrl, supabaseKey);

// Cargar detalles de la habitación
async function loadRoomDetails() {
    const { data, error } = await supabaseClient
        .from('habitaciones')
        .select('*')
        .eq('id', roomId)
        .single();

    if (error) {
        console.error('Error al obtener habitación:', error);
        return;
    }

    const detailsDiv = document.getElementById('room-details');
    detailsDiv.innerHTML = `
        <h2>Hab. ${data.number} - ${data.beds} camas</h2>
        <p>Baño: ${data.bathroom_inside ? 'Dentro' : 'Compartido'}</p>
        <p>Estado: 
            <select id="room-status">
                <option value="true" ${data.is_available ? 'selected' : ''}>Disponible</option>
                <option value="false" ${!data.is_available ? 'selected' : ''}>Ocupada</option>
            </select>
        </p>
        <button onclick="updateRoom()">Actualizar Estado</button>
    `;
}

// Actualizar estado de la habitación en Supabase
async function updateRoom() {
    const isAvailable = document.getElementById('room-status').value === 'true';

    const { error } = await supabaseClient
        .from('habitaciones')
        .update({ is_available: isAvailable })
        .eq('id', roomId);

    if (error) {
        console.error('Error al actualizar estado:', error);
    } else {
        alert('Estado actualizado');
        loadRoomDetails();
    }
}

// Cargar habitación al abrir la página
document.addEventListener('DOMContentLoaded', loadRoomDetails);