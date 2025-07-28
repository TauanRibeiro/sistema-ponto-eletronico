'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaPlusCircle } from 'react-icons/fa';

type Request = {
  id: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string | null;
  reason: string;
  user: {
    name: string;
    email: string;
  };
};

export default function RequestsPage() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests');
      if (!response.ok) throw new Error('Falha ao carregar solicitações');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRequestTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      time_correction: 'Correção de Ponto',
      absence: 'Ausência',
      vacation: 'Férias',
      overtime: 'Hora Extra',
    };
    return types[type] || type;
  };

  const getStatusBadgeColor = (status: string) => {
    const colors: { [key: string]: string } = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="p-4">Carregando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Solicitações</h1>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlusCircle className="mr-2" />
          Nova Solicitação
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Inicial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Final
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Solicitante
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {getRequestTypeLabel(request.type)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(request.status)}`}>
                    {request.status === 'pending' && 'Pendente'}
                    {request.status === 'approved' && 'Aprovado'}
                    {request.status === 'rejected' && 'Rejeitado'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(request.startDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {request.endDate ? new Date(request.endDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {request.user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {request.user.email}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Nova Solicitação será implementado aqui */}
    </div>
  );
}
