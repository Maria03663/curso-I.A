// ============================================
// Supabase Config — Ya configurado con tu proyecto
// ============================================

const SUPABASE_URL = 'https://lquqwghmdouzqchjmdtp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxxdXF3Z2htZG91enFjaGptZHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNDk1ODUsImV4cCI6MjA5NDcyNTU4NX0.PfnOATcO707DCqiw4TbA0H5lZkIbaPdeZ0a-wGhs4hI';

// NO TOCAR DE ACÁ PARA ABAJO
// ============================================

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabase = supabaseClient;

supabaseClient.from('profiles').select('count', { count: 'exact', head: true })
  .then(({ count }) => console.log('✅ Supabase conectado —', (count ?? 0), 'perfiles en DB'))
  .catch(err => console.error('❌ Error conectando a Supabase:', err.message));
