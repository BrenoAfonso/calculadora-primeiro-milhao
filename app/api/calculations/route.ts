import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Não autenticado' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      );
    }

    const calculations = await prisma.calculation.findMany({
      where: { user_id: payload.userId },
      orderBy: { calculation_date: 'desc' },
    });

    return NextResponse.json({
      success: true,
      calculations,
    });
  } catch (error) {
    console.error('Erro ao buscar cálculos:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao buscar cálculos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Não autenticado' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      );
    }

    const data = await request.json();

    const calculation = await prisma.calculation.create({
      data: {
        user_id: payload.userId,
        calculation_name: data.calculation_name || null,
        initial_contribution: Number(data.initial_contribution),
        monthly_contribution: Number(data.monthly_contribution),
        monthly_rate: Number(data.monthly_rate),
        months_to_reach_goal: Number(data.months_to_reach_goal),
        final_amount: Number(data.final_amount),
        total_contributed: Number(data.total_contributed),
        total_interest: Number(data.total_interest),
      },
    });

    return NextResponse.json({
      success: true,
      calculation,
    });
  } catch (error) {
    console.error('Erro ao criar cálculo:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao criar cálculo' },
      { status: 500 }
    );
  }
}