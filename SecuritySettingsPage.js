// src/components/Employer/SecuritySettingsPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // เพิ่ม Link เข้ามาด้วย
import "./SecuritySettingsPage.css";

export default function SecuritySettingsPage() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบ");
        navigate("/login/employer");
        return;
      }

      const response = await fetch("http://localhost:8080/api/employer/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      }

      alert("เปลี่ยนรหัสผ่านสำเร็จ!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError(err.message);
      alert(err.message);
    }
  };

  return (
    <div className="settings-page">
      {/* Hero Section */}
      <section className="settings-hero">
        <div className="container">
          <h1>ตั้งค่าความปลอดภัย</h1>
          <p>จัดการข้อมูลบัญชีของคุณ</p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="settings-section">
        <div className="container">
          <div className="settings-layout">
            {/* Sidebar */}
            <aside className="settings-sidebar">
              <ul>
                <li><Link to="/employer/settings">ข้อมูลบัญชี</Link></li>
                <li className="active"><Link to="/employer/settings/security">ความปลอดภัย</Link></li>
                <li><Link to="/employer/settings/notifications">การแจ้งเตือน</Link></li>
              </ul>
            </aside>

            {/* Main Content */}
            <main className="settings-main">
              <form onSubmit={handleSubmit} className="security-form">
                <h2>ตั้งค่าความปลอดภัย</h2>
                {error && <p className="error-message">{error}</p>}

                <div className="form-group">
                  <label htmlFor="current_password">รหัสผ่านปัจจุบัน *</label>
                  <input
                    type="password"
                    id="current_password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="new_password">รหัสผ่านใหม่ *</label>
                  <input
                    type="password"
                    id="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirm_password">ยืนยันรหัสผ่านใหม่ *</label>
                  <input
                    type="password"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="save-button">บันทึกการเปลี่ยนแปลง</button>
              </form>
            </main>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2025 PartTimeMahasarakham.com | สงวนลิขสิทธิ์</p>
        </div>
      </footer>
    </div>
  );
}