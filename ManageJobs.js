import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainMenu from "../../components/MainMenu";
import "./ManageJobs.css";

export default function ManageJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ดึงข้อมูลงานจาก API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/api/employer/jobs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("ไม่สามารถดึงข้อมูลงานได้");

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // ฟังก์ชันเปลี่ยนสถานะงาน (active/inactive)
  const handleStatusChange = async (jobId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "active" ? "closed" : "active";

      const response = await fetch(
        `http://localhost:8080/api/employer/jobs/${jobId}`,
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

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );

      alert("อัปเดตสถานะสำเร็จ!");
    } catch (err) {
      alert("ไม่สามารถอัปเดตสถานะได้");
      console.error("Error updating job status:", err);
    }
  };

  // ฟังก์ชันลบตำแหน่งงาน
  const handleDeleteJob = async (jobId) => {
    const confirmDelete = window.confirm("คุณแน่ใจว่าต้องการลบตำแหน่งงานนี้?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/api/employer/jobs/${jobId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("ไม่สามารถลบตำแหน่งงานได้");

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));

      alert("ลบตำแหน่งงานสำเร็จ!");
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการลบตำแหน่งงาน");
      console.error("Error deleting job:", err);
    }
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return (
      <div>
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
          <h1>เว็บหางานพาร์ทไทม์ในมหาสารคาม</h1>
          <p>บริหารประกาศงานได้อย่างมีประสิทธิภาพ</p>
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
                <li>
                  <Link to="/employer/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/employer/post-job">ลงประกาศงานใหม่</Link>
                </li>
                <li className="active">
                  <Link to="/employer/manage-jobs">รายการตำแหน่งงาน</Link>
                </li>
                <li>
                  <Link to="/employer/applications">จัดการใบสมัครงาน iCMS</Link>
                </li>
                <li>
                  <Link to="/employer/reports">รายงาน</Link>
                </li>
                <li>
                  <Link to="/employer/settings">ตั้งค่า</Link>
                </li>
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
                <span>หน้าสมาชิก → รายการตำแหน่งงาน</span>
              </div>

              <div className="table-header">
                <h2>รายการตำแหน่งงาน</h2>
                <p>แสดงตำแหน่งงานทั้งหมดที่อยู่ในจังหวัดมหาสารคาม</p>
              </div>

              {/* Job Table */}
              <div className="job-table-container">
                <table className="job-table">
                  <thead>
                    <tr>
                      <th>ตำแหน่งงาน</th>
                      <th>วันที่ลงประกาศ</th>
                      <th>วันที่ปิดรับสมัคร</th>
                      <th>สถานะ</th>
                      <th>การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.length > 0 ? (
                      jobs.map((job) => (
                        <tr key={job.id}>
                          <td>{job.title}</td>
                          <td>
                            {new Date(job.created_at).toLocaleDateString("th-TH")}
                          </td>
                          <td>
                            {new Date(job.closing_date).toLocaleDateString("th-TH")}
                          </td>
                          <td>
                            <span className={`status-tag ${job.status}`}>
                              {job.status === "active" ? "ออนไลน์" : "ออฟไลน์"}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {/* ปุ่มแก้ไข */}
                              <Link to={`/employer/post-job/${job.id}`} className="btn-edit">
                                แก้ไข
                              </Link>

                              {/* ปุ่มเปลี่ยนสถานะ */}
                              <button
                                onClick={() => handleStatusChange(job.id, job.status)}
                                className={
                                  job.status === "active"
                                    ? "btn-offline"
                                    : "btn-online"
                                }
                              >
                                {job.status === "active" ? "ออฟไลน์" : "ออนไลน์"}
                              </button>

                              {/* ปุ่มลบ */}
                              <button
                                onClick={() => handleDeleteJob(job.id)}
                                className="btn-delete"
                              >
                                ลบ
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: "center" }}>
                          ไม่มีตำแหน่งงานในจังหวัดมหาสารคาม
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="action-footer">
                <p>เครดิตคงเหลือ: 0 เครดิต</p>
                <p>
                  เพื่อประโยชน์สูงสุดในการประกาศงานของท่าน ควรอัปเดตตำแหน่งงานทุกวัน
                  เพื่อเพิ่มโอกาสให้ผู้สมัครเห็นตำแหน่งงานของท่าน
                </p>
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