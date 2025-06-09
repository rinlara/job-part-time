import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainMenu from "../MainMenu";
import "./Applications.css";

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // โหลดข้อมูลใบสมัครจาก API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("กรุณาเข้าสู่ระบบก่อน");
          navigate("/login/employer");
          return;
        }

        const response = await fetch("http://localhost:8080/api/employer/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลใบสมัครได้");
        }

        const data = await response.json();
        setApplications(data);
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        alert("ไม่สามารถโหลดข้อมูลใบสมัครได้");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  // อัปเดตสถานะใบสมัคร
  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/api/employer/applications/${applicationId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("ไม่สามารถอัปเดตสถานะได้");

      const updatedApplication = await response.json();

      setApplications((prev) =>
        prev.map((app) =>
          app.application_id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      alert("อัปเดตสถานะสำเร็จ!");
    } catch (err) {
      alert("ไม่สามารถอัปเดตสถานะได้");
      console.error("Error updating application:", err);
    }
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate("/employer/dashboard")}>
          กลับแดชบอร์ด
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>จัดการใบสมัครงาน</h1>
          <p>ตรวจสอบและจัดการใบสมัครงานที่ส่งเข้ามาในจังหวัดมหาสารคาม</p>
        </div>
      </section>

      {/* Dashboard Layout */}
      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <h3>หน้าสมาชิก</h3>
              <ul>
                <li><Link to="/employer/dashboard">Dashboard</Link></li>
                <li><Link to="/employer/post-job">ลงประกาศงานใหม่</Link></li>
                <li><Link to="/employer/manage-jobs">รายการตำแหน่งงาน</Link></li>
                <li className="active"><Link to="/employer/applications">จัดการใบสมัครงาน iCMS</Link></li>
                <li><Link to="/employer/reports">รายงาน</Link></li>
                <li><Link to="/employer/settings">ตั้งค่า</Link></li>
                <li>
                  <button onClick={() => navigate("/login/employer")}>
                    ออกจากระบบ
                  </button>
                </li>
              </ul>
            </aside>

            {/* Content Area */}
            <main className="content">
              <div className="breadcrumb">
                <span>หน้าสมาชิก → จัดการใบสมัครงาน</span>
              </div>

              <div className="table-header">
                <h2>จัดการใบสมัครงาน</h2>
                <p>แสดงใบสมัครงานทั้งหมดจากตำแหน่งงานในมหาสารคาม</p>
              </div>

              {/* Application Table */}
              <div className="application-table-container">
                <table className="application-table">
                  <thead>
                    <tr>
                      <th>รูป</th>
                      <th>ชื่อผู้สมัคร</th>
                      <th>ตำแหน่งงาน</th>
                      <th>วันที่สมัคร</th>
                      <th>สถานะ</th>
                      <th>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length > 0 ? (
                      applications.map((app) => (
                        <tr key={app.application_id}>
                          <td>
                            <img
                              src={app.image ? `http://localhost:8080${app.image}` : "/default-profile.png"}
                              alt={app.full_name}
                              className="applicant-image"
                              onError={(e) => {
                                e.target.src = "/default-profile.png"; // fallback หากไม่มีรูป
                              }}
                            />
                          </td>
                          <td>{app.full_name}</td>
                          <td>{app.job_title}</td>
                          <td>
                            {new Date(app.application_date).toLocaleDateString("th-TH")}
                          </td>
                          <td>
                            <span
                              className={`status-tag ${
                                app.status === "pending"
                                  ? "pending"
                                  : app.status === "accepted"
                                  ? "accepted"
                                  : "rejected"
                              }`}
                            >
                              {app.status === "pending"
                                ? "รอการตอบกลับ"
                                : app.status === "accepted"
                                ? "รับแล้ว"
                                : "ปฏิเสธ"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() =>
                                  navigate(`/employer/applications/${app.application_id}`)
                                }
                                className="btn-view"
                              >
                                ดูรายละเอียด
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(app.application_id, "accepted")
                                }
                                disabled={app.status === "accepted"}
                                className="btn-accept"
                              >
                                รับเข้าทำงาน
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(app.application_id, "rejected")
                                }
                                disabled={app.status === "rejected"}
                                className="btn-reject"
                              >
                                ปฏิเสธ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" style={{ textAlign: "center" }}>
                          ยังไม่มีใบสมัครเข้ามา
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </main>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <div className="footer-columns">
            <div className="footer-column">
              <h4>ติดต่อเรา</h4>
              <p>
                โทร : 04-XXX-XXXX<br />
                อีเมล : support@parttimemahasarakham.com
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2025 PartTimeMahasarakham.com | สงวนลิขสิทธิ์</p>
            <div className="policy-links">
              <a href="#">นโยบายความเป็นส่วนตัว</a>
              <a href="#">นโยบายคุกกี้</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}