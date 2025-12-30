import React, { useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TicketList from "./pages/TicketList";
import TicketDetail from "./pages/TicketDetail";
import TicketForm from "./pages/TicketForm";
import ChecklistConfig from "./pages/ChecklistConfig";
import ErrorConfig from "./pages/ErrorConfig";
import ReportPage from "./pages/ReportPage";
import ChatbotPage from "./pages/ChatbotPage";

import { saveTestData } from "./saveToFirebase";

const App: React.FC = () => {
  useEffect(() => {
    // Chỉ chạy 1 lần để test kết nối Firestore
    saveTestData();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets/new" element={<TicketForm />} />
          <Route path="/tickets/:id" element={<TicketDetail />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/checklist-config" element={<ChecklistConfig />} />
          <Route path="/error-config" element={<ErrorConfig />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
