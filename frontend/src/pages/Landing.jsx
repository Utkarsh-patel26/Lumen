import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

const features = [
  {
    title: "Creator cockpit",
    description: "Ship courses, track enrollments, and keep everything in a single SaaS-grade workspace."
  },
  {
    title: "Student flow",
    description: "Frictionless discovery, crystal clear progress, and instant access across devices."
  },
  {
    title: "Futuristic UX",
    description: "Glassmorphism, gradients, and a calm dark canvas that feels premium."
  }
];

const Landing = () => {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Lumen</p>
          <h1 className="text-4xl font-semibold text-white md:text-6xl">
            A new orbit for <span className="text-gradient">course commerce</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-300">
            Build a full SaaS-ready course platform with admin control, student insights, and modern design
            without the drag.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/signup">
              <Button size="lg">Launch your school</Button>
            </Link>
            <Link to="/courses">
              <Button variant="secondary" size="lg">
                Explore courses
              </Button>
            </Link>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <span>Unified auth</span>
            <span>Role-ready dashboards</span>
            <span>Zero payment lock-in</span>
          </div>
        </div>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 animate-float-slow bg-gradient-to-br from-emerald-400/30 via-transparent to-purple-500/30" />
          <div className="relative space-y-6">
            <p className="text-xs uppercase text-slate-400">Live Metrics</p>
            <div className="space-y-2">
              <h3 className="text-3xl font-semibold text-white">2,418</h3>
              <p className="text-sm text-slate-300">Enrollments tracked today</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Active creators", value: "84" },
                { label: "Completion rate", value: "91%" },
                { label: "Avg. lesson", value: "12m" },
                { label: "Weekly growth", value: "18%" }
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="space-y-3">
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="text-sm text-slate-300">{feature.description}</p>
          </Card>
        ))}
      </section>
    </div>
  );
};

export default Landing;
