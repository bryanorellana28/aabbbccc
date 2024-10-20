import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/authOptions";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appointments = await prisma.appointment.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      user: true,
      doctor: true,
    },
  });

  return NextResponse.json(appointments);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { date } = await request.json();

  const appointment = await prisma.appointment.create({
    data: {
      date: new Date(date),
      userId: session.user.id,
    },
  });

  return NextResponse.json(appointment);
}