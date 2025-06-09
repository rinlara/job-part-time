// src/components/Applicant/SettingsPageApplicant.jsx
import React, { useEffect, useState } from "react";
import "./Applicant.css";

export default function SettingsPageApplicant() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    newsletterEmail: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/applicant/me", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setFormData({
        fullName: data.full_name,
        phone: data.phone,
        newsletterEmail: Boolean(data.newsletter_email),
      });
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch("http://localhost:8080/api/applicant/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const result = await res.json();
    if (res.ok) {
      alert("อัปเดตโปรไฟล์สำเร็จ!");
    } else {
      alert(result.message || "ไม่สามารถอัปเดตโปรไฟล์ได้");
    }
  };

  if (loading) return <p>กำลังโหลดโปรไฟล์...</p>;

  return (
    <div className="settings-page">
      <h2>ตั้งค่าโปรไฟล์</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>ชื่อ-นามสกุล</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>เบอร์โทรศัพท์</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="newsletterEmail"
              checked={formData.newsletterEmail}
              onChange={handleChange}
            />
            รับข่าวสารผ่านอีเมล
          </label>
        </div>

        <button type="submit">บันทึกการตั้งค่า</button>
      </form>
    </div>
  );
}