// src/components/Applicant/ApplyJobPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ApplyJobPage() {
  const { id } = useParams(); // jobId จาก URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    experience: "",
    skills: ""
  });
  const [resume, setResume] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const url = "http://localhost:8080/api/applicant/apply";

    const data = new FormData();
data.append("job_id", id); // ✅ เพิ่มตรงนี้
data.append("full_name", formData.full_name);
data.append("phone", formData.phone);
data.append("email", formData.email);
data.append("experience", formData.experience);
data.append("skills", formData.skills);

if (resume) {
  data.append("resume", resume);
}
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "เกิดข้อผิดพลาด");

      navigate("/success"); // เปลี่ยนเส้นทางไปหน้า Success
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="apply-job-container">
      <div className="apply-card">
        <h2 className="apply-title">กรอกข้อมูลเพื่อสมัครงาน</h2>

        <form onSubmit={(e) => e.preventDefault()} className="apply-form">
          <div className="form-group">
            <label>ชื่อ-นามสกุล:</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="ชื่อ-นามสกุล"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>เบอร์โทร:</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="0812345678"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>ประสบการณ์:</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="เล่าเกี่ยวกับประสบการณ์ของคุณ..."
              className="form-control"
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label>ทักษะ:</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="เช่น การสื่อสาร, Microsoft Office"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label>อัปโหลดเรซูเม่:</label>
            <input
              type="file"
              onChange={(e) => setResume(e.target.files[0])}
              accept=".pdf,.doc,.docx"
              className="form-control-file"
            />
          </div>

          {error && <p className="text-danger mt-3">{error}</p>}

          <div className="button-group mt-4">
            <button type="button" onClick={handleSubmit} className="btn btn-primary">
              ส่งใบสมัคร
            </button>
            <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary ms-2">
              กลับ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}