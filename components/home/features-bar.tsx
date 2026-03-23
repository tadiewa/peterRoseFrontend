import { Truck, CreditCard, PackageSearch, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Door Delivery",
    description: "Same-day delivery Mon-Sat. R150 flat fee.",
  },
  {
    icon: CreditCard,
    title: "Easy Payment",
    description: "Pay securely online with multiple options.",
  },
  {
    icon: PackageSearch,
    title: "Track Order",
    description: "Real-time updates on your order status.",
  },
  {
    icon: MessageCircle,
    title: "Have Questions?",
    description: "We're here to help. Reach out anytime.",
  },
];

export function FeaturesBar() {
  return (
    <section className="py-10 md:py-14 bg-gradient-to-r from-primary via-primary/95 to-primary relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {features.map((feat) => (
            <div key={feat.title} className="text-center px-2 group">
              <div className="inline-flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/10 mb-3 md:mb-4 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                <feat.icon className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-sm md:text-base font-bold text-primary-foreground mb-1 md:mb-1.5">
                {feat.title}
              </h3>
              <p className="text-primary-foreground/65 text-xs md:text-sm leading-snug">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
