
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Settings, 
  Bell, 
  User, 
  Search,
  LogOut,
  ChevronRight,
  ShieldCheck,
  CheckSquare,
  AlertTriangle,
  MessageSquareCode
} from 'lucide-react';

const SidebarItem: React.FC<{ to: string; icon: React.ReactNode; label: string; active?: boolean }> = ({ to, icon, label, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
      active ? 'bg-brand-50 text-brand-500 font-semibold' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const path = location.pathname;
  
  const userAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=256&h=256&auto=format&fit=crop";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">
            <ShieldCheck size={20} />
          </div>
          <span className="text-xl font-bold text-gray-800 truncate">Ban KSNB PVEP</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          <SidebarItem to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" active={path === '/'} />
          <SidebarItem to="/tickets" icon={<FileText size={20} />} label="Danh sách Phiếu" active={path === '/tickets'} />
          <SidebarItem to="/reports" icon={<BarChart3 size={20} />} label="Báo cáo" active={path === '/reports'} />
          <SidebarItem to="/chatbot" icon={<MessageSquareCode size={20} className="text-brand-500" />} label="Trợ lý KSNB (AI)" active={path === '/chatbot'} />
          
          <div className="pt-4 pb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Hệ thống</div>
          <SidebarItem 
            to="/checklist-config" 
            icon={<CheckSquare size={20} />} 
            label="Cài đặt Quy trình Checklist" 
            active={path === '/checklist-config'} 
          />
          <SidebarItem 
            to="/error-config" 
            icon={<AlertTriangle size={20} />} 
            label="Cài đặt Lỗi gặp tại PYK" 
            active={path === '/error-config'} 
          />
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
            <img src={userAvatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-gray-900 truncate">Đoàn Thái Việt</p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
            <LogOut size={16} className="text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link to="/" className="hover:text-brand-500">Trang chủ</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium lowercase first-letter:uppercase">
              {path === '/' ? 'Dashboard' : path.split('/')[1].replace('-', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500" />
              <input 
                type="text" 
                placeholder="Tìm kiếm phiếu..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
              />
            </div>
            <button className="relative p-2 text-gray-400 hover:text-brand-500">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 border border-gray-100 shadow-inner">
              <img src={userAvatar} alt="user" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-8 bg-gray-50 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
