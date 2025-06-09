// src/pages/Employer/NotificationSettingsPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotificationSettingsPage.css";

export default function NotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    jobApplication: true,
    jobUpdate: false,
    newsletterEmail: true,
    newsletterSms: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // โหลดการตั้งค่าจาก backend เมื่อเข้าหน้า
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("กรุณาเข้าสู่ระบบ");
          navigate("/login/employer");
          return;
        }

        const response = await fetch("http://localhost:8080/api/employer/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("ไม่สามารถโหลดการตั้งค่าได้");

        const data = await response.json();

        setSettings((prev) => ({
          ...prev,
          newsletterEmail: data.company?.newsletter_email === 1,
          newsletterSms: data.company?.newsletter_sms === 1,
          jobApplication: data.company?.receive_job_applications === 1,
          jobUpdate: data.company?.receive_job_updates === 1,
        }));
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบ");
        navigate("/login/employer");
        return;
      }

      const response = await fetch("http://localhost:8080/api/employer/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receive_job_applications: settings.jobApplication ? 1 : 0,
          receive_job_updates: settings.jobUpdate ? 1 : 0,
          newsletter_email: settings.newsletterEmail ? 1 : 0,
          newsletter_sms: settings.newsletterSms ? 1 : 0,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "เกิดข้อผิดพลาดในการบันทึก");
      }

      alert("บันทึกการตั้งค่าการแจ้งเตือนสำเร็จ!");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="notification-settings-container">
      <h2>ตั้งค่าการแจ้งเตือน</h2>
      {loading && <p>กำลังโหลดการตั้งค่า...</p>}
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="notification-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="jobApplication"
              checked={settings.jobApplication}
              onChange={handleChange}
            />
            รับการแจ้งเตือนเมื่อมีใบสมัครงานใหม่
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="jobUpdate"
              checked={settings.jobUpdate}
              onChange={handleChange}
            />
            รับการอัปเดตเกี่ยวกับประกาศงานของคุณ
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="newsletterEmail"
              checked={settings.newsletterEmail}
              onChange={handleChange}
            />
            รับข่าวสารและโปรโมชั่นทางอีเมล
          </label>
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="newsletterSms"
              checked={settings.newsletterSms}
              onChange={handleChange}
            />
            รับข่าวสารและโปรโมชั่นทาง SMS
          </label>
        </div>

        <button type="submit" className="save-button" disabled={loading}>
          {loading ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
        </button>
      </form>
    </div>
  );
}