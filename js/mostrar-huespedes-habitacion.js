// Obtener los huéspedes asignados a una habitación
async function obtenerHuespedesPorHabitacion(habitacionId) {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select('huespedes.id, huespedes.nombre, huespedes.apellido')
        .eq('habitacion_id', habitacionId)
        .join('huespedes', 'reservas.huesped_id', 'huespedes.id');
  
      if (error) {
        console.error('Error al obtener los huéspedes:', error);
      } else {
        return data; // Lista de huéspedes en esa habitación
      }
    } catch (error) {
      console.error("Error al obtener huéspedes:", error);
    }
  }
  
  // Mostrar los huéspedes en la UI
  async function mostrarHuespedes(habitacionId) {
    const huespedes = await obtenerHuespedesPorHabitacion(habitacionId);
    const lista = document.getElementById('lista-huespedes');
    
    if (huespedes && huespedes.length > 0) {
      huespedes.forEach(huesped => {
        const li = document.createElement('li');
        li.textContent = `${huesped.nombre} ${huesped.apellido}`;
        lista.appendChild(li);
      });
    } else {
      lista.innerHTML = '<li>No hay huéspedes asignados a esta habitación.</li>';
    }
  }
  
  // Llamar a la función para mostrar los huéspedes
  const habitacionId = 'id_de_la_habitacion'; // Aquí debes obtener el id de la habitación actual
  mostrarHuespedes(habitacionId);