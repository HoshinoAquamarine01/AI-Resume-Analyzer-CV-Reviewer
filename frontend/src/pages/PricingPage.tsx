import React from "react";

const PricingHero: React.FC = () => {
  return (
    <section className="text-center max-w-3xl mx-auto mb-16 px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
        Simple Pricing
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
        Choose the plan that fits your{" "}
        <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
          career journey
        </span>
      </h1>
      <p className="text-lg text-slate-600 leading-relaxed">
        Unlock AI-powered resume analysis, ATS optimization, and mock interview prep to land your dream job.
      </p>
    </section>
  );
};

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  buttonText,
  isPopular = false,
}) => {
  return (
    <div
      className={`relative h-full rounded-2xl bg-white p-8 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 ${
        isPopular
          ? "border-2 border-indigo-600 shadow-xl shadow-indigo-500/10 md:-translate-y-2"
          : "border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
          Most Popular
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{description}</p>
        <div className="flex items-baseline mb-6">
          <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{price}</span>
          <span className="text-sm font-medium text-slate-500 ml-1">/month</span>
        </div>
        <div className="h-px bg-slate-100 w-full mb-6" />
        <ul className="space-y-3 mb-8 flex-1">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 text-sm text-slate-600">
              <svg className="w-5 h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <button
        className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-95 ${
          isPopular
            ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
            : "bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
};

const PricingSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <PricingCard
          title="Free"
          price="$0"
          description="Perfect for getting started with basic CV analysis."
          buttonText="Get Started"
          features={[
            "Basic resume analysis",
            "3 AI analyses per month",
            "Basic ATS score",
            "Standard response time",
            "Email support",
          ]}
        />
        <PricingCard
          title="Pro"
          price="$9"
          description="Best for active job seekers needing full AI support."
          buttonText="Upgrade to Pro"
          isPopular={true}
          features={[
            "Unlimited resume analysis",
            "Advanced AI feedback",
            "ATS optimization suggestions",
            "Interview question generator",
            "Priority support",
          ]}
        />
        <PricingCard
          title="Team"
          price="$19"
          description="Ideal for recruitment agencies and hiring teams."
          buttonText="Contact Us"
          features={[
            "Everything in Pro",
            "Multiple users",
            "Shared dashboard",
            "Candidate management",
            "Analytics",
          ]}
        />
      </div>
    </section>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const faqs = [
    {
      q: "Can I cancel anytime?",
      a: "Yes, you can cancel your subscription at any time with no extra charge.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit cards, PayPal, and local bank transfers.",
    },
    {
      q: "Is there a free trial?",
      a: "Yes! The Free plan gives you access to 3 AI analyses per month for free.",
    },
    {
      q: "Can I upgrade later?",
      a: "Absolutely. You can upgrade or downgrade your plan whenever you want.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-3">Frequently Asked Questions</h2>
        <p className="text-slate-600 text-base">
          Have questions? We're here to help you make the best choice.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className={`rounded-2xl border bg-white overflow-hidden transition-all duration-200 ${
                isOpen
                  ? "border-indigo-200 shadow-md ring-1 ring-indigo-500/10"
                  : "border-slate-200 shadow-sm hover:border-slate-300"
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
              >
                <span className="text-base sm:text-lg">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${
                    isOpen ? "rotate-180 text-indigo-600" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const PricingPage: React.FC = () => {
  return (
    <main className="bg-slate-50/60 min-h-screen py-16 font-sans">
      <PricingHero />
      <PricingSection />
      <FAQSection />
    </main>
  );
};

export default PricingPage;
