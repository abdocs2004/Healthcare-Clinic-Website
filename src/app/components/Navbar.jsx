'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'تسجيل المريض' },
    { href: '/reception', label: 'الاستقبال' },
    { href: '/doctor', label: 'الدكتور' },
    { href: '/pharmacy', label: 'الصيدلية' }
  ];

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                color: pathname === item.href ? '#3498db' : 'white',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                backgroundColor: pathname === item.href ? 'white' : 'transparent',
                transition: 'all 0.3s ease',
                fontWeight: 'bold'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}