'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  FaClock, 
  FaUserFriends, 
  FaClipboardList, 
  FaChartBar,
  FaBell,
  FaUser,
  FaCalendarAlt,
  FaCog,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';

export default function DashboardNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Atualiza a cada minuto
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) throw new Error('Falha ao carregar notificações');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });
      fetchNotifications(); // Atualiza a lista
    } catch (error) {
      console.error('Erro:', error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' });
  };

  const isManager = session?.user?.role === 'manager' || session?.user?.role === 'admin';

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: FaHome },
    { name: 'Ponto', href: '/dashboard', icon: FaClock },
    ...(isManager ? [
      { name: 'Funcionários', href: '/dashboard/employees', icon: FaUserFriends },
      { name: 'Escalas', href: '/dashboard/schedules', icon: FaCalendarAlt }
    ] : []),
    { name: 'Solicitações', href: '/dashboard/requests', icon: FaClipboardList },
    { name: 'Relatórios', href: '/dashboard/reports', icon: FaChartBar },
    ...(session?.user?.role === 'admin' ? [
      { name: 'Configurações', href: '/dashboard/settings', icon: FaCog }
    ] : []),
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo e Navegação Principal */}
          <div className="flex items-center">
            <div className="flex-shrink-0 mr-8">
              <h1 className="text-xl font-bold text-blue-600">Ponto Eletrônico</h1>
            </div>
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-2 border-blue-200'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Menu do Usuário */}
          <div className="flex items-center space-x-4">
            {/* Notificações */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaBell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Dropdown de Notificações */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notificações</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification: any) => (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <p className="font-medium text-sm text-gray-900">{notification.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                          >
                            Marcar como lida
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        Sem novas notificações
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Perfil do Usuário */}
            <div className="flex items-center space-x-3">
              <Link
                href="/dashboard/profile"
                className="flex items-center space-x-2 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FaUser className="h-4 w-4" />
                <span className="hidden md:block text-sm font-medium">
                  {session?.user?.name?.split(' ')[0]}
                </span>
              </Link>

              {/* Botão de Logout */}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Sair"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span className="hidden md:block text-sm font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navegação Mobile */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex overflow-x-auto space-x-1 py-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex-shrink-0 inline-flex items-center px-3 py-2 text-xs font-medium rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
