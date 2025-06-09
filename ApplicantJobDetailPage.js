// src/components/Applicant/ApplicantJobDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Applicant.css";

export default function ApplicantJobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/jobs/${id}`);
        if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลงานได้");
        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error(error);
        alert("เกิดข้อผิดพลาดในการโหลดข้อมูลงาน");
        navigate("/");
      }
    };
    fetchJob();
  }, [id, navigate]);

  const applyForJob = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("กรุณาเข้าสู่ระบบก่อนสมัครงาน");

      const applicantId = JSON.parse(atob(token.split('.')[1])).id;

      const res = await fetch("http://localhost:8080/api/applicant/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ job_id: id, applicant_id: applicantId })
      });

      const result = await res.json();
      if (res.ok) {
        setApplied(true);
        alert("สมัครงานสำเร็จ!");
      } else {
        alert(result.message || "ไม่สามารถสมัครงานได้");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการสมัครงาน");
    }
  };

  if (!job) return <p>กำลังโหลดข้อมูลงาน...</p>;

  return (
    <div className="job-detail-container">
      <h1>{job.title}</h1>
      <p><strong>ร้าน:</strong> {job.company_name}</p>
      <p><strong>สถานที่:</strong> {job.district}, {job.province}</p>
      <p><strong>เวลาทำงาน:</strong> {job.start_time} - {job.end_time}</p>
      <p><strong>ค่าตอบแทน:</strong> {job.hide_salary ? "ไม่ระบุ" : `${job.min_salary} - ${job.max_salary} บาท`}</p>
      <p><strong>จำนวนอัตรา:</strong> {job.position_count}</p>
      <p><strong>รายละเอียด:</strong> {job.description}</p>
      <p><strong>คุณสมบัติ:</strong> {job.requirements}</p>

      {!applied ? (
        <button onClick={applyForJob}>สมัครงาน</button>
      ) : (
        <p>คุณได้สมัครงานนี้แล้ว</p>
      )}
    </div>
  );
}
