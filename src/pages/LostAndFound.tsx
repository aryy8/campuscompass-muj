import React from 'react';
import { Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

const dummyItems = [
  { id: '1', title: 'Blue Water Bottle', location: 'AB 1 - 2nd Floor', contact: '9876543210' },
  { id: '2', title: 'Black Wallet', location: 'Library Entrance', contact: 'someone@muj.edu' },
  { id: '3', title: 'Casio Calculator', location: 'AB 2 - 105', contact: 'instagram: @muj_student' },
];

const LostAndFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold">Lost & Found</h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border p-4 bg-card">
            <h2 className="text-xl font-semibold mb-4">Report Lost/Found Item</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm mb-1 block">Upload Image</label>
                <Input type="file" accept="image/*" />
              </div>
              <div>
                <label className="text-sm mb-1 block">Item Description</label>
                <Textarea placeholder="e.g., Black wallet with MUJ ID card inside" />
              </div>
              <div>
                <label className="text-sm mb-1 block">Location</label>
                <Input placeholder="e.g., Library, AB 2 - 105" />
              </div>
              <div>
                <label className="text-sm mb-1 block">Contact Info</label>
                <Input placeholder="Phone, email or Instagram" />
              </div>
              <Button className="w-full">Submit</Button>
              <p className="text-xs text-muted-foreground">Dummy form — no backend yet.</p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 bg-card">
            <h2 className="text-xl font-semibold mb-4">Recently Reported</h2>
            <div className="grid gap-3">
              {dummyItems.map(item => (
                <div key={item.id} className="border rounded-lg p-3 bg-background">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.location}</div>
                  <div className="text-xs mt-1">Contact: {item.contact}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostAndFound;
