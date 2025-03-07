// Archivo de configuración de Supabase (js/supabaseClient.js)
const supabaseUrl = 'https://vdbrreaogwrhaceqxtup.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkYnJyZWFvZ3dyaGFjZXF4dHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5NDkyMDQsImV4cCI6MjA1NjUyNTIwNH0.P69PEImJVwfA3KwVTtxCrH63eyz2Z5DODQOrGh-n08s';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

// Exportar Supabase para que pueda ser usado en otros archivos
window.supabaseClient = supabaseClient;