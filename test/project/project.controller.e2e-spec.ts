import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('ProjectController (e2e)', () => {
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

  it('/projects (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/projects')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Test Project' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Project');
  });

  it('/projects (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/projects')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/projects/:id (GET)', async () => {
    const project = await prisma.project.create({
      data: { name: 'Test Project 2' },
    });

    const response = await request(app.getHttpServer())
      .get(`/projects/${project.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Project 2');
  });

  it('/projects/:id (PUT)', async () => {
    const project = await prisma.project.create({
      data: { name: 'Test Project 3' },
    });

    const response = await request(app.getHttpServer())
      .put(`/projects/${project.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ name: 'Updated Project' })
      .expect(200);

    expect(response.body.name).toBe('Updated Project');
  });

  it('/projects/:id (DELETE)', async () => {
    const project = await prisma.project.create({
      data: { name: 'Test Project 4' },
    });

    await request(app.getHttpServer())
      .delete(`/projects/${project.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const deletedProject = await prisma.project.findUnique({ where: { id: project.id } });
    expect(deletedProject).toBeNull();
  });
});
