import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User } from 'lucide-react';

const LS_KEY = 'uniway_user';

const LoginDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setUser(saved);
  }, []);

  const handleLogin = () => {
    if (!username || !password) return;
    localStorage.setItem(LS_KEY, username);
    setUser(username);
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(LS_KEY);
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm">
          <User className="h-4 w-4" />
          <span>{user}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-1" /> Logout
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <LogIn className="h-4 w-4 mr-1" /> Login
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button className="w-full" onClick={handleLogin}>Continue</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog; 