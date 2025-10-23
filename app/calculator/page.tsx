'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface MonthData {
  month: number;
  year: number;
  monthlyContribution: number;
  accumulatedContributions: number;
  monthlyInterest: number;
  accumulatedInterest: number;
  total: number;
}

export default function CalculatorPage() {
  const [initialContribution, setInitialContribution] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [monthlyRate, setMonthlyRate] = useState('');
  const [results, setResults] = useState<MonthData[]>([]);
  const [saving, setSaving] = useState(false);
  const [calculationName, setCalculationName] = useState('');
  const [disclaimerOpen, setDisclaimerOpen] = useState(false);
  const router = useRouter();

  const calculateCompoundInterest = () => {
    // Usa valores padrão se estiver vazio
    const initial = parseFloat(initialContribution) || 10000;
    const monthly = parseFloat(monthlyContribution) || 1000;
    const rate = parseFloat(monthlyRate) || 0.8;
    const rateDecimal = rate / 100;
    const goal = 1000000;

    const monthsData: MonthData[] = [];
    let currentTotal = initial;
    let totalContributed = initial;
    let totalInterest = 0;

    if (currentTotal >= goal) {
      monthsData.push({
        month: 1,
        year: 1,
        monthlyContribution: 0,
        accumulatedContributions: initial,
        monthlyInterest: 0,
        accumulatedInterest: 0,
        total: currentTotal,
      });
      setResults(monthsData);
      return;
    }

    let monthCount = 0;

    while (currentTotal < goal && monthCount < 10000) {
      monthCount++;
      
      const previousTotal = currentTotal;
      const previousContributed = totalContributed;
      const previousInterest = totalInterest;

      totalContributed += monthly;
      currentTotal = (previousTotal + monthly) * (1 + rateDecimal);
      
      const monthlyInterest = currentTotal - previousTotal - monthly;
      totalInterest += monthlyInterest;

      const year = Math.ceil(monthCount / 12);
      const month = ((monthCount - 1) % 12) + 1;

      monthsData.push({
        month,
        year,
        monthlyContribution: monthly,
        accumulatedContributions: previousContributed,
        monthlyInterest,
        accumulatedInterest: previousInterest,
        total: currentTotal,
      });
    }

    setResults(monthsData);
  };

  const saveCalculation = async () => {
    if (results.length === 0) {
      alert('Faça um cálculo antes de salvar!');
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('token');
      const lastResult = results[results.length - 1];

      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          calculation_name: calculationName || 'Sem nome',
          initial_contribution: parseFloat(initialContribution) || 10000,
          monthly_contribution: parseFloat(monthlyContribution) || 1000,
          monthly_rate: parseFloat(monthlyRate) || 0.8,
          months_to_reach_goal: results.length,
          final_amount: lastResult.total,
          total_contributed: lastResult.accumulatedContributions + lastResult.monthlyContribution,
          total_interest: lastResult.accumulatedInterest + lastResult.monthlyInterest,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar cálculo');
      }

      alert('Cálculo salvo com sucesso!');
      setCalculationName('');

    } catch (error) {
      alert('Erro ao salvar cálculo');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const clearCalculation = () => {
    setResults([]);
    setInitialContribution('');
    setMonthlyContribution('');
    setMonthlyRate('');
    setCalculationName('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Calculadora do Primeiro Milhão
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/history')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver Histórico
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-700 font-medium"
            >
              Sair
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Parâmetros do Investimento</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aporte Inicial (R$)
              </label>
              <input
                type="number"
                value={initialContribution}
                onChange={(e) => setInitialContribution(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aporte Mensal (R$)
              </label>
              <input
                type="number"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Taxa de Juros Mensal (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder-gray-400"
                placeholder="0.8"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={calculateCompoundInterest}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {results.length > 0 ? 'Recalcular' : 'Calcular'}
            </button>
            
            {results.length > 0 && (
              <button
                type="button"
                onClick={clearCalculation}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Disclaimer Accordion */}
        <div className="bg-white rounded-lg shadow mb-6 overflow-hidden">
          <button
            onClick={() => setDisclaimerOpen(!disclaimerOpen)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Info className="text-blue-600" size={20} />
              <span className="font-semibold text-gray-900">
                Metodologia e Disclaimer
              </span>
            </div>
            {disclaimerOpen ? (
              <ChevronUp className="text-gray-400" size={20} />
            ) : (
              <ChevronDown className="text-gray-400" size={20} />
            )}
          </button>
          
          {disclaimerOpen && (
            <div className="px-6 pb-6 pt-2 border-t border-gray-100 text-sm text-gray-700 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">📊 Metodologia de Cálculo</h3>
                <p className="mb-2">
                  Esta calculadora utiliza a fórmula de <strong>juros compostos com aportes mensais recorrentes</strong>, 
                  conforme especificado abaixo:
                </p>
                <div className="bg-gray-50 p-3 rounded font-mono text-xs border border-gray-200">
                  Vt = (Vt-1 + Am) × (1 + R)
                </div>
                <p className="mt-2 text-xs">
                  Onde: <strong>Vt</strong> = Valor no mês atual | <strong>Vt-1</strong> = Valor no mês anterior | 
                  <strong> Am</strong> = Aporte mensal | <strong>R</strong> = Taxa de juros mensal (decimal)
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">⚠️ Disclaimer</h3>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Os resultados são <strong>simulações matemáticas</strong> baseadas nos parâmetros informados.</li>
                  <li>Não constituem garantia de rentabilidade ou recomendação de investimento.</li>
                  <li>Investimentos reais estão sujeitos a: variações de mercado, volatilidade, impostos, taxas administrativas e custos operacionais.</li>
                  <li>Rentabilidades passadas não garantem resultados futuros.</li>
                  <li>Esta ferramenta tem finalidade <strong>educacional</strong> para planejamento financeiro de longo prazo.</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                <p className="text-xs text-blue-900">
                  💡 <strong>Dica:</strong> Consulte sempre um profissional certificado (assessor de investimentos) 
                  antes de tomar decisões financeiras importantes.
                </p>
              </div>
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Resultado: {results.length} meses ({Math.ceil(results.length / 12)} anos)
              </h2>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={calculationName}
                  onChange={(e) => setCalculationName(e.target.value)}
                  placeholder="Nome do cálculo (opcional)"
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="button"
                  onClick={saveCalculation}
                  disabled={saving}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar Cálculo'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Mês/Ano</th>
                    <th className="px-4 py-3 text-right">Aporte do Mês</th>
                    <th className="px-4 py-3 text-right">Aporte Acumulado</th>
                    <th className="px-4 py-3 text-right">Rendimento do Mês</th>
                    <th className="px-4 py-3 text-right">Rendimento Acumulado</th>
                    <th className="px-4 py-3 text-right">Total Acumulado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">Mês {row.month} / Ano {row.year}</td>
                      <td className="px-4 py-3 text-right">
                        R$ {row.monthlyContribution.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        R$ {row.accumulatedContributions.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600">
                        R$ {row.monthlyInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-green-600">
                        R$ {row.accumulatedInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        R$ {row.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}