import React from 'react';
import { AlertTriangle, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const services = [
  { id: 'e1', name: 'Ambulance', desc: 'Campus ambulance service', phone: '+91-1433999104' },
  { id: 'e2', name: 'Fire', desc: 'Fire emergency', phone: '+91-1433999108' },
  { id: 'e3', name: 'Security', desc: 'Campus security desk', phone: '+91 9836284923' },
  { id: 'e4', name: 'Medical', desc: 'Medical center reception', phone: '555-1413999100' },
  { id: 'e5', name: 'Chief Warden', desc: 'GHS Hostel', phone: '+91-1413999108' },
];

const EmergencyServices: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="p-2 rounded-lg bg-red-100 text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Emergency Services</h1>
        </div>
        <p className="text-muted-foreground mb-6">Quick access to important campus emergency contacts (dummy).</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(s => (
            <div key={s.id} className="rounded-xl border border-border p-4 bg-card flex flex-col">
              <div className="font-semibold text-lg">{s.name}</div>
              <div className="text-xs text-muted-foreground mb-4">{s.desc}</div>
              <div className="mt-auto">
                <Button className="w-full" variant="destructive">
                  <Phone className="w-4 h-4 mr-2" /> Quick Call
                </Button>
                <div className="text-xs text-muted-foreground mt-2">{s.phone}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmergencyServices;
