const request = require('supertest');
require('dotenv').config({ path: '.env.test' });
const app = require('../src/index');
const UserModel = require('../src/models/user.model');

describe('API Root Endpoint', () => {
  it('should return a success message from /api', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'FinLogic API is running successfully');
  });
});

describe('Autenticación (Auth)', () => {
  it('debe dar error 400 si la contraseña es demasiado débil en el registro', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@weak.com', password: '123' });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('debe dar error 401 si las credenciales de login son incorrectas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@finlogic.com', password: 'WrongPassword123!' });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('debe dar error 400 si faltan campos obligatorios en el registro', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'missing-pass@test.com' });
    expect(res.statusCode).toEqual(400);
  });
});

describe('Seguridad y Rutas Protegidas', () => {
  it('debe denegar acceso (401) a la actualización de perfil sin token', async () => {
    const res = await request(app)
      .put('/api/users/profile')
      .send({ net_monthly_income: 5000 });
    expect(res.statusCode).toEqual(401);
  });

  it('debe denegar acceso (401) al listado de deudas sin token', async () => {
    const res = await request(app).get('/api/debts');
    expect(res.statusCode).toEqual(401);
  });

  it('debe denegar acceso (401) al listado de inversiones sin token', async () => {
    const res = await request(app).get('/api/investments');
    expect(res.statusCode).toEqual(401);
  });
});

describe('Gestión de Deudas', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    const uniqueEmail = `debt-test-${Date.now()}@finlogic.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail, password: 'TestPass123!' });
    authToken = res.body.token;
    testUserId = res.body.user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await UserModel.delete(testUserId);
    }
  });

  it('debe listar deudas (array vacío si no hay)', async () => {
    const res = await request(app)
      .get('/api/debts')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('debts');
    expect(Array.isArray(res.body.debts)).toBe(true);
  });

  it('debe crear una deuda exitosamente', async () => {
    const res = await request(app)
      .post('/api/debts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Tarjeta de Crédito',
        amount: 5000,
        interest_rate: 18.5,
        monthly_payment: 150
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Debt added successfully');
    expect(res.body).toHaveProperty('debtId');
  });

  it('debe dar error 400 al crear deuda sin nombre', async () => {
    const res = await request(app)
      .post('/api/debts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 1000 });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('debe dar error 400 al crear deuda con amount negativo', async () => {
    const res = await request(app)
      .post('/api/debts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Préstamo', amount: -500 });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('debe eliminar una deuda exitosamente', async () => {
    const createRes = await request(app)
      .post('/api/debts')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Deuda para eliminar', amount: 100 });
    
    const debtId = createRes.body.debtId;
    
    const deleteRes = await request(app)
      .delete(`/api/debts/${debtId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty('message', 'Debt removed successfully');
  });

  it('debe dar error 404 al eliminar deuda inexistente', async () => {
    const res = await request(app)
      .delete('/api/debts/999999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

describe('Gestión de Inversiones', () => {
  let authToken;
  let testUserId;

  beforeAll(async () => {
    const uniqueEmail = `invest-test-${Date.now()}@finlogic.com`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: uniqueEmail, password: 'TestPass123!' });
    authToken = res.body.token;
    testUserId = res.body.user.id;
  });

  afterAll(async () => {
    if (testUserId) {
      await UserModel.delete(testUserId);
    }
  });

  it('debe listar inversiones (array vacío si no hay)', async () => {
    const res = await request(app)
      .get('/api/investments')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('investments');
    expect(Array.isArray(res.body.investments)).toBe(true);
  });

  it('debe crear una inversión exitosamente', async () => {
    const res = await request(app)
      .post('/api/investments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Fondo Indexado',
        ticker: 'SPY',
        amount: 10000,
        annual_return: 8,
        monthly_contribution: 500
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Investment added successfully');
    expect(res.body).toHaveProperty('investmentId');
  });

  it('debe dar error 400 al crear inversión sin nombre', async () => {
    const res = await request(app)
      .post('/api/investments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ amount: 5000 });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('debe buscar ticker y devolver resultados', async () => {
    const res = await request(app)
      .get('/api/investments/search?q=AAPL')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('results');
    expect(Array.isArray(res.body.results)).toBe(true);
  });

  it('debe eliminar una inversión exitosamente', async () => {
    const createRes = await request(app)
      .post('/api/investments')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ name: 'Inversión para eliminar', amount: 500 });
    
    const investmentId = createRes.body.investmentId;
    
    const deleteRes = await request(app)
      .delete(`/api/investments/${investmentId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body).toHaveProperty('message', 'Investment removed successfully');
  });

  it('debe dar error 404 al eliminar inversión inexistente', async () => {
    const res = await request(app)
      .delete('/api/investments/999999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toEqual(404);
  });
});
