import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import MainMenu from "../../components/MainMenu";
import "./PostJobForm.css";

export default function PostJobForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // หากมี id → อัปเดตงาน
  const [formData, setFormData] = useState({
    shop_name: "", // ✅ เพิ่มฟิลด์ชื่อร้าน
    title: "",
    category: "",
    job_type: "",
    position_count: "",
    start_time: "",
    end_time: "",
    location: "",
    district: "",
    postal_code: "",
    min_salary: "",
    max_salary: "",
    hide_salary: false,
    description: "",
    requirements: "",
    no_experience: false,
    disabled_friendly: false,
    toeic_required: false,
    closing_date: "",
    urgent: false,
    image: null,
  });
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  // โหลดข้อมูลงานเก่า (หากมี id)
  useEffect(() => {
    if (!id) return;
    const fetchJobData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:8080/api/employer/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลงานได้");
        const data = await response.json();

        setFormData({
          shop_name: data.shop_name || "", // ✅ โหลดข้อมูลจาก backend
          title: data.title || "",
          category: data.category || "",
          job_type: data.job_type || "",
          position_count: data.position_count || "",
          start_time: data.start_time || "",
          end_time: data.end_time || "",
          location: data.location || "",
          district: data.district || "",
          postal_code: data.postal_code || "",
          min_salary: data.min_salary || "",
          max_salary: data.max_salary || "",
          hide_salary: Boolean(data.hide_salary),
          description: data.description || "",
          requirements: data.requirements || "",
          no_experience: Boolean(data.no_experience),
          disabled_friendly: Boolean(data.disabled_friendly),
          toeic_required: Boolean(data.toeic_required),
          closing_date: data.closing_date?.split("T")[0] || "",
          urgent: Boolean(data.urgent),
          image: null,
        });
      } catch (err) {
        console.error("Error fetching job:", err);
        alert("ไม่สามารถโหลดข้อมูลงานได้");
        navigate("/login/employer");
      } finally {
        setLoading(false);
      }
    };
    fetchJobData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const url = id
      ? `http://localhost:8080/api/employer/jobs/${id}`
      : "http://localhost:8080/api/employer/post-job";
    const method = id ? "PUT" : "POST";
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("กรุณาเข้าสู่ระบบก่อน");
        navigate("/login/employer");
        return;
      }
      const body = new FormData();
      body.append("shop_name", formData.shop_name); // ✅ ส่งชื่อร้านไปด้วย
      body.append("title", formData.title);
      body.append("category", formData.category);
      body.append("job_type", formData.job_type);
      body.append("position_count", formData.position_count);
      body.append("start_time", formData.start_time);
      body.append("end_time", formData.end_time);
      body.append("location", formData.location);
      body.append("district", formData.district);
      body.append("postal_code", formData.postal_code);
      body.append("min_salary", formData.min_salary);
      body.append("max_salary", formData.max_salary);
      body.append("hide_salary", formData.hide_salary ? 1 : 0);
      body.append("description", formData.description);
      body.append("requirements", formData.requirements);
      body.append("no_experience", formData.no_experience ? 1 : 0);
      body.append("disabled_friendly", formData.disabled_friendly ? 1 : 0);
      body.append("toeic_required", formData.toeic_required ? 1 : 0);
      body.append("closing_date", formData.closing_date);
      body.append("urgent", formData.urgent ? 1 : 0);
      if (formData.image) {
        body.append("image", formData.image);
      }

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "ไม่สามารถบันทึกข้อมูลได้");
      }

      alert(id ? "อัปเดตงานสำเร็จ!" : "ลงประกาศงานสำเร็จ!");
      navigate("/employer/manage-jobs");
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <h1>{id ? "แก้ไขตำแหน่งงาน" : "ลงประกาศงานใหม่"}</h1>
          <p>กรอกข้อมูลเพื่อ{id ? "อัปเดต" : "ลง"}ประกาศรับสมัครงานในมหาสารคาม</p>
        </div>
      </section>

      {/* Form Area */}
      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
              <h3>หน้าสมาชิก</h3>
              <ul>
                <li><Link to="/employer/dashboard">Dashboard</Link></li>
                <li className={!id ? "active" : ""}>
                  <Link to="/employer/post-job">{id ? "แก้ไขตำแหน่งงาน" : "ลงประกาศงาน"}</Link>
                </li>
                <li><Link to="/employer/manage-jobs">รายการตำแหน่งงาน</Link></li>
                <li><Link to="/employer/applications">จัดการใบสมัครงาน iCMS</Link></li>
                <li><Link to="/employer/reports">รายงาน</Link></li>
                <Link to="/employer/settings">ตั้งค่า</Link>
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
                <span>หน้าสมาชิก → {id ? "แก้ไขตำแหน่งงาน" : "ลงประกาศงาน"}</span>
              </div>

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {/* ชื่อร้าน */}
                <div className="form-group">
                  <label>ชื่อร้าน *</label>
                  <input
                    type="text"
                    name="shop_name"
                    placeholder="เช่น ร้านกาแฟยามเย็น"
                    required
                    value={formData.shop_name}
                    onChange={handleChange}
                  />
                </div>

                {/* ชื่อตำแหน่งงาน */}
                <div className="form-group">
                  <label>ชื่อตำแหน่งงาน *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                {/* หมวดหมู่งาน */}
                <div className="form-group">
                  <label>หมวดหมู่งาน *</label>
                  <select
                    name="category"
                    required
                    onChange={handleChange}
                    value={formData.category}
                  >
                    <option value="">เลือก...</option>
                    <option value="retail">ร้านอาหาร</option>
                    <option value="restaurant">ร้านสะดวกซื้อ</option>
                    <option value="tech">ร้านเหล้า</option>
                    <option value="others">อื่น ๆ</option>
                  </select>
                </div>

                {/* ประเภทงาน */}
                <div className="form-group">
                  <label>ประเภทงาน *</label>
                  <select
                    name="job_type"
                    required
                    onChange={handleChange}
                    value={formData.job_type}
                  >
                    <option value="">เลือก...</option>
                    <option value="part-time">พาร์ทไทม์</option>
                    <option value="full-time">งานประจำ</option>
                  </select>
                </div>

                {/* จำนวนอัตรา */}
                <div className="form-group">
                  <label>จำนวนอัตราที่รับ *</label>
                  <input
                    type="number"
                    name="position_count"
                    placeholder="เช่น 5"
                    required
                    value={formData.position_count}
                    onChange={handleChange}
                  />
                </div>

                {/* เวลาทำงาน */}
                <div className="form-group">
                  <label>เวลาทำงาน</label>
                  <div className="time-fields">
                    <input
                      type="text"
                      name="start_time"
                      placeholder="เช่น 17:00"
                      value={formData.start_time}
                      onChange={handleChange}
                    />
                    <span> - </span>
                    <input
                      type="text"
                      name="end_time"
                      placeholder="เช่น 22:00"
                      value={formData.end_time}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* สถานที่ปฏิบัติงาน */}
                <div className="form-group">
                  <label>สถานที่ปฏิบัติงาน</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="ตำบล, อำเภอ, จังหวัด"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                {/* อำเภอ */}
                <div className="form-group">
                  <label>อำเภอ *</label>
                  <select
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleChange}
                  >
                    <option value="">เลือก...</option>
                    <option value="muang">เมืองมหาสารคาม</option>
                    <option value="kosumphisai">โกสุมพิสัย</option>
                    <option value="wapi">วาปีปทุม</option>
                    <option value="borabue">บรบือ</option>
                    <option value="nadun">นาเชือก</option>
                    <option value="kuchinarai">พยัคฆภูมิพิสัย</option>
                    <option value="kaengsanam">แกดำ</option>
                    <option value="kantharawichai">กันทรวิชัย</option>
                    <option value="chiangyuen">เชียงยืน</option>
                    <option value="kayang">ยางสีสุราช</option>
                    <option value="kudwala">กุดรัง</option>
                    <option value="nachuak">นาดูน</option>
                  </select>
                </div>

                {/* รหัสไปรษณีย์ */}
                <div className="form-group">
                  <label>รหัสไปรษณีย์</label>
                  <input
                    type="text"
                    name="postal_code"
                    placeholder="เช่น 45000"
                    value={formData.postal_code}
                    onChange={handleChange}
                  />
                </div>

                {/* เงินเดือน */}
                <div className="form-group">
                  <label>เงินเดือน</label>
                  <div className="salary-fields">
                    <input
                      type="number"
                      name="min_salary"
                      placeholder="ชั่วโมงละ เช่น 40 บาท"
                      value={formData.min_salary}
                      onChange={handleChange}
                    />
                    <span>บาท</span>
                    {!formData.hide_salary && (
                      <input
                        type="number"
                        name="max_salary"
                        placeholder="สูงสุด เช่น 60 บาท"
                        value={formData.max_salary}
                        onChange={handleChange}
                      />
                    )}
                    <label>
                      <input
                        type="checkbox"
                        name="hide_salary"
                        checked={formData.hide_salary}
                        onChange={handleChange}
                      />
                      ไม่แสดงเงินเดือน
                    </label>
                  </div>
                </div>

                {/* รายละเอียดงาน */}
                <div className="form-group">
                  <label>รายละเอียดงาน</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="ระบุหน้าที่และความรับผิดชอบ"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* คุณสมบัติผู้สมัคร */}
                <div className="form-group">
                  <label>คุณสมบัติผู้สมัคร</label>
                  <textarea
                    name="requirements"
                    rows="4"
                    placeholder="ระบุคุณสมบัติ เช่น มีใจบริการ"
                    value={formData.requirements}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* ตัวเลือกการรับสมัคร */}
                <div className="form-group">
                  <label>ตัวเลือกการรับสมัคร</label>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        name="no_experience"
                        checked={formData.no_experience}
                        onChange={handleChange}
                      />
                      ยินดีรับผู้ไม่มีประสบการณ์
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="disabled_friendly"
                        checked={formData.disabled_friendly}
                        onChange={handleChange}
                      />
                      ยินดีรับคนพิการ
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="toeic_required"
                        checked={formData.toeic_required}
                        onChange={handleChange}
                      />
                      ต้องการ TOEIC
                    </label>
                  </div>
                </div>

                {/* วันที่ปิดรับสมัคร */}
                <div className="form-group">
                  <label>วันที่ปิดรับสมัคร *</label>
                  <input
                    type="date"
                    name="closing_date"
                    required
                    value={formData.closing_date}
                    onChange={handleChange}
                  />
                </div>

                {/* งานด่วน */}
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      name="urgent"
                      checked={formData.urgent}
                      onChange={handleChange}
                    />
                    เป็นงานด่วน
                  </label>
                </div>

                {/* อัปโหลดรูปภาพ */}
                <div className="form-group">
                  <label>อัปโหลดรูปภาพร้านค้า / โลโก้บริษัท</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {formData.image && <p>ไฟล์ที่เลือก: {formData.image.name}</p>}
                </div>

                {/* ปุ่มส่งฟอร์ม */}
                <div className="form-actions">
                  <button type="submit" className="btn-submit" disabled={loading}>
                    {loading ? "กำลังบันทึก..." : id ? "อัปเดตประกาศงาน" : "ยืนยันประกาศงาน"}
                  </button>
                  <button type="reset" className="btn-cancel" disabled={loading}>
                    ยกเลิก
                  </button>
                </div>
              </form>
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