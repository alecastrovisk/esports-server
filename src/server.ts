import express, { request, response } from 'express';
import cors from 'cors';

import { PrismaClient } from '@prisma/client';
import { convertHoursStringToMinutes } from './utils/convert-hour-string-to-minutes';
import { convertMinutesToHourString } from './utils/convert-minutes-to-hours-string';

const app = express();
//NUNCA COLOQUE ESTA MERDA DEPOIS!!!!!!!!
// NUNCA COLOQUE ESTA MERDA DEPOIS!!!!!!!!
// NUNCA COLOQUE ESTA MERDA DEPOIS!!!!!!!!
// NUNCA COLOQUE ESTA MERDA DEPOIS!!!!!!!!
app.use(cors());

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

app.post('/games/:id/ads' , async (request, response) => {
  const gameId = request.params.id;
  const body = request.body;

  console.log('cheguei assim:', body);
  // const weeksDaysTest = body.weeksDays.join(",");
  // console.log(weeksDaysTest);

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      yearsPlaying: body.yearsPlaying,
      discord: body.discord,
      weeksDays: body.weeksDays.join(),
      hourStart: convertHoursStringToMinutes(body.hourStart),
      hourEnd: convertHoursStringToMinutes(body.hourEnd),
      useVoiceChannel: body.useVoiceChannel
    }
  })

  return response.status(201).json(ad);
});

app.get('/games/:id/ads' , async (request, response) => {
  const gameId = request.params.id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      weeksDays: true,
      useVoiceChannel: true,
      yearsPlaying: true,
      hourStart: true,
      hourEnd: true,
    },
    where: {
      gameId
    },
    orderBy: {
      created_at: 'desc'
    }
  });

  return response.json(ads.map(ads => {
    return {
      ...ads,
      weeksDays: ads.weeksDays.split(','),
      hourStart: convertMinutesToHourString(ads.hourStart),
      hourEnd: convertMinutesToHourString(ads.hourEnd)
  }}));
});

app.get('/ads/:id/discord', async (request, response) => {
  const adId = request.params.id;

  const ad = await prisma.ad.findUniqueOrThrow({
    select: {
      discord: true
    },
    where: {
      id: adId,
    }
  });

  return response.send({
    discord: ad.discord
  });
});

app.listen(3333);