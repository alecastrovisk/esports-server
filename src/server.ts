import express, { request, response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

app.get('/games', async (request, response) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true
        }
      }
    }
  });

  return response.json(games);
});

app.post('/ads' , (request, response) => {
  return response.status(201).json([]);
});

app.get('/games/:id/ads' , async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    where: {
      gameId
    }
  })
  return response.json(ads);
});

app.get('/ads/:id/discord', (request, response) => {
  return response.send({});
})

app.listen(3333)