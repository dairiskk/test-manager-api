import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('TestPlanController (e2e)', () => {
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

  it('/test-plans (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/test-plans')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Plan 1' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Plan 1');
  });

  it('/test-plans (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/test-plans')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/test-plans/:id (GET) - not found', async () => {
    await request(app.getHttpServer())
      .get('/test-plans/nonexistent-id')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);
  });

  it('/test-plans/:id (GET)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/test-plans')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Plan 2' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/test-plans/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Plan 2');
  });

  it('/test-plans/:id (PUT) - not found', async () => {
    await request(app.getHttpServer())
      .put('/test-plans/nonexistent-id')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated Test Plan' })
      .expect(404);
  });

  it('/test-plans/:id (PUT)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/test-plans')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Plan 3' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .put(`/test-plans/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated Test Plan' })
      .expect(200);

    expect(response.body.name).toBe('Updated Test Plan');
  });

  it('/test-plans/:id (DELETE)', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/test-plans')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Plan 4' })
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/test-plans/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const deletedResponse = await request(app.getHttpServer())
      .get(`/test-plans/${createResponse.body.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(404);

    expect(deletedResponse.body).toEqual({});
  });
});
