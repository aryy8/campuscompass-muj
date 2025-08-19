import React from 'react';
import { HandHeart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const volunteers = [
  { id: 'v1', name: 'Aarav Sharma', year: '3rd', dept: 'CSE', contact: 'aarav@muj.edu' },
  { id: 'v2', name: 'Isha Gupta', year: '2nd', dept: 'ECE', contact: 'isha@muj.edu' },
  { id: 'v3', name: 'Rahul Verma', year: '4th', dept: 'ME', contact: '+91 98765 43210' },
];

const VolunteerSupport: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
            <HandHeart className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Volunteer Support</h1>
        </div>

        <p className="text-muted-foreground mb-4">Reach out to student volunteers for guidance around campus.</p>

        <div className="grid gap-3 mb-6">
          {volunteers.map(v => (
            <div key={v.id} className="border rounded-lg p-4 bg-card flex items-center justify-between">
              <div>
                <div className="font-medium">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.year} year • {v.dept}</div>
                <div className="text-xs mt-1">Contact: {v.contact}</div>
              </div>
              <Button size="sm" variant="secondary">Message</Button>
            </div>
          ))}
        </div>

        <Button className="w-full">Request Support</Button>
        <p className="text-xs text-muted-foreground mt-2">This is a placeholder page.</p>
      </div>
    </div>
  );
};

export default VolunteerSupport;
