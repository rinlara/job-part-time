import React, { useEffect, useState } from "react";
import "./Applicant.css";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("กรุณาเข้าสู่ระบบ");

        const response = await fetch("http://localhost:8080/api/employer/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "ไม่สามารถโหลดข้อมูลใบสมัครได้");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message);
        console.error("Error loading applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูลใบสมัครงาน...</p>;

  if (error)
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>ลองใหม่</button>
      </div>
    );

  return (
    <div className="my-applications">
      <h2>ใบสมัครงานล่าสุด</h2>

      {applications.length === 0 ? (
        <p>ยังไม่มีใบสมัครงานเข้ามาเลย</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.application_id} className="application-card">
              <strong>{app.full_name}</strong> - สมัครงาน "{app.job_title}"
              <br />
              <em>เมื่อ: {new Date(app.application_date).toLocaleDateString("th-TH")}</em>
              <span className={`status ${app.status}`}>{app.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}