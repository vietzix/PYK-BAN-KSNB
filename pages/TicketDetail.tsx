
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Paperclip, 
  History, 
  MessageSquare, 
  Clock, 
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Upload,
  Link as LinkIcon
} from 'lucide-react';
import { useParams } from 'react-router-dom';
// Fix: Import getTickets instead of MOCK_TICKETS as it's not exported from constants.ts
import { getTickets, CHECKLIST_STEPS_MOCK } from '../constants';
import { TicketStatus } from '../types';

const TicketDetail: React.FC = () => {
  const { id } = useParams();
  // Fix: Retrieve tickets from the store to find the requested one by ID
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === id) || tickets[0];
  const [activeStep, setActiveStep] = useState(2); // Reviewing Content

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Overview Header */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">#{ticket.id}: {ticket.title}</h1>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                ticket.status === TicketStatus.OVERDUE ? 'bg-red-100 text-red-600' : 'bg-brand-50 text-brand-600'
              }`}>
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">Tạo bởi <b>{ticket.assignee}</b> vào 15/10/2025 lúc 08:00</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{ticket.field}</span>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{ticket.unit}</span>
              <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{ticket.priority}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">HẠN XỬ LÝ:</span>
              <span className="font-bold text-red-500 flex items-center gap-1">
                <Clock size={14} /> 30/10/2025
              </span>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Chỉnh sửa</button>
              <button className="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold primary-hover">Hoàn thành</button>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>Tiến độ tổng thể</span>
            <span className="font-bold text-brand-500">60%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="primary-bg h-2 transition-all duration-700" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Processing Steps */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-brand-500" />
                Các bước xử lý
              </h3>
              <button className="text-xs text-brand-500 font-semibold hover:underline">Mở rộng tất cả</button>
            </div>

            <div className="p-6 space-y-8">
              {CHECKLIST_STEPS_MOCK.map((step, idx) => (
                <div key={idx} className="relative flex gap-6">
                  {idx !== CHECKLIST_STEPS_MOCK.length - 1 && (
                    <div className="absolute left-[13px] top-7 bottom-[-20px] w-0.5 bg-gray-100"></div>
                  )}
                  
                  <div className={`z-10 w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    step.status === 'completed' ? 'bg-brand-500 border-brand-500 text-white' : 
                    step.status === 'active' ? 'bg-white border-brand-500 text-brand-500' : 
                    'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {step.status === 'completed' ? <CheckCircle2 size={16} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`text-sm font-bold ${step.status === 'active' ? 'text-brand-500' : 'text-gray-800'}`}>
                        {idx + 1}. {step.title}
                      </h4>
                      {step.status === 'completed' && <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded uppercase">Hoàn thành</span>}
                      {step.status === 'active' && <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wide">Đang thực hiện</span>}
                    </div>

                    {step.status === 'completed' && (
                      <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100 italic">
                        "Đã xác nhận đúng thẩm quyền. Chuyển phòng KSNB." - <b>Nguyễn Văn Điều</b>
                      </div>
                    )}

                    {step.status === 'active' && (
                      <div className="mt-4 p-5 border border-brand-100 bg-brand-50/20 rounded-xl space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-brand-100">
                          <img src="https://i.pravatar.cc/100?u=Nguyễn Văn Điều" className="w-10 h-10 rounded-full border-2 border-brand-100" />
                          <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">Nguyễn Văn Điều</p>
                            <p className="text-xs text-gray-500">Người phụ trách chính: Kiểm soát viên cao cấp</p>
                          </div>
                          <span className="text-[10px] bg-brand-500 text-white px-2 py-1 rounded-md font-bold">Checklist: Lĩnh vực Kế toán</span>
                        </div>

                        <div className="space-y-3">
                          <p className="text-xs font-bold text-brand-500 uppercase tracking-wider">Danh mục kiểm tra (Checklist)</p>
                          
                          {/* Item 1 */}
                          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm space-y-3">
                            <div className="flex items-start gap-3">
                              <input type="checkbox" defaultChecked className="mt-1 rounded text-brand-500 w-4 h-4" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-800">Đối chiếu hóa đơn Q3 với sao kê ngân hàng</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-[10px] text-gray-400 uppercase">Phụ trách: <b>Nguyễn Văn Điều</b></span>
                                  <span className="text-[10px] text-brand-500 flex items-center gap-1 hover:underline cursor-pointer"><Paperclip size={10} /> Bank_Statement_Q3.pdf</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-2 bg-gray-50 rounded border border-gray-100 text-xs text-gray-600 flex items-center justify-between">
                              <span>Đã kiểm tra, khớp số liệu 100%</span>
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            </div>
                          </div>

                          {/* Item 2 */}
                          <div className="p-4 bg-white rounded-lg border border-brand-500 shadow-sm space-y-3 ring-1 ring-brand-100">
                            <div className="flex items-start gap-3">
                              <input type="checkbox" className="mt-1 rounded text-brand-500 w-4 h-4" />
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">Kiểm tra bút toán sổ cái (GL)</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] text-gray-400 uppercase">Phụ trách:</span>
                                  <select className="text-[10px] bg-gray-100 px-1 py-0.5 rounded border-none outline-none font-bold">
                                    <option>Nguyễn Văn Điều</option>
                                    <option>Giang Anh Dũng</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                            <textarea 
                              placeholder="Nhập nhận xét/ý kiến kiểm tra..." 
                              className="w-full text-xs p-2 bg-gray-50 border border-gray-100 rounded outline-none focus:ring-1 focus:ring-brand-500"
                            ></textarea>
                            <button className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all">
                              <Upload size={12} /> Đính kèm file minh chứng
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 pt-2">
                           <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ý kiến tổng hợp của người soát xét</p>
                           <textarea className="w-full p-3 text-sm rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-500" rows={3}></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button className="px-4 py-2 text-sm text-gray-600 font-medium">Lưu nháp</button>
                          <button className="px-5 py-2 text-sm text-white bg-brand-500 rounded-lg font-semibold shadow-md shadow-brand-100">Hoàn thành Rà soát</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks & Tracking */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-brand-500" />
                Theo dõi nhiệm vụ
              </h3>
              <button className="text-xs bg-brand-50 text-brand-500 px-3 py-1.5 rounded-lg font-bold hover:bg-brand-100 transition-all">
                + Thêm nhiệm vụ
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  <th className="px-6 py-3">Nhiệm vụ</th>
                  <th className="px-6 py-3">Người thực hiện</th>
                  <th className="px-6 py-3">Hạn hoàn thành</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Minh chứng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                <tr>
                  <td className="px-6 py-4 font-medium">Cập nhật số cái Q3</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src="https://i.pravatar.cc/50?u=Ngô Thị Tuấn Anh" className="w-6 h-6 rounded-full" />
                      <span>Ngô Thị Tuấn Anh</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">28/10/2025</td>
                  <td className="px-6 py-4">
                    <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Đang chờ</span>
                  </td>
                  <td className="px-6 py-4">-</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Rà soát dự thảo chính sách</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src="https://i.pravatar.cc/50?u=Giang Anh Dũng" className="w-6 h-6 rounded-full" />
                      <span>Giang Anh Dũng</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">25/10/2025</td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Hoàn thành</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-brand-500 hover:underline flex items-center gap-1"><ExternalLink size={12} /> policy_v2.pdf</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <Paperclip size={18} className="text-blue-500" /> Tài liệu đính kèm
              </h4>
              <button className="text-xs text-brand-500 font-bold flex items-center gap-1 hover:underline">
                <LinkIcon size={12} /> Gắn Link
              </button>
            </div>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-brand-500 transition-all">
              <Upload className="text-gray-300" size={32} />
              <p className="text-xs text-gray-500 text-center font-medium">Click hoặc kéo thả file để tải lên</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group">
                <div className="bg-red-500 text-white p-2 rounded-lg"><FileText size={16} /></div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-gray-800 truncate">Q3_Report_Final.pdf</p>
                  <p className="text-[10px] text-gray-500">2.4 MB • 15/10/2025</p>
                </div>
                <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded font-bold text-gray-500 uppercase group-hover:bg-brand-500 group-hover:text-white transition-all">Báo cáo</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group">
                <div className="bg-blue-500 text-white p-2 rounded-lg"><FileText size={16} /></div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-gray-800 truncate">Raw_Data_Export.xlsx</p>
                  <p className="text-[10px] text-gray-500">5.1 MB • 16/10/2025</p>
                </div>
                <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded font-bold text-gray-500 uppercase group-hover:bg-brand-500 group-hover:text-white transition-all">Dữ liệu</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-2">
              <History size={18} className="text-orange-500" /> Nhật ký kiểm soát
            </h4>
            <div className="relative space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center border border-brand-200">
                  <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                </div>
                <p className="text-xs font-bold text-gray-800">Hôm nay, 10:30</p>
                <p className="text-xs text-gray-600 mt-1"><b>Nguyễn Văn Điều</b> đã cập nhật checklist trong <b>Rà soát nội dung</b>.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <p className="text-xs font-bold text-gray-800">16/10, 09:15</p>
                <p className="text-xs text-gray-600 mt-1">Hệ thống đã tải lên file <b>Raw_Data_Export.xlsx</b>.</p>
              </div>
              <div className="relative pl-8 opacity-50">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                </div>
                <p className="text-xs font-bold text-gray-800">15/10, 14:45</p>
                <p className="text-xs text-gray-600 mt-1"><b>Giang Anh Dũng</b> đã hoàn thành <b>Rà soát thẩm quyền</b>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
