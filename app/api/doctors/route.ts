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

  const doctors = await prisma.user.findMany({
    where: {
      role: 'DOCTOR',
    },
    select: {
      id: true,
      name: true,
    },
  });

  return NextResponse.json(doctors);
}