import { PrismaClient } from "@prisma/client";
import io from '../server';

const prisma = new PrismaClient();

const emitStartNight = (gameId: number) => {
    io.in(gameId.toString()).emit('start_night')
}

export {emitStartNight}