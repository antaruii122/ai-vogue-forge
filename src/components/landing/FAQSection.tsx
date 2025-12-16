import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Is this suitable for commercial use?",
    answer: "Yes. You own 100% of the commercial rights to every image you generate. You can use them for Amazon listings, Shopify stores, and social media ads without restriction."
  },
  {
    question: "What happens if I run out of credits?",
    answer: "You can top up credits instantly from your dashboard. Credits never expire and roll over to the next month on active plans."
  },
  {
    question: "Can I cancel my subscription?",
    answer: "Absolutely. You can cancel anytime from your profile settings. There are no long-term contracts or hidden fees."
  },
  {
    question: "What file formats do I get?",
    answer: "We provide high-resolution JPG and PNG files suitable for all major e-commerce platforms (Amazon, Etsy, Shopify, etc)."
  }
];

export const FAQSection = () => {
  return (
    <section className="py-24 md:py-28 px-4 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-center mb-16 text-foreground">
          Common Questions
        </h2>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-background/50 border border-border rounded-lg px-6"
            >
              <AccordionTrigger className="text-left text-foreground font-medium hover:no-underline py-5">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground/60 pb-5 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
