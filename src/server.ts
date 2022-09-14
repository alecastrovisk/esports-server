import express from 'express';

const app = express();

app.get('/ads' , (request, response) => {
  return response.json([
    {id: 1, name: 'anúncio 1'},
])
})

app.listen(3333)