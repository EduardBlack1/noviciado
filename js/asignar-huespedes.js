
// Obtener `habitacion_id` de la URL si existe
const urlParams = new URLSearchParams(window.location.search);
const habitacionPreseleccionada = urlParams.get('habitacion_id');

// Asignar huéspedes a una habitación
async function asignarHuespedesAHabitacion(habitacionId, huespedesIds) {
    try {
      // Asignar a cada huesped a la habitacion
      for (let huespedId of huespedesIds) {
        await supabaseClient
          .from('reservas')
          .insert([
            {
              habitacion_id: habitacionId,
              huesped_id: huespedId,
              estado: 'activa', // El estado puede ser 'pendiente', 'activa' o 'finalizada'
              fecha_inicio: new Date(),
              fecha_fin: null, // O asigna una fecha final según el caso
            }
          ]);
      }
  
      alert("Huéspedes asignados a la habitación.");
      window.location.href = 'habitaciones.html';
    } catch (error) {
      console.error("Error al asignar huéspedes:", error);
    }
  }
  
  // Cargar habitaciones y huéspedes
  async function cargarHabitacionesYHuespedes() {
    try {
      // Cargar habitaciones disponibles
      const { data: habitaciones, error: habitacionesError } = await supabaseClient
        .from('habitaciones')
        .select('id, numero');
  
      if (habitacionesError) throw habitacionesError;
  
      // Cargar huéspedes disponibles
      const { data: huespedes, error: huespedesError } = await supabaseClient
        .from('huespedes')
        .select('id, nombre, apellido');
  
      if (huespedesError) throw huespedesError;
  
      // Llenar select de habitaciones
      const habitacionSelect = document.getElementById('habitacion');
      habitaciones.forEach(habitacion => {
        const option = document.createElement('option');
        option.value = habitacion.id;
        option.textContent = `Hab ${habitacion.numero}`;
         // Si la habitación viene preseleccionada en la URL, la marcamos
         if (habitacion.id === habitacionPreseleccionada) {
          option.selected = true;
      }
        habitacionSelect.appendChild(option);
      });
  
      // Llenar select de huéspedes
      const huespedSelect = document.getElementById('huespedes');
      huespedes.forEach(huesped => {
        const option = document.createElement('option');
        option.value = huesped.id;
        option.textContent = `${huesped.nombre} ${huesped.apellido}`;
        huespedSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al cargar habitaciones y huéspedes:', error);
    }
  }
  
  // Manejar el formulario
  document.getElementById('form-asignar-huespedes').addEventListener('submit', (e) => {
    e.preventDefault();
  
    const habitacionId = document.getElementById('habitacion').value;
    const huespedesIds = Array.from(document.getElementById('huespedes').selectedOptions).map(option => option.value);
  
    if (habitacionId && huespedesIds.length > 0) {
      asignarHuespedesAHabitacion(habitacionId, huespedesIds);
    } else {
      alert("Por favor, seleccione una habitación y uno o más huéspedes.");
    }
  });
  
  // Cargar datos al cargar la página
  document.addEventListener('DOMContentLoaded', cargarHabitacionesYHuespedes);