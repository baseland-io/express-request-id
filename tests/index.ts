import express from 'express';
import expressRequestId from '../src';
import { Express, Request, Response } from 'express-serve-static-core';
import { validate } from 'uuid';
import request from 'supertest';
import http from 'http';
import { assert } from 'chai';

describe('default options', async () => {
  describe('using the default options', () => {
    let app: Express;

    it('should set the response header using the default `setHeader`', async () => {
      app = express();
      app.use(expressRequestId());
      app.get('/', (request: Request, response: Response) => {
        assert.isNotEmpty(request.id);
        return response.send('OK');
      });
      const response = await request(app).get('/').expect(200);
      assert.isNotEmpty(response.get('X-Request-Id'));
    });

    it('should use default generator', async () => {
      app = express();
      app.use(expressRequestId());
      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      const response = await request(app).get('/').expect(200);
      const id = response.get('X-Request-Id');
      // should generate a validate UUID
      assert.isTrue(validate(id));
    });

    it('should use the existing X-Request-Id if provided', async () => {
      const existingRequestId = 'some-random-existing-request-id';
      app = express();
      app.use(expressRequestId());
      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      const response = await request(app)
        .get('/')
        .set('X-Request-Id', existingRequestId)
        .expect(200);
      const id = response.get('X-Request-Id');
      assert.isTrue(id === existingRequestId);
    });
  });

  describe('using the custom options', () => {
    let app: Express;

    it('should avoid setting the response header when `setHeader` is `false`', async () => {
      const options = {
        setHeader: false,
      };
      app = express();
      app.use(expressRequestId(options));
      app.get('/', (request: Request, response: Response) => {
        assert.isNotEmpty(request.id);
        return response.send('OK');
      });
      const response = await request(app).get('/').expect(200);
      assert.isUndefined(response.get('X-Request-Id'));
    });

    it('should use a custom generator', async () => {
      const string = 'fake-generator';
      const options = {
        generator: () => string,
      };
      app = express();
      app.use(expressRequestId(options));
      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      const response = await request(app).get('/').expect(200);
      const id = response.get('X-Request-Id');
      assert.isTrue(id === string);
    });

    it('should use a custom header name', async () => {
      const options = {
        headerName: 'X-Custom-Name-Id',
      };
      app = express();
      app.use(expressRequestId(options));
      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      const response = await request(app).get('/').expect(200);
      assert.isNotEmpty(response.get(options.headerName));
    });
  });
});
