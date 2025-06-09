// src/pages/Applicant/DashboardApplicant.jsx

import React, { useEffect, useState } from "react";
import FeaturedJobs from "../../components/FeaturedJobs";
import { Link } from "react-router-dom";
import MainMenu from "../../components/MainMenu";
import "./Applicant.css";
export default function DashboardApplicant() {
  const [jobs, setJobs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login/applicant"; // หากไม่มี token → Redirect ไป login
        return;
      }

      try {
        // ดึงโปรไฟล์ผู้ใช้งาน
        const userRes = await fetch("http://localhost:8080/api/applicant/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) throw new Error("ไม่สามารถโหลดโปรไฟล์ได้");

        const userData = await userRes.json();
        setUser(userData);

        // ดึงงานแนะนำ
        const jobsRes = await fetch("http://localhost:8080/api/jobs");
        if (!jobsRes.ok) throw new Error("ไม่สามารถโหลดงานได้");

        const jobsData = await jobsRes.json();
        setJobs(jobsData);

      } catch (err) {
        console.error("Error fetching data:", err.message);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">กำลังโหลดแดชบอร์ด...</div>;
  }

  return (
    <>
 

      {/* Hero Section */}
      <section className="dashboard-hero">
        <div className="container">
          <h1>สวัสดี {user?.full_name || "ผู้สมัครงาน"}!</h1>
          <p>เริ่มสมัครงานในมหาสารคามได้เลย</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="dashboard-content">
        <div className="container">
          <h2>งานที่แนะนำสำหรับคุณ</h2>

          {error && <p className="error">{error}</p>}

          {jobs.length > 0 ? (
            <FeaturedJobs jobs={jobs} />
          ) : (
            <div className="no-jobs">
              <p>ขณะนี้ยังไม่มีตำแหน่งงานที่เปิดรับอยู่</p>
              <button className="btn-refresh" onClick={() => window.location.reload()}>
                ลองอีกครั้ง
              </button>
            </div>
          )}

          {/* Quick Links */}
          <div className="quick-links">
            <h3>เริ่มต้นหางาน</h3>
            <ul>
              <li><Link to="/search-jobs">ค้นหางานตามสาขาอาชีพ</Link></li>
              <li><Link to="/guide/resume">เขียนประวัติการทำงานให้โดดเด่น</Link></li>
              <li><Link to="/applicant/my-applications">ดูใบสมัครของฉัน</Link></li>
              <li><Link to="/applicant/settings">ตั้งค่าโปรไฟล์</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2025 PartTimeMahasarakham.com | สงวนลิขสิทธิ์</p>
        </div>
      </footer>
    </>
  );
}