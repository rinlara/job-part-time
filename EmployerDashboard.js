import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import MainMenu from "../../components/MainMenu";
import "./EmployerDashboard.css";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editCompanyData, setEditCompanyData] = useState({});

  // โหลดข้อมูลแดชบอร์ดจาก API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("กรุณาเข้าสู่ระบบก่อน");
          navigate("/login/employer");
          return;
        }

        const response = await fetch("http://localhost:8080/api/employer/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลแดชบอร์ดได้");
        }

        const data = await response.json();
        console.log("Dashboard Data:", data);

        setDashboardData(data);
        setEditCompanyData({
          companyName: data.company?.company_name || "",
          contactName: data.company?.contact_name || "",
          phone: data.company?.phone || "",
          email: data.company?.email || "",
          address: data.company?.address || "",
          district: data.company?.district || "",
          province: data.company?.province || "",
          postalCode: data.company?.postal_code || "",
        });
      } catch (err) {
        console.error("Error fetching dashboard:", err.message);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
        navigate("/login/employer");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // เมื่อกดปุ่ม "แก้ไข"
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // เมื่อกด "ยกเลิก" หรือ "บันทึก"
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditCompanyData({
      companyName: dashboardData.company?.company_name || "",
      contactName: dashboardData.company?.contact_name || "",
      phone: dashboardData.company?.phone || "",
      email: dashboardData.company?.email || "",
      address: dashboardData.company?.address || "",
      district: dashboardData.company?.district || "",
      province: dashboardData.company?.province || "",
      postalCode: dashboardData.company?.postal_code || ""
    });
  };

  // เมื่อ input ข้อมูลเปลี่ยน
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditCompanyData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // เมื่อกด "บันทึก" การเปลี่ยนแปลง
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        navigate("/login/employer");
        return;
      }

      const response = await fetch("http://localhost:8080/api/employer/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editCompanyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ไม่สามารถอัปเดตข้อมูลได้");
      }

      const updatedData = await response.json();

      // อัปเดตข้อมูลใน dashboardData
      setDashboardData((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          company_name: editCompanyData.companyName,
          contact_name: editCompanyData.contactName,
          phone: editCompanyData.phone,
          email: editCompanyData.email,
          address: editCompanyData.address,
          district: editCompanyData.district,
          province: editCompanyData.province,
          postal_code: editCompanyData.postalCode
        }
      }));

      setIsEditing(false);
      alert("อัปเดตข้อมูลร้านค้าสำเร็จ!");

    } catch (err) {
      console.error("Error updating profile:", err);
      alert(err.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูลร้านค้า");
    }
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={() => navigate("/login/employer")}>
          ลองเข้าสู่ระบบใหม่
        </button>
      </div>
    );
  }

  if (!dashboardData || !dashboardData.company || !dashboardData.stats) {
    return (
      <div className="error">
        <p>ไม่พบข้อมูลร้านค้าหรือสถิติ</p>
        <button onClick={() => navigate("/login/employer")}>เข้าสู่ระบบใหม่</button>
      </div>
    );
  }

  const { company, stats, recentApplications } = dashboardData;

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>แดชบอร์ดผู้ประกอบการ</h1>
          <p>ยินดีต้อนรับ, {company.company_name}!</p>
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
                <li className="active">
                  <Link to="/employer/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/employer/post-job">ลงประกาศงานใหม่</Link>
                </li>
                <li>
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
                  <button onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login/employer");
                  }}>
                    ออกจากระบบ
                  </button>
                </li>
              </ul>
            </aside>

            {/* Content Area */}
            <main className="content">
              <div className="breadcrumb">
                <span>หน้าสมาชิก → Dashboard</span>
              </div>

              {/* Stats Overview */}
              <div className="dashboard-overview">
                <div className="card">
                  <h3>จำนวนงานทั้งหมด</h3>
                  <p className="stat">{stats.total_jobs || 0}</p>
                </div>
                <div className="card">
                  <h3>งานออนไลน์</h3>
                  <p className="stat">{stats.active_jobs || 0}</p>
                </div>
                <div className="card">
                  <h3>ใบสมัครใหม่</h3>
                  <p className="stat">{stats.new_applications || 0}</p>
                </div>
                <div className="card urgent">
                  <h3>งานด่วน</h3>
                  <p className="stat">{stats.urgent_jobs || 0}</p>
                </div>
              </div>

              {/* Company Info */}
              <div className="company-info">
                <h2>ข้อมูลร้านค้า</h2>

                {isEditing ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>ชื่อร้านค้า:</label>
                      <input
                        type="text"
                        name="companyName"
                        value={editCompanyData.companyName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>ผู้ติดต่อ:</label>
                      <input
                        type="text"
                        name="contactName"
                        value={editCompanyData.contactName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>เบอร์โทรศัพท์:</label>
                      <input
                        type="text"
                        name="phone"
                        value={editCompanyData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>อีเมล:</label>
                      <input
                        type="text"
                        name="email"
                        value={editCompanyData.email}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>ที่อยู่:</label>
                      <input
                        type="text"
                        name="address"
                        value={editCompanyData.address}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>อำเภอ:</label>
                      <input
                        type="text"
                        name="district"
                        value={editCompanyData.district}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>จังหวัด:</label>
                      <input
                        type="text"
                        name="province"
                        value={editCompanyData.province}
                        readOnly
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <label>รหัสไปรษณีย์:</label>
                      <input
                        type="text"
                        name="postalCode"
                        value={editCompanyData.postalCode}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-actions">
                      <button className="btn-save" onClick={handleSave}>
                        บันทึก
                      </button>
                      <button className="btn-cancel" onClick={handleCancelEdit}>
                        ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="info-grid">
                    <div><strong>ชื่อร้านค้า:</strong> {company.company_name}</div>
                    <div><strong>ผู้ติดต่อ:</strong> {company.contact_name}</div>
                    <div><strong>เบอร์โทรศัพท์:</strong> {company.phone}</div>
                    <div><strong>อีเมล:</strong> {company.email}</div>
                    <div>
                      <strong>ที่อยู่:</strong> {company.address}, {company.district}, {company.province}, {company.postal_code}
                    </div>
                    <div>
                      <button onClick={handleEditClick} className="btn-edit">
                        แก้ไขข้อมูลร้านค้า
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Applications */}
              <div className="recent-applications">
                <h2>ใบสมัครล่าสุด</h2>
                {Array.isArray(recentApplications) && recentApplications.length > 0 ? (
                  <ul>
                    {recentApplications.map((app, index) => (
                      <li key={index}>
                        <strong>{app.full_name || "ไม่ระบุ"}</strong> - สมัครงาน "{app.job_title || "ไม่ระบุ"}" เมื่อ{" "}
                        {new Date(app.application_date).toLocaleDateString("th-TH")}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>ไม่มีใบสมัครล่าสุด</p>
                )}
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