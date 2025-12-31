'use client';
import { useState, useEffect } from 'react';

export default function ReceptionPage() {
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    phone: ''
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const stored = localStorage.getItem('clinicData');
    if (stored) {
      const data = JSON.parse(stored);
      setPatients(data.patients || []);
    }
  };

  const addNewPatient = (e) => {
    e.preventDefault();
    const stored = localStorage.getItem('clinicData');
    const clinicData = stored ? JSON.parse(stored) : { patients: [] };
    
    const patient = {
      id: Date.now().toString(),
      ...newPatient,
      status: 'arrived',
      arrivalTime: new Date().toLocaleString('ar-EG')
    };
    
    clinicData.patients.push(patient);
    localStorage.setItem('clinicData', JSON.stringify(clinicData));
    setPatients(clinicData.patients);
    setNewPatient({ name: '', age: '', phone: '' });
    
    alert('تم إضافة المريض بنجاح');
  };

  const updatePatientStatus = (patientId, newStatus) => {
    const updatedPatients = patients.map(patient =>
      patient.id === patientId ? { ...patient, status: newStatus } : patient
    );
    
    setPatients(updatedPatients);
    
    const clinicData = JSON.parse(localStorage.getItem('clinicData') || '{}');
    clinicData.patients = updatedPatients;
    localStorage.setItem('clinicData', JSON.stringify(clinicData));
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'registered': return { color: '#17a2b8', text: 'مسجل' };
      case 'arrived': return { color: '#28a745', text: 'وصل' };
      case 'waiting_doctor': return { color: '#ffc107', text: 'بانتظار الدكتور' };
      case 'with_doctor': return { color: '#fd7e14', text: 'مع الدكتور' };
      case 'awaiting_pharmacy': return { color: '#6f42c1', text: 'بانتظار الصيدلية' };
      case 'completed': return { color: '#28a745', text: 'مكتمل' };
      default: return { color: '#6c757d', text: 'غير معروف' };
    }
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>لوحة تحكم الاستقبال</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* إضافة مريض جديد */}
        <div className="card">
          <h2>إضافة مريض جديد</h2>
          <form onSubmit={addNewPatient} style={{ marginTop: '20px' }}>
            <div className="form-group">
              <label>الاسم بالكامل</label>
              <input
                type="text"
                value={newPatient.name}
                onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>العمر</label>
              <input
                type="number"
                value={newPatient.age}
                onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>رقم الهاتف</label>
              <input
                type="tel"
                value={newPatient.phone}
                onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              إضافة المريض
            </button>
          </form>
        </div>

        {/* قائمة المرضى */}
        <div className="card">
          <h2>قائمة المرضى</h2>
          <div style={{ marginTop: '20px' }}>
            {patients.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                لا توجد بيانات مرضى
              </p>
            ) : (
              patients.map((patient) => {
                const statusInfo = getStatusInfo(patient.status);
                return (
                  <div key={patient.id} className="card" style={{ margin: '10px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <h3>{patient.name}</h3>
                        <p>العمر: {patient.age} | الهاتف: {patient.phone}</p>
                        <p>وقت الوصول: {patient.arrivalTime}</p>
                        <p style={{ color: statusInfo.color, fontWeight: 'bold' }}>
                          الحالة: {statusInfo.text}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {patient.status === 'arrived' && (
                          <button 
                            className="btn btn-warning"
                            onClick={() => updatePatientStatus(patient.id, 'waiting_doctor')}
                          >
                            إرسال للدكتور
                          </button>
                        )}
                        {patient.status === 'registered' && (
                          <button 
                            className="btn btn-success"
                            onClick={() => updatePatientStatus(patient.id, 'arrived')}
                          >
                            تأكيد الوصول
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}