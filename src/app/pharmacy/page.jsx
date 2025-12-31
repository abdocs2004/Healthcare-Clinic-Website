'use client';
import { useState, useEffect } from 'react';

export default function PharmacyPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = () => {
    const stored = localStorage.getItem('prescriptions');
    if (stored) {
      setPrescriptions(JSON.parse(stored));
    }
  };

  const dispenseMedication = (prescriptionId) => {
    const updatedPrescriptions = prescriptions.map(p => 
      p.id === prescriptionId 
        ? { ...p, status: 'completed', dispensedAt: new Date().toLocaleString('ar-EG') }
        : p
    );
    
    setPrescriptions(updatedPrescriptions);
    localStorage.setItem('prescriptions', JSON.stringify(updatedPrescriptions));
    setSelectedPrescription(null);
    
    alert('تم صرف الدواء بنجاح');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'awaiting_pharmacy': return '#ffc107';
      case 'completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'awaiting_pharmacy': return 'في انتظار الصرف';
      case 'completed': return 'مكتمل';
      default: return 'غير معروف';
    }
  };

  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>لوحة تحكم الصيدلية</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* قائمة الروشتات */}
        <div className="card">
          <h2>الروشتات الواردة ({prescriptions.length})</h2>
          <div style={{ marginTop: '20px' }}>
            {prescriptions.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                لا توجد روشتات في انتظار الصرف
              </p>
            ) : (
              prescriptions.map((prescription) => (
                <div 
                  key={prescription.id}
                  className="card" 
                  style={{ 
                    borderLeft: `4px solid ${getStatusColor(prescription.status)}`,
                    margin: '10px 0',
                    cursor: 'pointer',
                    backgroundColor: selectedPrescription?.id === prescription.id ? '#f8f9fa' : 'white'
                  }}
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h3>{prescription.patientName}</h3>
                      <p>التاريخ: {prescription.date}</p>
                      <p style={{ color: getStatusColor(prescription.status), fontWeight: 'bold' }}>
                        {getStatusText(prescription.status)}
                      </p>
                    </div>
                    {prescription.status === 'awaiting_pharmacy' && (
                      <span style={{
                        backgroundColor: '#ffc107',
                        color: 'black',
                        padding: '5px 10px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        جديد
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* تفاصيل الروشتة */}
        <div className="card">
          <h2>تفاصيل الروشتة</h2>
          
          {selectedPrescription ? (
            <div style={{ marginTop: '20px' }}>
              <div style={{ 
                backgroundColor: '#fff3cd', 
                padding: '15px', 
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                <h3>مريض: {selectedPrescription.patientName}</h3>
                <p>التاريخ: {selectedPrescription.date}</p>
                {selectedPrescription.dispensedAt && (
                  <p>تم الصرف في: {selectedPrescription.dispensedAt}</p>
                )}
              </div>

              <div className="form-group">
                <label>التشخيص</label>
                <div style={{
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}>
                  {selectedPrescription.diagnosis}
                </div>
              </div>

              <div className="form-group">
                <label>ملاحظات الدكتور</label>
                <div style={{
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '5px',
                  border: '1px solid #ddd',
                  minHeight: '60px'
                }}>
                  {selectedPrescription.notes || 'لا توجد ملاحظات'}
                </div>
              </div>

              <div className="form-group">
                <label>الأدوية المطلوبة</label>
                <div style={{
                  padding: '15px',
                  backgroundColor: '#e7f3ff',
                  borderRadius: '5px',
                  border: '1px solid #b3d7ff'
                }}>
                  {selectedPrescription.medications.map((med, index) => (
                    <div 
                      key={index}
                      style={{
                        padding: '8px',
                        margin: '5px 0',
                        backgroundColor: 'white',
                        borderRadius: '3px',
                        border: '1px solid #dee2e6'
                      }}
                    >
                      {index + 1}. {med}
                    </div>
                  ))}
                </div>
              </div>

              {selectedPrescription.status === 'awaiting_pharmacy' && (
                <button 
                  className="btn btn-success"
                  style={{ width: '100%', marginTop: '20px' }}
                  onClick={() => dispenseMedication(selectedPrescription.id)}
                >
                  ✓ تأكيد صرف الدواء
                </button>
              )}

              {selectedPrescription.status === 'completed' && (
                <div style={{
                  textAlign: 'center',
                  padding: '20px',
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  borderRadius: '5px',
                  marginTop: '20px'
                }}>
                  <h4>✓ تم صرف الدواء</h4>
                  <p>تم الانتهاء من هذه الروشتة</p>
                </div>
              )}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px 20px' }}>
              اختر روشتة من القائمة لعرض التفاصيل
            </p>
          )}
        </div>
      </div>
    </div>
  );
}