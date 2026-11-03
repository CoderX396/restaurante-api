process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'clave_de_pruebas';

const request = require('supertest');
const app = require('../src/app');
const { generarToken } = require('../src/utils/jwt');

// Estas pruebas no necesitan base de datos: validan las capas de
// middleware (health, validación, autenticación y roles), que responden
// antes de llegar a los controladores.

describe('GET /health', () => {
  it('responde 200 con status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.headers['x-response-time']).toBeDefined();
  });
});

describe('POST /api/auth/login', () => {
  it('rechaza datos inválidos con 400', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'no-es-correo', password: '' });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('error');
    expect(res.body.details.length).toBeGreaterThan(0);
  });
});

describe('DELETE /api/menu-items/:id', () => {
  it('responde 401 sin token', async () => {
    const res = await request(app).delete('/api/menu-items/1');
    expect(res.status).toBe(401);
  });

  it('responde 403 si el usuario es mesero', async () => {
    const token = generarToken({ id: 99, role: 'mesero' });
    const res = await request(app).delete('/api/menu-items/1').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('Rutas inexistentes', () => {
  it('responde 404 con el formato de error centralizado', async () => {
    const res = await request(app).get('/api/no-existe');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ status: 'error', message: 'Ruta no encontrada: GET /api/no-existe' });
  });
});
