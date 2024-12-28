import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma.service';
import { v4 as uuidv4 } from 'uuid';

describe('TestCaseController (e2e)', () => {
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

  it('/test-cases (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/test-cases')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        title: 'Test Case 1',
        description: 'Description for Test Case 1',
        steps: 'Step 1, Step 2',
        expected: 'Expected Result',
        status: 'NOT_EXECUTED',
        isAutomated: false,
        folderPath: '/path/to/test-case',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Case 1');
  });

  it('/test-cases (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/test-cases')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/test-cases/:id (GET)', async () => {
    const testCase = await prisma.testCase.create({
      data: {
        title: 'Test Case 2',
        description: 'Description for Test Case 2',
        steps: 'Step 1, Step 2',
        expected: 'Expected Result',
        status: 'NOT_EXECUTED',
        isAutomated: false,
        folderPath: '/path/to/test-case',
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/test-cases/${testCase.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Test Case 2');
  });

  it('/test-cases/:id (PUT)', async () => {
    const testCase = await prisma.testCase.create({
      data: {
        title: 'Test Case 3',
        description: 'Description for Test Case 3',
        steps: 'Step 1, Step 2',
        expected: 'Expected Result',
        status: 'NOT_EXECUTED',
        isAutomated: false,
        folderPath: '/path/to/test-case',
      },
    });

    const response = await request(app.getHttpServer())
      .put(`/test-cases/${testCase.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ title: 'Updated Test Case 3' })
      .expect(200);

    expect(response.body.title).toBe('Updated Test Case 3');
  });

  it('/test-cases/:id (DELETE)', async () => {
    const testCase = await prisma.testCase.create({
      data: {
        title: 'Test Case 4',
        description: 'Description for Test Case 4',
        steps: 'Step 1, Step 2',
        expected: 'Expected Result',
        status: 'NOT_EXECUTED',
        isAutomated: false,
        folderPath: '/path/to/test-case',
      },
    });

    await request(app.getHttpServer())
      .delete(`/test-cases/${testCase.id}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200);

    const deletedTestCase = await prisma.testCase.findUnique({ where: { id: testCase.id } });
    expect(deletedTestCase).toBeNull();
  });
});
