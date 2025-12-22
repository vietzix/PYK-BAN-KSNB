
import React, { useState } from 'react';
import { 
  Users, 
  FileText, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Filter,
  Download,
  Search,
  ChevronRight,
  Briefcase,
  MapPin,
  CheckCircle2,
  UserPlus,
  BarChart2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { UNITS, FIELDS, PROJECTS } from '../constants';

const KPICard: React.FC<{ label: string; value: string; trend: string; icon: React.ReactNode; color: string }> = ({ label, value, trend, icon, color }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color} text-white`}>
        {icon}
      </div>
      <div className="flex items-center gap-1 text-emerald-600 text-xs font-medium bg-emerald-50 px-2 py-1 rounded-full">
        <ArrowUpRight size={14} />
        {trend}
      </div>
    </div>
    <h3 className="text-gray-500 text-sm font-medium mb-1">{label}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const StaffCard: React.FC<{ name: string; avatar: string; fields: string[]; projects: string[]; workload: number }> = ({ name, avatar, fields, projects, workload }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-brand-500 transition-all group">
    <div className="flex items-start gap-4 mb-4">
      <img src={avatar} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
      <div className="flex-1 overflow-hidden">
        <h4 className="font-bold text-gray-900 truncate group-hover:text-brand-500 transition-colors">{name}</h4>
        <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Đang trực tuyến
        </div>
      </div>
      <button className="p-2 bg-brand-50 text-brand-500 rounded-lg hover:bg-brand-500 hover:text-white transition-all shadow-sm" title="Giao phiếu nhanh">
        <UserPlus size={18} />
      </button>
    </div>

    <div className="space-y-3">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
          <Briefcase size={12} /> Lĩnh vực phụ trách
        </div>
        <div className="flex flex-wrap gap-1.5">
          {fields.map((f, i) => (
            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-semibold">{f}</span>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
          <MapPin size={12} /> Dự án / Lô
        </div>
        <div className="flex flex-wrap gap-1.5">
          {projects.map((p, i) => (
            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold">{p}</span>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[11px] font-bold text-gray-500">TẢI CÔNG VIỆC</span>
          <span className="text-[11px] font-bold text-gray-900">{workload} phiếu đang xử lý</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ${workload > 8 ? 'bg-red-500' : workload > 5 ? 'bg-orange-500' : 'bg-brand-500'}`} 
            style={{ width: `${Math.min((workload/12)*100, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lookup'>('overview');
  const [searchStaff, setSearchStaff] = useState('');

  const barData = UNITS.slice(0, 5).map(unit => ({ name: unit, count: Math.floor(Math.random() * 500) }));
  const pieData = [
    { name: 'Hoàn thành', value: 400, color: '#27AF49' },
    { name: 'Rà soát', value: 300, color: '#F59E0B' },
    { name: 'Quá hạn', value: 100, color: '#EF4444' },
    { name: 'Mới', value: 200, color: '#3B82F6' },
  ];
  const lineData = Array.from({ length: 12 }, (_, i) => ({
    name: `Tháng ${i + 1}`,
    val: Math.floor(Math.random() * 30) + 10,
  }));

  const staffList = [
    { name: 'Nguyễn Văn Điều', fields: ['Kế toán', 'Pháp lý'], projects: ['Dự án X', 'Lô B'], workload: 4, avatar: 'https://i.pravatar.cc/150?u=1' },
    { name: 'Giang Anh Dũng', fields: ['Kiểm soát', 'Vận hành'], projects: ['VP Tập đoàn'], workload: 9, avatar: 'https://i.pravatar.cc/150?u=2' },
    { name: 'Ngô Thị Tuấn Anh', fields: ['Nhân sự', 'Quản trị'], projects: ['Toàn công ty', 'Nhà máy 1'], workload: 2, avatar: 'https://i.pravatar.cc/150?u=3' },
    { name: 'Lý Quốc Đạt', fields: ['Kiểm soát', 'Tài chính'], projects: ['Dự án X', 'Nhà máy 1'], workload: 6, avatar: 'https://i.pravatar.cc/150?u=4' },
    { name: 'Vũ Thúy Quỳnh', fields: ['Kế toán'], projects: ['Lô B'], workload: 3, avatar: 'https://i.pravatar.cc/150?u=woman1' },
    { name: 'Nguyễn Thị Cẩm Hà', fields: ['Pháp lý', 'Quản trị'], projects: ['VP Tập đoàn'], workload: 11, avatar: 'https://i.pravatar.cc/150?u=woman2' },
  ];

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchStaff.toLowerCase()) ||
    s.fields.some(f => f.toLowerCase().includes(searchStaff.toLowerCase())) ||
    s.projects.some(p => p.toLowerCase().includes(searchStaff.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Quản lý Phiếu</h1>
          <p className="text-gray-500">Phân tích dữ liệu và điều phối nhân sự rà soát.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'overview' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BarChart2 size={18} /> Thống kê & Tổng quan
        </button>
        <button 
          onClick={() => setActiveTab('lookup')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'lookup' ? 'border-brand-500 text-brand-500' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={18} /> Tra cứu Nhân sự & Phân công
        </button>
      </div>

      {activeTab === 'overview' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* KPI Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard label="Tổng số phiếu" value="1,240" trend="+5%" icon={<FileText size={20} />} color="bg-blue-500" />
            <KPICard label="Phiếu quá hạn" value="12" trend="+2%" icon={<AlertTriangle size={20} />} color="bg-red-500" />
            <KPICard label="Đang rà soát" value="45" trend="0%" icon={<Clock size={20} />} color="bg-orange-500" />
            <KPICard label="Đang theo dõi" value="88" trend="-3%" icon={<Users size={20} />} color="bg-emerald-500" />
          </div>

          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center gap-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium px-2">
              <Filter size={16} /> Bộ lọc nhanh:
            </div>
            <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 p-2 outline-none">
              <option>Trạng thái: Tất cả</option>
            </select>
            <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 p-2 outline-none">
              <option>Ban/Đơn vị: Tất cả</option>
            </select>
            <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 p-2 outline-none">
              <option>Lĩnh vực: Tất cả</option>
            </select>
            <div className="flex-1"></div>
            <div className="text-sm font-medium text-gray-600">
              Kỳ báo cáo: <span className="bg-gray-100 px-3 py-1 rounded-md">Tháng 10/2025</span>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Xu hướng phiếu quá hạn (12 tháng qua)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="val" stroke="#27AF49" strokeWidth={3} dot={{ r: 4, fill: '#27AF49' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold mb-6">Phiếu theo trạng thái</h3>
              <div className="h-[240px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-bold">1,240</span>
                  <span className="text-xs text-gray-400 font-bold tracking-tight uppercase">Tổng phiếu</span>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-bold text-gray-800">{((d.value/1000)*100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Thống kê theo Ban/Đơn vị (Top 5)</h3>
            <div className="space-y-6">
              {barData.map((item, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{item.name}</span>
                    <span className="text-xs text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded">{item.count} phiếu</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className="primary-bg h-2 rounded-full transition-all duration-700 ease-out" 
                      style={{ width: `${(item.count/500)*100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          {/* Search and Filters for Lookup */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm nhân viên, lĩnh vực hoặc dự án phụ trách..." 
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all text-sm"
                value={searchStaff}
                onChange={(e) => setSearchStaff(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-500">
                <option>Lĩnh vực: Tất cả</option>
                {FIELDS.map(f => <option key={f}>{f}</option>)}
              </select>
              <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-brand-500">
                <option>Dự án: Tất cả</option>
                {PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          {/* Lookup Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff, idx) => (
                <StaffCard key={idx} {...staff} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-gray-300">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-50 rounded-full text-gray-400">
                    <Users size={48} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Không tìm thấy nhân sự phù hợp</h3>
                  <p className="text-sm text-gray-500">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
                  <button onClick={() => setSearchStaff('')} className="text-brand-500 font-bold hover:underline">Xóa tìm kiếm</button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 flex items-start gap-3">
            <div className="p-1 bg-brand-500 text-white rounded"><CheckCircle2 size={16} /></div>
            <div>
              <p className="text-sm font-bold text-brand-800">Mẹo giao phiếu:</p>
              <p className="text-xs text-brand-700 mt-0.5">Hệ thống khuyến nghị ưu tiên giao cho nhân sự có <b>Tải công việc dưới 5 phiếu</b> để đảm bảo tiến độ rà soát nhanh nhất.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
