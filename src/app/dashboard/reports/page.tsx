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
    return <div className="p-4">Acesso negado.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Relatórios</h1>

      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-input"
          />
          <input
            type="text"
            placeholder="ID do Funcionário (opcional)"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="form-input"
          />
          <button
            onClick={handleGenerateReport}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            {loading ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
      </div>

      {reportData.length > 0 && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center mr-2"
            >
              <FaFilePdf className="mr-2" />
              Exportar PDF
            </button>
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaFileExcel className="mr-2" />
              Exportar Excel
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              {/* ... Tabela de resultados ... */}
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
