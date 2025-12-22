
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  RefreshCcw, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  Award,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { getTickets } from '../constants';

const ReportPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedYear, setSelectedYear] = useState('2025');
  const [showReport, setShowReport] = useState(false);

  const tickets = getTickets();
  const totalTickets = tickets.length * 42; // Simulated larger dataset for report
  const completedTickets = Math.floor(totalTickets * 0.85);
  const onTimeTickets = Math.floor(completedTickets * 0.92);
  const overdueTickets = totalTickets - completedTickets - 15;

  const errorData = [
    { name: 'Thiếu chứng từ', count: 45, impact: 'Cao' },
    { name: 'Sai lệch số liệu', count: 28, impact: 'Trung bình' },
    { name: 'Sai thẩm quyền', count: 12, impact: 'Rất cao' },
    { name: 'Chậm tiến độ', count: 65, impact: 'Thấp' },
  ];

  const COLORS = ['#27AF49', '#3B82F6', '#F59E0B', '#EF4444'];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 1500);
  };

  return (
    <div className="flex gap-8 min-h-[calc(100vh-140px)]">
      {/* Sidebar Controls */}
      <div className="w-80 space-y-6 shrink-0">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={18} className="text-brand-500" /> Cấu hình báo cáo
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Năm báo cáo</label>
              <select 
                value={selectedYear} 
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="2025">Năm 2025</option>
                <option value="2024">Năm 2024</option>
                <option value="2023">Năm 2023</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loại báo cáo</label>
              <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500">
                <option>Tổng hợp rà soát Phiếu ý kiến</option>
                <option>Báo cáo tuân thủ chi tiết</option>
                <option>Báo cáo hiệu suất nhân sự</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phạm vi dữ liệu</label>
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500 w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Tất cả các Ban/Đơn vị</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-brand-500 w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">Bao gồm phân tích lỗi</span>
                </label>
              </div>
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-brand-500 text-white rounded-xl font-bold shadow-lg shadow-brand-100 hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <RefreshCcw size={18} className="animate-spin" />
            ) : (
              <FileText size={18} />
            )}
            {isGenerating ? 'Đang tổng hợp...' : 'Tạo báo cáo ngay'}
          </button>
        </div>

        {showReport && (
          <div className="bg-brand-50 p-4 rounded-2xl border border-brand-100 animate-in fade-in slide-in-from-left-4">
            <h4 className="text-xs font-bold text-brand-700 uppercase mb-2">Tính năng xuất bản</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 p-3 bg-white border border-brand-200 rounded-xl text-brand-600 text-xs font-bold hover:bg-brand-100 transition-all">
                <Download size={14} /> Tải Word
              </button>
              <button className="flex items-center justify-center gap-2 p-3 bg-white border border-brand-200 rounded-xl text-brand-600 text-xs font-bold hover:bg-brand-100 transition-all">
                <Printer size={14} /> In PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Report Preview Canvas */}
      <div className="flex-1 flex justify-center bg-gray-200/50 rounded-2xl p-8 overflow-y-auto max-h-[calc(100vh-140px)]">
        {!showReport && !isGenerating ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 h-full opacity-40">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
              <FileText size={40} className="text-gray-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-700">Chưa có báo cáo nào được tạo</p>
              <p className="text-sm text-gray-500">Vui lòng chọn cấu hình bên trái và nhấn "Tạo báo cáo"</p>
            </div>
          </div>
        ) : isGenerating ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">Đang phân tích dữ liệu rà soát...</p>
              <p className="text-sm text-gray-500">Hệ thống đang tổng hợp các mục lỗi và đánh giá mức độ tuân thủ</p>
            </div>
          </div>
        ) : (
          <div className="bg-white w-[800px] min-h-[1100px] shadow-2xl rounded-sm p-[60px] flex flex-col space-y-8 animate-in zoom-in-95 duration-500 origin-top">
            {/* Header Document */}
            <div className="flex justify-between items-start border-b-2 border-brand-500 pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-500 rounded flex items-center justify-center text-white">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-gray-900 leading-tight">BAN KIỂM SOÁT NỘI BỘ</h2>
                  <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">TỔNG CÔNG TY THĂM DÒ KHAI THÁC DẦU KHÍ</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-900">Mã báo cáo: BC-KSNB-{selectedYear}</p>
                <p className="text-[10px] text-gray-400">Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>
              </div>
            </div>

            <div className="text-center py-8">
              <h1 className="text-2xl font-black text-gray-900 uppercase">BÁO CÁO TỔNG HỢP KẾT QUẢ RÀ SOÁT PHIẾU Ý KIẾN</h1>
              <p className="text-sm font-bold text-gray-500 mt-2 italic">Giai đoạn: Toàn năm {selectedYear}</p>
            </div>

            {/* Content I */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-600 flex items-center gap-2 border-l-4 border-brand-500 pl-3">
                I. TỔNG QUAN TÌNH HÌNH THỰC HIỆN
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Trong năm {selectedYear}, Ban Kiểm soát nội bộ (KSNB) đã tiếp nhận và xử lý tổng cộng <b>{totalTickets}</b> Phiếu ý kiến (PYK) từ các Ban/Đơn vị thành viên. 
                Tỷ lệ hoàn thành rà soát đạt mức cao, phản ánh sự nỗ lực trong công tác giám sát và hỗ trợ nghiệp vụ.
              </p>
              
              <div className="grid grid-cols-3 gap-4 py-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tổng phiếu rà soát</p>
                  <p className="text-2xl font-black text-brand-600">{totalTickets}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Hoàn thành đúng hạn</p>
                  <p className="text-2xl font-black text-blue-600">{((onTimeTickets/totalTickets)*100).toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Tỷ lệ quá hạn</p>
                  <p className="text-2xl font-black text-red-500">{((overdueTickets/totalTickets)*100).toFixed(1)}%</p>
                </div>
              </div>
            </section>

            {/* Content II */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-600 flex items-center gap-2 border-l-4 border-brand-500 pl-3">
                II. PHÂN TÍCH CÁC VẤN ĐỀ VÀ LỖI THƯỜNG GẶP
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Qua công tác rà soát nội dung tại bước 3 của quy trình, Ban KSNB đã bóc tách và thống kê các nhóm lỗi phổ biến nhất. 
                Dưới đây là biểu đồ phân bổ các sai sót trọng yếu được phát hiện:
              </p>
              
              <div className="h-[280px] w-full bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={errorData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#27AF49" radius={[0, 4, 4, 0]} label={{ position: 'right', fontSize: 10, fontWeight: 'bold' }}>
                      {errorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-orange-50 p-5 rounded-xl border border-orange-100 space-y-3">
                <h4 className="text-xs font-black text-orange-700 flex items-center gap-2 uppercase">
                  <AlertTriangle size={14} /> Điểm nóng cần lưu ý:
                </h4>
                <ul className="text-xs text-orange-900 space-y-2">
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span><b>Lỗi thẩm quyền:</b> Chiếm 12 trường hợp nhưng mức độ rủi ro <b>Rất cao</b> do vi phạm quy chế phân cấp.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold">•</span>
                    <span><b>Chậm tiến độ:</b> Là vấn đề thường trực nhất (65 vụ), cần cải thiện khâu tiếp nhận thông tin đầu vào.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Content III */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-brand-600 flex items-center gap-2 border-l-4 border-brand-500 pl-3">
                III. ĐÁNH GIÁ MỨC ĐỘ GIÁM SÁT CỦA BAN KSNB
              </h3>
              
              <div className="flex gap-6 items-center bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-20 h-20 bg-brand-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-brand-100">
                    <span className="text-2xl font-black">8.5</span>
                  </div>
                  <p className="text-[10px] font-bold text-brand-700 mt-2 uppercase">Điểm Compliance</p>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Award size={18} className="text-brand-500" />
                    <h4 className="font-bold text-gray-900">Đánh giá chung: Rất tốt</h4>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Công tác giám sát của Ban KSNB đã được thực hiện một cách <b>chặt chẽ và minh bạch</b>. 
                    Việc áp dụng Checklist tự động theo từng lĩnh vực đã giúp giảm thiểu 40% sai sót do yếu tố chủ quan và rút ngắn thời gian rà soát trung bình xuống còn 1.2 ngày/phiếu.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-100 rounded-xl space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Ưu điểm nổi bật</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li className="flex gap-2"><CheckCircle size={10} className="text-brand-500 shrink-0 mt-0.5" /> Chế độ báo cáo Real-time</li>
                    <li className="flex gap-2"><CheckCircle size={10} className="text-brand-500 shrink-0 mt-0.5" /> Kiểm soát chéo giữa các cấp KSV</li>
                  </ul>
                </div>
                <div className="p-4 border border-gray-100 rounded-xl space-y-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase">Kiến nghị cải tiến</p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li className="flex gap-2"><TrendingUp size={10} className="text-brand-500 shrink-0 mt-0.5" /> Tăng cường đào tạo lỗi thẩm quyền</li>
                    <li className="flex gap-2"><TrendingUp size={10} className="text-brand-500 shrink-0 mt-0.5" /> Số hóa 100% hồ sơ minh chứng</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Footer Signature */}
            <div className="pt-12 grid grid-cols-2 text-center">
              <div></div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-900 uppercase">Trưởng Ban Kiểm soát Nội bộ</p>
                <p className="text-[10px] text-gray-500 italic">(Ký và ghi rõ họ tên)</p>
                <div className="h-20"></div>
                <p className="text-sm font-black text-gray-900">Đoàn Thái Việt</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
