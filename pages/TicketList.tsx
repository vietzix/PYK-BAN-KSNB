
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  UserPlus, 
  PlusSquare,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  X,
  Check,
  User,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { getTickets, UNITS, FIELDS, PROJECTS } from '../constants';
import { TicketStatus, Ticket } from '../types';
import { Link, useNavigate } from 'react-router-dom';

const StatusBadge: React.FC<{ status: TicketStatus }> = ({ status }) => {
  const styles = {
    [TicketStatus.NEW]: 'bg-blue-50 text-blue-600',
    [TicketStatus.IN_PROGRESS]: 'bg-orange-50 text-orange-600',
    [TicketStatus.PENDING_REVIEW]: 'bg-purple-50 text-purple-600',
    [TicketStatus.FOLLOW_UP]: 'bg-indigo-50 text-indigo-600',
    [TicketStatus.OVERDUE]: 'bg-red-50 text-red-600 font-semibold',
    [TicketStatus.COMPLETED]: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <span className={`px-2 py-1 rounded-md text-[11px] font-medium uppercase tracking-wider ${styles[status]}`}>
      {status}
    </span>
  );
};

// Modal Component for Reusability
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-full transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Modal States
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [assignee, setAssignee] = useState('');
  const [taskData, setTaskData] = useState({ name: '', assignee: '', dueDate: '' });

  useEffect(() => {
    setTickets(getTickets());
  }, []);

  const filteredTickets = useMemo(() => {
    let result = tickets;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(ticket => 
        ticket.id.toLowerCase().includes(query) || 
        ticket.title.toLowerCase().includes(query) ||
        ticket.assignee.toLowerCase().includes(query) ||
        ticket.unit.toLowerCase().includes(query)
      );
    }
    return result;
  }, [searchQuery, tickets]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTickets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTickets.map(t => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleViewDetail = () => {
    if (selectedIds.length === 1) {
      navigate(`/tickets/${selectedIds[0]}`);
    }
  };

  const handleEdit = () => {
    if (selectedIds.length === 1) {
      navigate(`/tickets/new`); 
    }
  };

  const handleConfirmAssign = () => {
    if (!assignee) return alert('Vui lòng chọn người phụ trách');
    alert(`Đã phân công ${selectedIds.length} phiếu cho ${assignee}`);
    setIsAssignModalOpen(false);
    setSelectedIds([]);
    setAssignee('');
  };

  const handleConfirmAddTask = () => {
    if (!taskData.name || !taskData.assignee || !taskData.dueDate) return alert('Vui lòng điền đầy đủ thông tin nhiệm vụ');
    alert(`Đã thêm nhiệm vụ "${taskData.name}" cho các phiếu đã chọn`);
    setIsAddTaskModalOpen(false);
    setSelectedIds([]);
    setTaskData({ name: '', assignee: '', dueDate: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Danh sách Phiếu Ý kiến / Vấn đề</h1>
          <p className="text-gray-500 text-sm font-medium">Theo dõi các phiếu kiểm soát và rà soát nội bộ PVEP.</p>
        </div>
        <Link to="/tickets/new" className="flex items-center gap-2 px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-bold primary-hover shadow-md shadow-brand-100 transition-all">
          + Tạo phiếu mới
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-gray-200 bg-white space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[300px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm mã phiếu, tiêu đề..." 
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all text-black font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleViewDetail}
                disabled={selectedIds.length !== 1}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                  selectedIds.length === 1 
                  ? 'border-brand-500 text-brand-600 bg-brand-50 hover:bg-brand-100' 
                  : 'border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <Eye size={14} /> Xem chi tiết
              </button>
              <button 
                onClick={handleEdit}
                disabled={selectedIds.length !== 1}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                  selectedIds.length === 1 
                  ? 'border-brand-500 text-brand-600 bg-brand-50 hover:bg-brand-100' 
                  : 'border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <Edit size={14} /> Chỉnh sửa
              </button>
              <button 
                onClick={() => setIsAssignModalOpen(true)}
                disabled={selectedIds.length === 0}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                  selectedIds.length > 0 
                  ? 'border-brand-500 text-brand-600 bg-brand-50 hover:bg-brand-100' 
                  : 'border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <UserPlus size={14} /> Phân công
              </button>
              <button 
                onClick={() => setIsAddTaskModalOpen(true)}
                disabled={selectedIds.length === 0}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all ${
                  selectedIds.length > 0 
                  ? 'border-brand-500 text-brand-600 bg-brand-50 hover:bg-brand-100' 
                  : 'border-gray-100 text-gray-400 bg-gray-50 cursor-not-allowed'
                }`}
              >
                <PlusSquare size={14} /> Thêm nhiệm vụ
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex gap-4">
              <select className="bg-gray-50 border border-gray-200 text-black font-bold text-xs rounded-lg px-3 py-2 outline-none focus:border-brand-500">
                <option>Trạng thái: Tất cả</option>
                {Object.values(TicketStatus).map(s => <option key={s}>{s}</option>)}
              </select>
              <select className="bg-gray-50 border border-gray-200 text-black font-bold text-xs rounded-lg px-3 py-2 outline-none focus:border-brand-500">
                <option>Lĩnh vực: Tất cả</option>
                {FIELDS.map(f => <option key={f}>{f}</option>)}
              </select>
            </div>
            
            <button 
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`text-xs font-bold flex items-center gap-1 transition-all px-3 py-2 rounded-lg ${
                showAdvancedFilters ? 'bg-brand-500 text-white' : 'text-brand-600 hover:bg-brand-50'
              }`}
            >
              <Filter size={14} /> Bộ lọc nâng cao
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 w-10">
                  <div className="flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="rounded text-brand-500 w-4 h-4 cursor-pointer" 
                      checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mã phiếu</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiêu đề / Vấn đề</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Lĩnh vực</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Người phụ trách</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hạn xử lý</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket.id} 
                  className={`hover:bg-brand-50/20 transition-colors group cursor-pointer ${
                    selectedIds.includes(ticket.id) ? 'bg-brand-50/40' : ''
                  }`}
                  onClick={() => toggleSelect(ticket.id)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-brand-500 w-4 h-4 cursor-pointer" 
                        checked={selectedIds.includes(ticket.id)}
                        onChange={() => toggleSelect(ticket.id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-brand-600">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{ticket.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">{ticket.field}</td>
                  <td className="px-6 py-4"><StatusBadge status={ticket.status} /></td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-bold">{ticket.assignee}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-bold">{ticket.dueDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-gray-400 hover:text-brand-500 transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      <Modal 
        isOpen={isAssignModalOpen} 
        onClose={() => setIsAssignModalOpen(false)} 
        title="Phân công xử lý Phiếu"
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Đã chọn {selectedIds.length} phiếu:</p>
            <div className="max-h-24 overflow-y-auto space-y-1">
              {selectedIds.map(id => (
                <div key={id} className="text-xs font-bold text-gray-700 bg-white px-2 py-1 rounded border border-gray-100 flex items-center justify-between">
                  <span>{id}</span>
                  <CheckCircle2 size={12} className="text-brand-500" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
              <User size={14} className="text-brand-500" /> Chọn người phụ trách
            </label>
            <select 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-brand-500 outline-none"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">-- Chọn nhân sự --</option>
              <option>Nguyễn Văn Điều</option>
              <option>Giang Anh Dũng</option>
              <option>Ngô Thị Tuấn Anh</option>
              <option>Lý Quốc Đạt</option>
            </select>
          </div>

          <button 
            onClick={handleConfirmAssign}
            className="w-full py-3 bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-100 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
          >
            <Check size={18} /> Xác nhận phân công
          </button>
        </div>
      </Modal>

      {/* Add Task Modal */}
      <Modal 
        isOpen={isAddTaskModalOpen} 
        onClose={() => setIsAddTaskModalOpen(false)} 
        title="Thêm nhiệm vụ theo dõi"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">Tên nhiệm vụ</label>
            <input 
              type="text" 
              placeholder="Nhập tên nhiệm vụ cần thực hiện..." 
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-brand-500 outline-none"
              value={taskData.name}
              onChange={(e) => setTaskData({...taskData, name: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Người thực hiện</label>
              <select 
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                value={taskData.assignee}
                onChange={(e) => setTaskData({...taskData, assignee: e.target.value})}
              >
                <option value="">Chọn...</option>
                <option>Nguyễn Văn Điều</option>
                <option>Giang Anh Dũng</option>
                <option>Ngô Thị Tuấn Anh</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Hạn hoàn thành</label>
              <div className="relative">
                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="date" 
                  className="w-full pl-9 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-brand-500 outline-none"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={handleConfirmAddTask}
            className="w-full mt-2 py-3 bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-100 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
          >
            <PlusSquare size={18} /> Thêm nhiệm vụ
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TicketList;
