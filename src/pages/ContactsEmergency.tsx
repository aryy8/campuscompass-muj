import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Phone } from 'lucide-react';

interface ContactRow {
  department: string;
  office?: string;
  extension?: string;
  email: string;
}

const CONTACTS: ContactRow[] = [
  { department: 'ACADEMICS', office: '0141 - 3999100', extension: '263', email: 'academic@jaipur.manipal.edu, ams@jaipur.manipal.edu' },
  { department: 'ADMISSIONS', office: '', extension: '142, 257, 297 — Click Here for more contact details', email: 'admissions@jaipur.manipal.edu' },
  { department: 'CONTROLLER OF EXAMINATIONS', office: '', extension: '204', email: 'coe@jaipur.manipal.edu' },
  { department: 'CHIEF WARDEN OFFICE', office: '', extension: '108, 493', email: 'office.chiefwarden@jaipur.manipal.edu' },
  { department: 'CHIEF OFFICER (GENERAL SERVICES & ADMINISTRATION)', office: '', extension: '119, 105', email: 'admin.office@jaipur.manipal.edu' },
  { department: 'CHIEF FINANCE OFFICER', office: '', extension: '107', email: 'cfao@jaipur.manipal.edu' },
  { department: 'STUDENT FINANCE', office: '', extension: '236, 252, 741', email: 'student.finance@jaipur.manipal.edu' },
  { department: 'HUMAN RESOURCES', office: '', extension: '666, 253, 728', email: 'hr.muj@jaipur.manipal.edu' },
  { department: 'IT INFRA', office: '', extension: '778, 300', email: 'it.support@jaipur.manipal.edu' },
  { department: 'LIBRARY', office: '', extension: '179', email: 'library@jaipur.manipal.edu' },
  { department: 'REGISTRAR OFFICE', office: '', extension: '134, 225', email: 'registrar.office@jaipur.manipal.edu' },
  { department: 'STUDENT WELFARE', office: '', extension: '327, 207', email: 'dean.dswmuj@jaipur.manipal.edu' },
  { department: 'TRAINING & PLACEMENT', office: '', extension: '751', email: 'tpo@jaipur.manipal.edu' },
  { department: 'WEBMASTER', office: '-', extension: '-', email: 'webmaster@jaipur.manipal.edu' },
];

const EMERGENCY_SERVICES = [
  { id: 'e1', name: 'Ambulance', desc: 'Campus ambulance service', phone: '+91-1433999104' },
  { id: 'e2', name: 'Fire', desc: 'Fire emergency', phone: '+91-1433999108' },
  { id: 'e3', name: 'Security', desc: 'Campus security desk', phone: '+91 9836284923' },
  { id: 'e4', name: 'Medical', desc: 'Medical center reception', phone: '555-1413999100' },
  { id: 'e5', name: 'Chief Warden', desc: 'GHS Hostel', phone: '+91-1413999108' },
];

const ContactsEmergency: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
          <h1 className="text-2xl font-bold">Contacts & Emergency</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Quick access to institute contacts and emergency numbers.</p>

        {/* Emergency Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">Emergency Services</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMERGENCY_SERVICES.map(s => (
              <div key={s.id} className="rounded-xl border border-border bg-card p-4">
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-muted-foreground mb-3">{s.desc}</div>
                <div className="flex items-center gap-2">
                  <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-600 text-white text-sm hover:bg-rose-700">
                    <Phone className="w-4 h-4" /> {s.phone}
                  </a>
                  <Button variant="outline" size="sm" onClick={() => navigate('/emergency')}>More</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contacts Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-cyan-100 text-cyan-700">
              <Phone className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold">Important Contacts</h2>
          </div>

          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Department</th>
                  <th className="px-4 py-3 font-semibold">Office</th>
                  <th className="px-4 py-3 font-semibold">Extension</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                </tr>
              </thead>
              <tbody>
                {CONTACTS.map((c) => (
                  <tr key={c.department} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{c.department}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{c.office || '-'}</td>
                    <td className="px-4 py-3 whitespace-pre-wrap">{c.extension || '-'}</td>
                    <td className="px-4 py-3 text-primary underline-offset-2">
                      {c.email.split(',').map((e, idx) => (
                        <a key={idx} className="hover:underline block" href={`mailto:${e.trim()}`}>{e.trim()}</a>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactsEmergency;
