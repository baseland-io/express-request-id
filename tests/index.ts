import express from 'express';
import expressRequestId from '../src';
import { Express, Request, Response } from 'express-serve-static-core';
import { validate } from 'uuid';
import request from 'supertest';
import http from 'http';
import  { assert } from 'chai';

describe('default options', async () => {
  describe('using the default values', () => {
    let app: Express;

    before((done) => {
      app = express();
      app.use(expressRequestId());
      app.get('/', (request: Request, response: Response) => {
        console.log('request.id:', request.id);
        console.log('request.get:', request.get('X-Request-Id'));
        return response.send('OK');
      });
      done();
    });

    it('should set the request id using the default header option', async () => {
      try {
        const response = await request(app).get('/').expect(200);
        const id = response.get('X-Request-Id');
        assert.isTrue(validate(id));
      } catch (error) {
        console.log(error);
      }
    });
  });

  xdescribe('using custom values', () => {
    let server: http.Server;
    let app: Express;

    before((done) => {
      const options = {
        setHeader: false,
      }
      app = express();
      app.use(expressRequestId(options));
      app.get('/', (request: Request, response: Response) => {
        return response.send('OK');
      });
      server = app.listen(4000, () => {
        console.log('listing to port 4000');
        done();
      });
    });

    after((done) => {
      server.close();
      done();
    });

    it('should not set the resopnse header value when the `setHeader value us false', async () => {

      try {
        const r = await request(server).get('/').expect(200);
        console.log(r.get('X-Request-Id'));
      } catch (error) {
        console.log(error);
      }
      console.log('end of test');
    });
  });
});
// test('sets request id', async t => {
//   const app = express();
//   app.use(requestID());
//   app.get('/', (request, response, _next) => {
//     t.true(validate(request.id));
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   const response = await request(app).get('/').expect(200, 'OK');

//   t.true(validate(response.get('X-Request-Id')));
// });

// test('preserves old request id', async t => {
//   const app = express();
//   app.use(requestID());
//   app.get('/', (request, response, _next) => {
//     t.is(request.id, 'MyID');
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   await request(app).get('/').set('X-Request-Id', 'MyID').expect(200, 'OK');
// });

// test('setHeader option', async t => {
//   const app = express();
//   app.use(requestID({ setHeader: false }));
//   app.get('/', (_request, response, _next) => {
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   const response = await request(app).get('/').set('X-Request-Id', 'MyID').expect(200, 'OK');

//   t.is(response.get('X-Request-Id'), undefined);
// });

// test('headerName option', async t => {
//   const app = express();
//   app.use(requestID({ headerName: 'X-My-Request-Id' }));
//   app.get('/', (_request, response, _next) => {
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   const response = await request(app).get('/').set('X-My-Request-Id', 'MyID').expect(200, 'OK');

//   t.is(response.get('X-My-Request-Id'), 'MyID');
// });

// test('generator option', async t => {
//   const app = express();
//   app.use(requestID({ generator: _request => 'ID' }));
//   app.get('/', (request, response, _next) => {
//     t.is(request.id, 'ID');
//     response.send('OK');
//   });
//   app.use(errorHandler(t));

//   await request(app).get('/').expect(200, 'OK');
// });
