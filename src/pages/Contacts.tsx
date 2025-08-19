import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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

const Contacts: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 py-6">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
          <h1 className="text-2xl font-bold">Important Contacts (MUJ)</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Office numbers, extensions and emails for quick reference.</p>

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
      </div>
    </div>
  );
};

export default Contacts;
