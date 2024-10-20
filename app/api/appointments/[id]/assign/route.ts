import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/authOptions";

const prisma = new PrismaClient();

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'DOCTOR') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { doctorId } = await request.json();
  const { id } = params;

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { doctorId },
  });

  return NextResponse.json(appointment);
}