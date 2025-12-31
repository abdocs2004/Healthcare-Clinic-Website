'use client';
import { useState, useEffect } from 'react';

export default function DoctorPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    notes: '',
    nextVisit: '',
    medications: ['']
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const stored = localStorage.getItem('clinicData');
    if (stored) {
      const data = JSON.parse(stored);
      // عرض فقط المرضى الذين في انتظار الدكتور
      const waitingPatients = data.patients?.filter(p => p.status === 'waiting_doctor') || [];
      setPatients(waitingPatients);
    }
  };

  const addMedication = () => {
    setPrescription({
      ...prescription,
      medications: [...prescription.medications, '']
    });
  };

  const updateMedication = (index, value) => {
    const newMedications = [...prescription.medications];
    newMedications[index] = value;
    setPrescription({
      ...prescription,
      medications: newMedications
    });
  };

  const submitPrescription = () => {
    if (!selectedPatient) return;
    
    // حفظ الروشتة في localStorage
    const prescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    const newPrescription = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      ...prescription,
      date: new Date().toLocaleDateString('ar-EG'),
      status: 'awaiting_pharmacy'
    };
    
    prescriptions.push(newPrescription);
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
    
    // تحديث حالة المريض في clinicData
    const clinicData = JSON.parse(localStorage.getItem('clinicData') || '{}');
    const updatedPatients = clinicData.patients?.map(p => 
      p.id === selectedPatient.id 
        ? { ...p, status: 'awaiting_pharmacy' }
        : p
    ) || [];
    
    clinicData.patients = updatedPatients;
    localStorage.setItem('clinicData', JSON.stringify(clinicData));
    
    // تحديث الواجهة
    setPatients(updatedPatients.filter(p => p.status === 'waiting_doctor'));
    setSelectedPatient(null);
    setPrescription({
      diagnosis: '',
      notes: '',
      nextVisit: '',
      medications: ['']
    });
    
    alert('تم إرسال الروشتة إلى الصيدلية بنجاح');
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>لوحة تحكم الدكتور</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* قائمة المرضى المنتظرين */}
        <div className="card">
          <h2>المرضى المنتظرين للكشف ({patients.length})</h2>
          <div style={{ marginTop: '20px' }}>
            {patients.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                لا توجد مرضى في انتظار الكشف
              </p>
            ) : (
              patients.map((patient) => (
                <div 
                  key={patient.id} 
                  className="card" 
                  style={{ 
                    borderLeft: '4px solid #ffc107',
                    margin: '10px 0',
                    cursor: 'pointer',
                    backgroundColor: selectedPatient?.id === patient.id ? '#f8f9fa' : 'white'
                  }}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <h3>{patient.name}</h3>
                  <p>العمر: {patient.age} سنة | الهاتف: {patient.phone}</p>
                  <p style={{ color: '#ffc107', fontWeight: 'bold' }}>في انتظار الكشف</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* نموذج الكشف والروشتة */}
        <div className="card">
          <h2>الكشف الطبي والروشتة</h2>
          
          {selectedPatient ? (
            <div style={{ marginTop: '20px' }}>
              <div style={{ 
                backgroundColor: '#e7f3ff', 
                padding: '15px', 
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                <h3>بيانات المريض: {selectedPatient.name}</h3>
                <p>العمر: {selectedPatient.age} سنة</p>
                <p>الهاتف: {selectedPatient.phone}</p>
              </div>

              <div className="form-group">
                <label>التشخيص *</label>
                <textarea
                  rows="3"
                  value={prescription.diagnosis}
                  onChange={(e) => setPrescription({...prescription, diagnosis: e.target.value})}
                  placeholder="أدخل التشخيص هنا..."
                  required
                />
              </div>

              <div className="form-group">
                <label>ملاحظات إضافية</label>
                <textarea
                  rows="2"
                  value={prescription.notes}
                  onChange={(e) => setPrescription({...prescription, notes: e.target.value})}
                  placeholder="أي ملاحظات إضافية..."
                />
              </div>

              <div className="form-group">
                <label>موعد الزيارة القادمة (اختياري)</label>
                <input
                  type="date"
                  value={prescription.nextVisit}
                  onChange={(e) => setPrescription({...prescription, nextVisit: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>الأدوية</span>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    style={{ padding: '5px 10px', fontSize: '14px' }}
                    onClick={addMedication}
                  >
                    + إضافة دواء
                  </button>
                </label>
                
                {prescription.medications.map((med, index) => (
                  <input
                    key={index}
                    type="text"
                    value={med}
                    onChange={(e) => updateMedication(index, e.target.value)}
                    placeholder={`الدواء ${index + 1} (مثال: Amoxicillin 500mg - 3 مرات يومياً)`}
                    style={{ marginBottom: '10px' }}
                  />
                ))}
              </div>

              <button 
                className="btn btn-success"
                style={{ width: '100%', marginTop: '20px' }}
                onClick={submitPrescription}
                disabled={!prescription.diagnosis}
              >
                إرسال الروشتة إلى الصيدلية
              </button>
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
              اختر مريضاً من القائمة لبدء الكشف
            </p>
          )}
        </div>
      </div>
    </div>
  );
}