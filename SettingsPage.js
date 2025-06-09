// src/components/Employer/SettingsPage.js

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./SettingsPage.css";

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    shop_name: "",
    full_name: "",
    email: "",
    phone: "",
    receive_notifications: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // โหลดข้อมูลโปรไฟล์จาก backend เมื่อเข้าหน้า
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("ไม่มี token");

        const response = await fetch("http://localhost:8080/api/employer/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลโปรไฟล์ได้");

        const data = await response.json();

        setFormData((prev) => ({
          ...prev,
          shop_name: data.company?.company_name || "",
          full_name: data.company?.contact_name || "",
          email: data.company?.email || "",
          phone: data.company?.phone || "",
        }));
      } catch (err) {
        setError(err.message);
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

      const response = await fetch("http://localhost:8080/api/employer/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: formData.shop_name,
          contactName: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          address: "", // ถ้าต้องการอัปเดตเพิ่มเติม
          district: "", // ถ้าต้องการอัปเดตเพิ่มเติม
          postalCode: "", // ถ้าต้องการอัปเดตเพิ่มเติม
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "เกิดข้อผิดพลาดในการอัปเดต");

      alert("บันทึกการตั้งค่าสำเร็จ!");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <section className="settings-hero">
        <div className="container">
          <h1>ตั้งค่า</h1>
          <p>จัดการข้อมูลบัญชีของคุณ</p>
        </div>
      </section>

      <section className="settings-section">
        <div className="container">
          <div className="settings-layout">
            {/* Sidebar */}
            <aside className="settings-sidebar">
              <ul>
                <li><Link to="/employer/settings">ข้อมูลบัญชี</Link></li>
                <li><Link to="/employer/settings/security">ความปลอดภัย</Link></li>
                <li><Link to="/employer/settings/notifications">การแจ้งเตือน</Link></li>
              </ul>
            </aside>

            {/* Main Content */}
            <main className="settings-main">
              <form onSubmit={handleSubmit} className="settings-form">
                <h2>ข้อมูลบัญชี</h2>

                {loading && <p>กำลังโหลดข้อมูล...</p>}
                {error && <p className="error-message">{error}</p>}

                {/* ชื่อร้าน */}
                <div className="form-group">
                  <label htmlFor="shop_name">ชื่อร้าน *</label>
                  <input
                    type="text"
                    id="shop_name"
                    name="shop_name"
                    value={formData.shop_name}
                    onChange={handleChange}
                    placeholder="เช่น ร้านกาแฟยามเย็น"
                    required
                  />
                </div>

                {/* ชื่อผู้ใช้ */}
                <div className="form-group">
                  <label htmlFor="full_name">ชื่อ - นามสกุล *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="เช่น สมชาย ใจดี"
                    required
                  />
                </div>

                {/* อีเมล */}
                <div className="form-group">
                  <label htmlFor="email">อีเมล *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* เบอร์โทรศัพท์ */}
                <div className="form-group">
                  <label htmlFor="phone">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="081-234-5678"
                  />
                </div>

                {/* ปุ่มบันทึก */}
                <button type="submit" className="btn-save" disabled={loading}>
                  {loading ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
                </button>
              </form>

              <hr />

              <div className="security-settings">
                <h3>ความปลอดภัย</h3>
                <p>เปลี่ยนรหัสผ่าน, การเข้าสู่ระบบ</p>
                <button className="btn-secondary" onClick={() => window.location.href = "/employer/settings/security"}>
                  เปลี่ยนรหัสผ่าน
                </button>
              </div>

              <hr />

              <div className="notification-settings">
                <h3>การแจ้งเตือน</h3>
                <label>
                  <input
                    type="checkbox"
                    name="receive_notifications"
                    checked={formData.receive_notifications}
                    onChange={handleChange}
                  />
                  รับการแจ้งเตือนเกี่ยวกับใบสมัครงานใหม่
                </label>
              </div>

              <hr />

              <div className="logout-section">
                <button className="btn-danger" onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login/employer";
                }}>
                  ออกจากระบบ
                </button>
              </div>
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