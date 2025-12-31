export const initializeMockData = () => {
  if (typeof window === 'undefined') return;

  // بيانات تجريبية للاختبار
  const clinicData = {
    patients: [
      {
        id: '1',
        name: 'أحمد محمد',
        age: '35',
        phone: '0123456789',
        status: 'waiting_doctor',
        arrivalTime: new Date().toLocaleString('ar-EG')
      },
      {
        id: '2',
        name: 'فاطمة علي',
        age: '28',
        phone: '0123456790',
        status: 'arrived',
        arrivalTime: new Date().toLocaleString('ar-EG')
      }
    ]
  };

  const prescriptions = [
    {
      id: '1',
      patientId: '1',
      patientName: 'أحمد محمد',
      diagnosis: 'التهاب في الحلق',
      notes: 'يجب الراحة لمدة 3 أيام',
      medications: ['Amoxicillin 500mg - 3 مرات يومياً', 'Vitamin C 1000mg - مرة يومياً'],
      date: new Date().toLocaleDateString('ar-EG'),
      status: 'awaiting_pharmacy'
    }
  ];

  if (!localStorage.getItem('clinicData')) {
    localStorage.setItem('clinicData', JSON.stringify(clinicData));
  }
  
  if (!localStorage.getItem('prescriptions')) {
    localStorage.setItem('prescriptions', JSON.stringify(prescriptions));
  }
};