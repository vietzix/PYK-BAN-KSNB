
import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Search, 
  AlertTriangle, 
  CheckSquare, 
  Save, 
  X,
  BookOpen,
  Info,
  ChevronRight
} from 'lucide-react';
import { FIELDS } from '../constants';

interface ReviewItem {
  id: string;
  title: string;
  legal: string;
  role: string;
}

interface CommonErrorItem {
  id: string;
  title: string;
  description: string;
  recommendation: string;
  severity: 'warning' | 'critical';
}

const AdvancedConfig: React.FC = () => {
  const [selectedField, setSelectedField] = useState('Kế toán');
  const [activeTab, setActiveTab] = useState<'review' | 'errors'>('review');
  
  // Quản lý danh sách các bước rà soát
  const [items, setItems] = useState<ReviewItem[]>([
    { id: '1', title: 'Kiểm tra tính hợp lệ của chứng từ đính kèm', legal: 'Điều 12.1 Quy chế chi tiêu nội bộ', role: 'Kiểm soát viên cấp 1' },
    { id: '2', title: 'Đối chiếu số liệu với báo cáo tổng hợp', legal: 'Mục 4.a Hướng dẫn hạch toán 2025', role: 'Kiểm soát viên cấp 1' },
    { id: '3', title: 'Xác nhận chữ ký của trưởng bộ phận liên quan', legal: 'Điều 25.9 của Quy chế tài chính', role: 'Trưởng đoàn kiểm toán' },
  ]);

  // Quản lý danh sách các lỗi thường gặp
  const [commonErrors, setCommonErrors] = useState<CommonErrorItem[]>([
    { 
      id: 'e1', 
      title: 'Thiếu chữ ký phê duyệt', 
      description: 'Phiếu không có chữ ký của cấp quản lý trực tiếp hoặc người được ủy quyền.', 
      recommendation: 'Yêu cầu bổ sung chữ ký trước khi xử lý tiếp hoặc giải trình lý do thiếu.',
      severity: 'critical' 
    },
    { 
      id: 'e2', 
      title: 'Sai lệch số tiền > 5%', 
      description: 'Số tiền trên phiếu chênh lệch quá 5% so với hóa đơn gốc.', 
      recommendation: 'Kiểm tra lại tỷ giá hoặc các khoản phí phụ thu. Lập biên bản ghi nhận chênh lệch.',
      severity: 'warning' 
    }
  ]);

  const handleAddItem = () => {
    const newItem: ReviewItem = {
      id: Date.now().toString(),
      title: '',
      legal: '',
      role: 'Kiểm soát viên cấp 1'
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleUpdateItem = (id: string, field: keyof ReviewItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleAddError = () => {
    const newError: CommonErrorItem = {
      id: Date.now().toString(),
      title: '',
      description: '',
      recommendation: '',
      severity: 'warning'
    };
    setCommonErrors([...commonErrors, newError]);
  };

  const handleRemoveError = (id: string) => {
    setCommonErrors(commonErrors.filter(e => e.id !== id));
  };

  const handleUpdateError = (id: string, field: keyof CommonErrorItem, value: string) => {
    setCommonErrors(commonErrors.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  return (
    <div className="flex gap-8 h-full min-h-[calc(100vh-140px)]">
      {/* Sidebar Selector */}
      <div className="w-80 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-bold text-black text-sm mb-3 uppercase tracking-wider">Danh mục Lĩnh vực</h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm lĩnh vực..." 
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-500 text-black font-medium" 
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {FIELDS.map(f => (
            <button 
              key={f} 
              onClick={() => setSelectedField(f)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                selectedField === f ? 'bg-brand-50 text-brand-600 border border-brand-100' : 'text-black hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedField === f ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                  <BookOpen size={16} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${selectedField === f ? 'text-brand-600' : 'text-black'}`}>{f}</p>
                  <p className={`text-[10px] font-medium ${selectedField === f ? 'text-brand-500' : 'text-black opacity-60'}`}>12 mục rà soát</p>
                </div>
              </div>
              <ChevronRight size={14} className={selectedField === f ? 'text-brand-500' : 'text-gray-300'} />
            </button>
          ))}
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 text-brand-600 text-xs font-bold border-2 border-dashed border-gray-100 rounded-xl hover:bg-brand-50 hover:border-brand-200 transition-all mt-4">
            <Plus size={14} /> Thêm lĩnh vực mới
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-black leading-none mb-1">Cấu hình Nâng cao Phiếu</h2>
            <p className="text-sm text-black font-medium italic opacity-80">Thiết lập quy trình rà soát và danh mục lỗi cho lĩnh vực <b className="text-black font-bold">{selectedField}</b></p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-sm text-black font-bold hover:underline">Hủy bỏ</button>
            <button className="flex items-center gap-2 px-5 py-2 bg-brand-500 text-white rounded-lg text-sm font-bold primary-hover shadow-md shadow-brand-100">
              <Save size={18} /> Lưu cấu hình
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('review')}
              className={`px-8 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'review' ? 'border-brand-500 text-brand-600 bg-brand-50/10' : 'border-transparent text-black opacity-60 hover:opacity-100'
              }`}
            >
              <CheckSquare size={16} /> Quy trình Rà soát <span className="bg-brand-100 text-brand-600 text-[10px] px-1.5 py-0.5 rounded-full">{items.length}</span>
            </button>
            <button 
              onClick={() => setActiveTab('errors')}
              className={`px-8 py-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'errors' ? 'border-brand-500 text-brand-600 bg-brand-50/10' : 'border-transparent text-black opacity-60 hover:opacity-100'
              }`}
            >
              <AlertTriangle size={16} /> Lỗi thường gặp <span className="bg-gray-100 text-black text-[10px] px-1.5 py-0.5 rounded-full font-bold">{commonErrors.length}</span>
            </button>
          </div>

          <div className="p-8 flex-1">
            {activeTab === 'review' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-black">Checklist các bước</h3>
                  <button 
                    onClick={handleAddItem}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    <Plus size={14} /> Thêm bước mới
                  </button>
                </div>
                
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="group relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:border-brand-200 hover:shadow-md transition-all animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                        <GripVertical size={16} />
                      </div>
                      <div className="pl-6 space-y-3">
                        <div className="flex items-start justify-between">
                          <input 
                            type="text" 
                            value={item.title} 
                            onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                            placeholder="Nhập tên bước kiểm tra..."
                            className="flex-1 font-bold text-black bg-transparent border-none focus:ring-0 text-sm outline-none placeholder:text-gray-300"
                          />
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500">
                              <BookOpen size={14} />
                            </span>
                            <input 
                              type="text" 
                              value={item.legal}
                              onChange={(e) => handleUpdateItem(item.id, 'legal', e.target.value)}
                              placeholder="Căn cứ pháp lý / Tham chiếu"
                              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:border-brand-300 transition-all text-black font-medium"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <select 
                              value={item.role}
                              onChange={(e) => handleUpdateItem(item.id, 'role', e.target.value)}
                              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none font-bold text-black"
                            >
                              <option>Kiểm soát viên cấp 1</option>
                              <option>Kiểm soát viên cấp 2</option>
                              <option>Trưởng đoàn kiểm toán</option>
                              <option>Lãnh đạo Ban</option>
                            </select>
                            <span className="text-[10px] text-black font-black uppercase whitespace-nowrap opacity-60">Bắt buộc</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={handleAddItem}
                    className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-black opacity-40 hover:border-brand-300 hover:text-brand-600 hover:opacity-100 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-brand-100 group-hover:bg-brand-50">
                      <Plus size={24} className="group-hover:text-brand-500" />
                    </div>
                    <span className="text-sm font-bold">Bấm để thêm bước kiểm tra mới</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-black flex items-center gap-2">
                    <AlertTriangle size={20} className="text-orange-500" />
                    Danh sách Lỗi thường gặp
                  </h3>
                  <button 
                    onClick={handleAddError}
                    className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline"
                  >
                    <Plus size={14} /> Thêm lỗi mới
                  </button>
                </div>
                
                <div className="space-y-4">
                  {commonErrors.map((error) => (
                    <div 
                      key={error.id} 
                      className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 border-l-4 transition-all hover:shadow-md animate-in fade-in slide-in-from-top-2 duration-300 ${
                        error.severity === 'critical' ? 'border-l-red-500' : 'border-l-orange-500'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <input 
                              type="text" 
                              value={error.title} 
                              onChange={(e) => handleUpdateError(error.id, 'title', e.target.value)}
                              placeholder="Nhập tên lỗi thường gặp..."
                              className="flex-1 font-bold text-black bg-transparent border-none focus:ring-0 text-sm outline-none placeholder:text-gray-300"
                            />
                            <select 
                              value={error.severity}
                              onChange={(e) => handleUpdateError(error.id, 'severity', e.target.value as 'warning' | 'critical')}
                              className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border-none outline-none focus:ring-1 ${
                                error.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                              }`}
                            >
                              <option value="critical">Nghiêm trọng</option>
                              <option value="warning">Cảnh báo</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-black uppercase opacity-40">Mô tả lỗi:</label>
                            <textarea 
                              value={error.description}
                              onChange={(e) => handleUpdateError(error.id, 'description', e.target.value)}
                              placeholder="Mô tả chi tiết nội dung lỗi..."
                              className="w-full text-sm text-black font-medium bg-gray-50 border border-gray-100 rounded-lg p-3 outline-none focus:border-brand-300 transition-all min-h-[60px]"
                            />
                          </div>

                          <div className="bg-emerald-50 p-3 rounded-xl flex items-start gap-3 border border-emerald-100">
                             <div className="p-1 bg-emerald-500 text-white rounded shrink-0"><Info size={12} /></div>
                             <div className="flex-1 space-y-1">
                                <label className="text-[10px] font-bold text-black uppercase opacity-40">Gợi ý khắc phục:</label>
                                <textarea 
                                  value={error.recommendation}
                                  onChange={(e) => handleUpdateError(error.id, 'recommendation', e.target.value)}
                                  placeholder="Nhập hướng dẫn xử lý/khắc phục..."
                                  className="w-full text-xs text-black font-medium bg-white border border-emerald-100 rounded-lg p-2 outline-none focus:border-emerald-300 transition-all"
                                />
                             </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveError(error.id)}
                          className="ml-4 p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button 
                    onClick={handleAddError}
                    className="w-full py-6 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-black opacity-40 hover:border-brand-300 hover:text-brand-600 hover:opacity-100 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-gray-100 flex items-center justify-center group-hover:border-brand-100 group-hover:bg-brand-50">
                      <Plus size={24} className="group-hover:text-brand-500" />
                    </div>
                    <span className="text-sm font-bold">Bấm để thêm lỗi kiểm tra mới</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedConfig;
