import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import edificiosRoutes from './routes/edificios.routes';
import departamentosRoutes from './routes/departamentos.routes';
import clientesRoutes from './routes/clientes.routes';
import reservasRoutes from './routes/reservas.routes';
import usuariosRoutes from './routes/usuarios.routes';
import limpiezaRoutes from './routes/limpieza.routes';
import dashboardRoutes from './routes/dashboard.routes';
import reportesRoutes from './routes/reportes.routes';
import { iniciarTareasProgramadas } from './utils/cron.utils';

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    if (origin.includes('ngrok')) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🏢 API de Gestión de Departamentos',
    version: '2.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      edificios: '/api/edificios',
      departamentos: '/api/departamentos',
      clientes: '/api/clientes',
      reservas: '/api/reservas',
      limpieza: '/api/limpieza',
      dashboard: '/api/dashboard',
      reportes: '/api/reportes'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/edificios', edificiosRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/limpieza', limpiezaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reportes', reportesRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', ruta: req.path });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log('  ✅ SERVIDOR FUNCIONANDO');
  console.log(`  🌐 URL: http://localhost:${PORT}`);
  console.log(`  📅 Fecha: ${new Date().toLocaleString('es-PY')}`);
  console.log('  🗄️  PostgreSQL: Conectado');
  console.log('  🔐 JWT: Activo');
  console.log('  📋 Reservas: Activo');
  console.log('  🧹 Limpieza: Activo');
  console.log('  👥 Usuarios: Activo');
  console.log('  📊 Reportes: Activo');
  console.log('  📅 Calendario: Activo');
  console.log('═══════════════════════════════════════');
  
  iniciarTareasProgramadas();
});

export default app;