'use client';
import { useState } from 'react';

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: ''
  });
  const [step, setStep] = useState(1);
  const [patientNumber, setPatientNumber] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // حفظ بيانات المريض في localStorage
    const clinicData = JSON.parse(localStorage.getItem('clinicData') || '{"patients": []}');
    
    const newPatient = {
      id: Date.now().toString(),
      name: formData.name,
      age: formData.age,
      phone: formData.phone,
      status: 'registered', // حالة المريض بعد التسجيل
      registrationTime: new Date().toLocaleString('ar-EG')
    };
    
    clinicData.patients.push(newPatient);
    localStorage.setItem('clinicData', JSON.stringify(clinicData));
    
    // توليد رقم عشوائي للمريض
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    setPatientNumber(randomNumber);
    setStep(2);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      phone: ''
    });
    setStep(1);
    setPatientNumber(null);
  };

  if (step === 1) {
    return (
      <div className="container">
        <div className="card" style={{ maxWidth: '500px', margin: '50px auto' }}>
          <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
            مستشفى الحياة
          </h1>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>تسجيل بيانات المريض</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>الاسم بالكامل *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="أدخل الاسم بالكامل"
              />
            </div>
            
            <div className="form-group">
              <label>العمر *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                required
                placeholder="أدخل العمر"
                min="1"
                max="120"
              />
            </div>
            
            <div className="form-group">
              <label>رقم الهاتف *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="أدخل رقم الهاتف"
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              تسجيل البيانات والمتابعة
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '500px', margin: '50px auto', textAlign: 'center' }}>
        <div style={{ color: '#28a745', fontSize: '80px', marginBottom: '20px' }}>✓</div>
        <h1 style={{ color: '#28a745', marginBottom: '20px' }}>تم التسجيل بنجاح</h1>
        <p style={{ marginBottom: '20px', fontSize: '18px' }}>شكراً لك {formData.name}</p>
        <p style={{ marginBottom: '20px', fontSize: '16px', color: '#666' }}>
          تم تسجيل بياناتك بنجاح في نظام العيادة
        </p>
        <div style={{ 
          backgroundColor: '#e7f3ff', 
          padding: '20px', 
          borderRadius: '10px',
          margin: '20px 0',
          border: '2px solid #007bff'
        }}>
          <p style={{ marginBottom: '10px', fontSize: '16px' }}>رقمك في قائمة الانتظار:</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#007bff' }}>
            #{patientNumber}
          </p>
        </div>
        <p style={{ marginBottom: '20px', fontSize: '14px', color: '#666' }}>
          يرجى التوجه إلى قسم الاستقبال وتقديم هذا الرقم
        </p>
        <button 
          className="btn btn-primary"
          onClick={resetForm}
          style={{ marginRight: '10px' }}
        >
          تسجيل مريض جديد
        </button>
        <button 
          className="btn btn-success"
          onClick={() => window.location.href = '/reception'}
        >
          الانتقال إلى الاستقبال
        </button>
      </div>
    </div>
  );
}