'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';

// Extender a interface global do jsPDF para incluir autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
  }
}

export default function ReportsPage() {
  const { data: session } = useSession();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [employeeId, setEmployeeId] = useState('');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reportData, setReportData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/reports?startDate=${startDate}&endDate=${endDate}&employeeId=${employeeId}`
      );
      if (!response.ok) throw new Error('Falha ao gerar relatório');
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Ponto', 14, 16);
    doc.autoTable({
      head: [['Funcionário', 'Data', 'Entrada', 'Saída', 'Total Horas']],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: reportData.map((item: any) => [
        item.name,
        item.date,
        item.entry,
        item.exit,
        item.totalHours,
      ]),
    });
    doc.save('relatorio_ponto.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório');
    XLSX.writeFile(workbook, 'relatorio_ponto.xlsx');
  };

  if (session?.user?.role !== 'manager' && session?.user?.role !== 'admin') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"></div>
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="glass-card rounded-3xl p-8 shadow-2xl">
            <p className="text-gray-800 font-semibold">Acesso negado.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
      
      <div className="relative p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-6 fade-in">Relatórios</h1>

          <div className="glass-card p-6 rounded-2xl shadow-2xl mb-6 slide-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <input
                type="text"
                placeholder="ID do Funcionário (opcional)"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                className="px-4 py-3 rounded-xl border-0 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
              >
                {loading ? 'Gerando...' : 'Gerar Relatório'}
              </button>
            </div>
          </div>

          {reportData.length > 0 && (
            <div className="fade-in">
              <div className="flex justify-end mb-4 space-x-3">
                <button
                  onClick={exportToPDF}
                  className="glass-card px-6 py-3 rounded-xl font-semibold flex items-center hover:scale-105 transition-all duration-300 shadow-lg text-gray-800"
                >
                  <FaFilePdf className="mr-2 text-red-600" />
                  Exportar PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="glass-card px-6 py-3 rounded-xl font-semibold flex items-center hover:scale-105 transition-all duration-300 shadow-lg text-gray-800"
                >
                  <FaFileExcel className="mr-2 text-green-600" />
                  Exportar Excel
                </button>
              </div>

              <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Funcionário</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Data</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Entrada</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Saída</th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Total Horas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/20">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {reportData.map((item: any, index: number) => (
                      <tr key={index} className="hover:bg-white/10 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.entry}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{item.exit}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{item.totalHours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
