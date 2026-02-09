import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "Launch a public course and test traction.",
    perks: ["1 course", "Community access", "Basic analytics"]
  },
  {
    name: "Studio",
    price: "$29",
    desc: "Scale to a full learning studio with cohorts.",
    perks: ["Unlimited courses", "Enrollment insights", "Priority support"]
  },
  {
    name: "Enterprise",
    price: "$99",
    desc: "For teams shipping large catalogs at speed.",
    perks: ["Multi-admin", "Custom onboarding", "Dedicated success"]
  }
];

const Pricing = () => {
  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-4xl font-semibold text-white">Pricing that scales</h2>
        <p className="mt-3 text-sm text-slate-300">
          Pick a plan that matches your learning economy and grow without friction.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className="flex h-full flex-col gap-6">
            <div>
              <p className="text-xs uppercase text-slate-400">{plan.name}</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">{plan.price}</h3>
              <p className="mt-2 text-sm text-slate-300">{plan.desc}</p>
            </div>
            <ul className="space-y-2 text-sm text-slate-200">
              {plan.perks.map((perk) => (
                <li key={perk}>- {perk}</li>
              ))}
            </ul>
            <Button className="mt-auto">Choose plan</Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
