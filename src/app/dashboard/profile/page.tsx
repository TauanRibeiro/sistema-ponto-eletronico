'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaUser, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  department: string | null;
  position: string | null;
  employeeId: string | null;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
    position: '',
    employeeId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile');
      if (!response.ok) throw new Error('Falha ao carregar perfil');
      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        department: data.department || '',
        position: data.position || '',
        employeeId: data.employeeId || '',
      });
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Falha ao salvar perfil');
      
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      department: profile?.department || '',
      position: profile?.position || '',
      employeeId: profile?.employeeId || '',
    });
    setEditing(false);
  };

  const roleNames = {
    employee: 'Funcionário',
    manager: 'Gerente',
    admin: 'Administrador',
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="text-lg">Carregando perfil...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          Erro ao carregar perfil
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white p-3 rounded-full">
                <FaUser className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
                <p className="text-blue-100">
                  {roleNames[profile.role as keyof typeof roleNames] || profile.role}
                </p>
              </div>
            </div>
            <div>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md flex items-center hover:bg-blue-50 transition-colors"
                >
                  <FaEdit className="mr-2" />
                  Editar
                </button>
              ) : (
                <div className="space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-green-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <FaSave className="mr-2" />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-gray-600 transition-colors"
                  >
                    <FaTimes className="mr-2" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informações Pessoais */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Informações Pessoais
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {profile.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {profile.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    O email não pode ser alterado
                  </p>
                </div>
              </div>
            </div>

            {/* Informações Profissionais */}
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">
                Informações Profissionais
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Departamento
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Tecnologia, RH, Vendas"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {profile.department || 'Não informado'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cargo
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Desenvolvedor, Analista, Gerente"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {profile.position || 'Não informado'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matrícula
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: EMP001"
                    />
                  ) : (
                    <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                      {profile.employeeId || 'Não informado'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Perfil de Acesso
                  </label>
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {roleNames[profile.role as keyof typeof roleNames] || profile.role}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    O perfil de acesso não pode ser alterado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
