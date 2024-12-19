import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/users (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'test@example.com', name: 'Test User', password: 'password123' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/users/:id (GET)', async () => {
    const user = await prisma.user.create({
      data: { email: 'test2@example.com', name: 'Test User 2', password: 'password123' },
    });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test2@example.com');
  });

  it('/users/:id (PUT)', async () => {
    const user = await prisma.user.create({
      data: { email: 'test3@example.com', name: 'Test User 3', password: 'password123' },
    });

    const response = await request(app.getHttpServer())
      .put(`/users/${user.id}`)
      .send({ name: 'Updated User' })
      .expect(200);

    expect(response.body.name).toBe('Updated User');
  });

  it('/users/:id (DELETE)', async () => {
    const user = await prisma.user.create({
      data: { email: 'test4@example.com', name: 'Test User 4', password: 'password123' },
    });

    await request(app.getHttpServer())
      .delete(`/users/${user.id}`)
      .expect(200);

    const deletedUser = await prisma.user.findUnique({ where: { id: user.id } });
    expect(deletedUser).toBeNull();
  });
});
