import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('UserController (e2e)', () => {
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
    await prisma.user.create({
      data: { email, name: 'Test User', password: 'password123' },
    });

    const response = await request(app.getHttpServer())
      .post('/users/login')
      .send({ email, password: 'password123' });

    jwtToken = response.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/users (POST)', async () => {
    const email = `unique_test_${uuidv4()}@example.com`;
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email, name: 'Test User 2', password: 'password123' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(email);
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/users/:id (GET)', async () => {
    const email = `unique_test_${uuidv4()}@example.com`;
    const user = await prisma.user.create({
      data: { email, name: 'Test User 3', password: 'password123' },
    });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(email);
  });

  it('/users/:id (PUT)', async () => {
    const email = `unique_test_${uuidv4()}@example.com`;
    const user = await prisma.user.create({
      data: { email, name: 'Test User 4', password: 'password123' },
    });

    const response = await request(app.getHttpServer())
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated User' })
      .expect(200);

    expect(response.body.name).toBe('Updated User');
  });

  it('/users/:id (DELETE)', async () => {
    const email = `unique_test_${uuidv4()}@example.com`;
    const user = await prisma.user.create({
      data: { email, name: 'Test User 5', password: 'password123' },
    });

    await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });
});
