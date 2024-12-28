import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('TestExecutionController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();

    // Create a test user and get JWT token
    const email = `test_${uuidv4()}@example.com`;
    await request(app.getHttpServer())
      .post('/users')
      .send({ email: email, password: 'password123' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email, password: 'password123' });

    jwtToken = response.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/test-execution (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/test-execution')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Execution 1' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Execution 1');
  });

  it('/test-execution (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/test-execution')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/test-execution/:id (GET) - not found', async () => {
    await request(app.getHttpServer())
      .get('/test-execution/nonexistent-id')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  it('/test-execution/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/test-execution')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Execution 2' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/test-execution/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Execution 2');
  });

  it('/test-execution/:id (PUT) - not found', async () => {
    await request(app.getHttpServer())
      .put('/test-execution/nonexistent-id')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated Test Execution' })
      .expect(404);
  });

  it('/test-execution/:id (PUT)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/test-execution')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Execution 3' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .put(`/test-execution/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated Test Execution' })
      .expect(200);

    expect(response.body.name).toBe('Updated Test Execution');
  });

  it('/test-execution/:id (DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/test-execution')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Execution 4' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/test-execution/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const deletedResponse = await request(app.getHttpServer())
      .get(`/test-execution/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);

    expect(deletedResponse.body).toEqual({});
  });
});
