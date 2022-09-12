import { PrismaClient } from "@prisma/client";
import io from '../server';

const prisma = new PrismaClient();

const emitStartNight = async(gameId: number) => {
    io.in(gameId.toString()).emit('start_night')
}

export {emitStartNight}