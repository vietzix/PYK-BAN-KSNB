
import React, { useState } from 'react';
import { 
  Info, 
  ChevronDown, 
  CheckSquare, 
  AlertCircle, 
  Upload,
  Save,
  SendHorizontal,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UNITS, FIELDS, PROJECTS, COMMON_ERRORS_MOCK, addTicketToStore } from '../constants';
import { Priority, TicketStatus, Ticket } from '../types';

const TicketForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    unit: '',
    project: '',
    field: '',
    priority: Priority.MEDIUM,
    detectDate: '',
    description: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePriorityChange = (priority: Priority) => {
    setFormData(prev => ({ ...prev, priority }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!formData.unit) newErrors.unit = 'Vui lòng chọn đơn vị';
    if (!formData.field) newErrors.field = 'Vui lòng chọn lĩnh vực';
    if (!formData.description.trim()) newErrors.description = 'Vui lòng nhập mô tả';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Giả lập lưu dữ liệu vào localStorage
    const newTicket: Ticket = {
      id: `TKT-2025-${Math.floor(Math.random() * 900) + 100}`, // Tạo mã ngẫu nhiên
      title: formData.title,
      field: formData.field,
      project: formData.project || 'Không xác định',
      unit: formData.unit,
      status: TicketStatus.NEW,
      priority: formData.priority,
      assignee: 'Đoàn Thái Việt', // Mặc định người tạo
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Mặc định 14 ngày sau
      lastUpdated: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      reviewProgress: 0,
      description: formData.description
    };

    setTimeout(() => {
      addTicketToStore(newTicket); // Lưu vào store
      setIsSubmitting(false);
      alert('Tạo phiếu thành công! Phiếu đã được đưa vào danh sách theo dõi.');
      navigate('/tickets');
    }, 800);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-black">Tạo mới Phiếu Ý kiến</h1>
          <p className="text-sm text-black opacity-80">Điền thông tin chi tiết để tạo phiếu mới. Phiếu sẽ được kích hoạt ngay sau khi lưu.</p>
        </div>
        <span className="bg-brand-50 text-brand-600 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider">Phiếu mới</span>
      </div>

      <div className="space-y-6">
        {/* Section 1: Identification */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <Info size={18} className="text-brand-500" />
            <h3 className="font-bold text-black text-sm">I. Thông tin định danh</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black uppercase mb-2">Tiêu đề phiếu <span className="text-red-500">*</span></label>
              <input 
                name="title"
                type="text" 
                value={formData.title}
                onChange={handleChange}
                placeholder="Nhập tiêu đề phiếu ngắn gọn (VD: Đề xuất quy trình kiểm kê kho Q3)" 
                className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.title ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition-all text-sm text-black font-medium`}
              />
              {errors.title && <p className="text-red-600 text-[10px] mt-1 font-bold">{errors.title}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2">Mã phiếu (Tự động)</label>
              <input type="text" value="TKT-2025-AUTO" disabled className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-black opacity-60 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2">Ban / Đơn vị <span className="text-red-500">*</span></label>
              <select 
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.unit ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm text-black font-medium`}
              >
                <option value="" className="text-gray-400">Chọn đơn vị xử lý</option>
                {UNITS.map(u => <option key={u} value={u} className="text-black">{u}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black uppercase mb-2">Dự án liên quan (Nếu có)</label>
              <select 
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm text-black font-medium"
              >
                <option value="" className="text-gray-400">Không thuộc dự án cụ thể</option>
                {PROJECTS.map(p => <option key={p} value={p} className="text-black">{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Details */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center gap-2">
            <CheckSquare size={18} className="text-brand-500" />
            <h3 className="font-bold text-black text-sm">II. Chi tiết vấn đề</h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2">Lĩnh vực <span className="text-red-500">*</span></label>
              <select 
                name="field"
                value={formData.field}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.field ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm text-black font-medium`}
              >
                <option value="" className="text-gray-400">Chọn lĩnh vực</option>
                {FIELDS.map(f => <option key={f} value={f} className="text-black">{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2">Mức độ ưu tiên <span className="text-red-500">*</span></label>
              <div className="flex gap-4 items-center h-[42px]">
                {Object.values(Priority).map((p) => (
                  <label key={p} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="priority" 
                      checked={formData.priority === p}
                      onChange={() => handlePriorityChange(p)}
                      className="text-brand-500 focus:ring-brand-500 w-4 h-4" 
                    />
                    <span className={`text-sm ${formData.priority === p ? 'font-bold text-black' : 'text-black opacity-70'} ${p === Priority.HIGH ? 'text-red-600 font-bold' : ''}`}>
                      {p}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-2">Ngày phát hiện</label>
              <input 
                name="detectDate"
                type="date" 
                value={formData.detectDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm text-black font-medium" 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black uppercase mb-2">Mô tả chi tiết vấn đề <span className="text-red-500">*</span></label>
              <textarea 
                name="description"
                rows={4} 
                value={formData.description}
                onChange={handleChange}
                placeholder="Mô tả chi tiết bối cảnh, thực trạng, rủi ro và đề xuất (nếu có)..." 
                className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg focus:ring-2 focus:ring-brand-500 outline-none text-sm text-black font-medium`}
              ></textarea>
              <div className="flex justify-between mt-1">
                {errors.description ? <p className="text-red-600 text-[10px] font-bold">{errors.description}</p> : <span></span>}
                <p className="text-[10px] text-black opacity-50 font-bold">{formData.description.length}/2000 ký tự</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Recommended Checklist (Informational) */}
        <div className="bg-orange-50/30 rounded-xl border border-orange-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-orange-500" />
              <h3 className="font-bold text-black text-sm">III. Checklist rà soát lỗi thường gặp</h3>
            </div>
            <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold">KHUYẾN NGHỊ RÀ SOÁT</span>
          </div>
          <div className="p-6">
            <p className="text-xs text-black mb-4 font-bold italic">Vui lòng rà soát lại các mục sau trước khi tạo phiếu để đảm bảo chất lượng rà soát:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMMON_ERRORS_MOCK.map((error, idx) => (
                <label key={idx} className="bg-white p-4 rounded-xl border border-orange-100 shadow-sm flex gap-3 hover:ring-2 hover:ring-orange-200 transition-all cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded text-orange-500 w-4 h-4" />
                  <div>
                    <p className="text-sm font-bold text-black">{error.title}</p>
                    <p className="text-[11px] text-black opacity-80 leading-relaxed mt-1 font-medium">{error.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="fixed bottom-0 left-64 right-0 bg-white border-t border-gray-200 p-4 px-8 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
          <button 
            type="button"
            onClick={() => navigate('/tickets')}
            className="text-black opacity-60 font-bold text-sm hover:opacity-100 transition-opacity"
          >
            Hủy bỏ
          </button>
          <div className="flex gap-4">
            <button 
              type="button"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-black hover:bg-gray-50 transition-all shadow-sm"
            >
              <Save size={18} /> Lưu nháp
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-2.5 bg-brand-500 text-white rounded-xl text-sm font-bold primary-hover transition-all shadow-md shadow-brand-100 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Tạo phiếu ngay'} 
              {!isSubmitting && <CheckCircle size={18} />}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default TicketForm;
