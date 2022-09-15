import express, { request, response } from 'express';

const app = express();


app.get('/games', (request, response) => {
  return response.json([]);
});

app.post('/ads' , (request, response) => {
  return response.status(201).json([]);
});

app.get('/games/:id/ads' , (request, response) => {
  // const gameId = request.params.id;
  return response.json([
    {id: 1, name: 'anúncio 1'},
  ]);
});

app.get('/ads/:id/discord', (request, response) => {
  return response.send({});
})

app.listen(3333)