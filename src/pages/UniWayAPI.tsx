import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Code2, Globe2, Layers, Map, Megaphone, Route, ShieldCheck } from 'lucide-react';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all">
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
  </div>
);

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <pre className="rounded-xl border border-border bg-muted/40 p-4 overflow-x-auto text-sm">
    <code>{children}</code>
  </pre>
);

const UniWayAPI: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate(-1)}>← Back</Button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Globe2 className="w-6 h-6" /> UniWay API
            </h1>
          </div>
          <div>
            <a
              href="mailto:developer@uniway.app?subject=UniWay%20API%20Inquiry&body=Hi%20UniWay%20Team%2C%0D%0A%0D%0AI%27d%20like%20to%20learn%20more%20about%20the%20UniWay%20API.%20Please%20get%20in%20touch.%0D%0A%0D%0AThanks%2C%0D%0A"
              className="inline-flex"
            >
              <Button size="sm" variant="secondary">Contact Developer</Button>
            </a>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Enable other colleges to create their own campus navigation system with UniWay’s flexible API.</p>

        {/* Intro */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-8">
          <p className="text-base leading-relaxed">
            UniWay API is a platform that empowers institutions to build their own campus navigation and student services experience. 
            Upload your maps and building data, manage facilities and events, and integrate with your systems using REST or GraphQL.
          </p>
        </div>

        {/* Key Features */}
        <h2 className="text-xl font-semibold mb-3">Key Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <FeatureCard icon={<Map className="w-6 h-6" />} title="Upload Maps & Buildings" desc="Import campus maps, building footprints, levels, and POIs for precise navigation." />
          <FeatureCard icon={<Layers className="w-6 h-6" />} title="Manage Facilities" desc="Keep labs, cafeterias, libraries, and services updated and searchable." />
          <FeatureCard icon={<Megaphone className="w-6 h-6" />} title="Events & Announcements" desc="Publish campus events and push announcements to your ecosystem." />
          <FeatureCard icon={<ShieldCheck className="w-6 h-6" />} title="Student Services" desc="Lost & Found, helpdesk tickets, and student support workflows." />
          <FeatureCard icon={<Route className="w-6 h-6" />} title="Routing Engine" desc="Directions across buildings and floors with accessible path options." />
          <FeatureCard icon={<Code2 className="w-6 h-6" />} title="REST & GraphQL" desc="Flexible integration through REST endpoints or GraphQL queries." />
        </div>

        {/* Sample Endpoints */}
        <h2 className="text-xl font-semibold mb-3">Sample Endpoints</h2>
        <div className="space-y-3 mb-8">
          <CodeBlock>GET /api/{`{college_id}`}/buildings</CodeBlock>
          <CodeBlock>GET /api/{`{college_id}`}/routes</CodeBlock>
          <CodeBlock>GET /api/{`{college_id}`}/events</CodeBlock>
          <CodeBlock>POST /api/{`{college_id}`}/lostfound</CodeBlock>
        </div>

        {/* Future Scope */}
        <h2 className="text-xl font-semibold mb-3">Future Scope</h2>
        <div className="rounded-2xl border border-border bg-card p-6">
          <ul className="list-disc pl-5 space-y-2 text-sm">
            <li><strong>White-label app</strong> for each college with custom branding.</li>
            <li><strong>Multi-college dashboard</strong> for centralized management and analytics.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UniWayAPI;
