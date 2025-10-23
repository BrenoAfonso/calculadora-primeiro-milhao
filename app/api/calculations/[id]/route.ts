import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const calculation = await prisma.calculation.findUnique({
      where: { id: params.id },
    });

    if (!calculation) {
      return NextResponse.json(
        { success: false, message: 'Cálculo não encontrado' },
        { status: 404 }
      );
    }

    if (calculation.user_id !== payload.userId) {
      return NextResponse.json(
        { success: false, message: 'Sem permissão para deletar este cálculo' },
        { status: 403 }
      );
    }

    await prisma.calculation.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Cálculo deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar cálculo:', error);
    return NextResponse.json(
      { success: false, message: 'Erro ao deletar cálculo' },
      { status: 500 }
    );
  }
}