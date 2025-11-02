'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Calculator, Calendar, TrendingUp } from 'lucide-react';

interface Calculation {
  id: string;
  calculation_name: string | null;
  calculation_date: string;
  initial_contribution: number;
  monthly_contribution: number;
  monthly_rate: number;
  months_to_reach_goal: number;
  final_amount: number;
  total_contributed: number;
  total_interest: number;
}

export default function HistoryPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

// Buscar ao carregar a página
useEffect(() => {
  const loadCalculations = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/calculations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar cálculos');
      }

      const data = await response.json();
      setCalculations(data.calculations);

    } catch (error) {
      console.error('Erro ao carregar cálculos:', error);
    } finally {
      setLoading(false); 
    }
  };

  loadCalculations();
}, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este cálculo?')) {
      return;
    }

    setDeleting(id);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`/api/calculations/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir cálculo');
      }

      // Remove da lista sem precisar recarregar
      setCalculations(calculations.filter(calc => calc.id !== id));
    } catch (err) {
      alert('Erro ao excluir cálculo');
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Histórico de Cálculos
            </h1>
            <p className="text-gray-600">
              {calculations.length} {calculations.length === 1 ? 'simulação salva' : 'simulações salvas'}
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/calculator')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <Calculator size={20} />
              Nova Simulação
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Mensagem de erro */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lista vazia */}
        {calculations.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calculator size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma simulação salva
            </h2>
            <p className="text-gray-600 mb-6">
              Faça sua primeira simulação para acompanhar seu progresso rumo ao primeiro milhão!
            </p>
            <button
              onClick={() => router.push('/calculator')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Criar Primeira Simulação
            </button>
          </div>
        )}

        {/* Grid de cards */}
        {calculations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculations.map((calc) => (
              <div
                key={calc.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 relative"
              >
                {/* Botão deletar */}
                <button
                  onClick={() => handleDelete(calc.id)}
                  disabled={deleting === calc.id}
                  className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Excluir cálculo"
                >
                  <Trash2 size={18} />
                </button>

                {/* Título */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 pr-8">
                  {calc.calculation_name || 'Sem nome'}
                </h3>

                {/* Data */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <Calendar size={14} />
                  {formatDate(calc.calculation_date)}
                </div>

                {/* Estatísticas principais */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tempo necessário:</span>
                    <span className="font-semibold text-gray-900">
                      {calc.months_to_reach_goal} meses ({Math.ceil(calc.months_to_reach_goal / 12)} anos)
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total investido:</span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(calc.total_contributed)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rendimento total:</span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(calc.total_interest)}
                    </span>
                  </div>
                </div>

                {/* Separador */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Aporte inicial:</span>
                      <span>{formatCurrency(calc.initial_contribution)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Aporte mensal:</span>
                      <span>{formatCurrency(calc.monthly_contribution)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa mensal:</span>
                      <span>{calc.monthly_rate}%</span>
                    </div>
                  </div>
                </div>

                {/* Meta final */}
                <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Meta final:</span>
                    </div>
                    <span className="text-lg font-bold text-green-700">
                      {formatCurrency(calc.final_amount)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}