import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Terms = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <h1 className="text-4xl font-heading font-bold mb-4">Terms and Conditions</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 27, 2025</p>
          
          {/* Table of Contents */}
          <div className="bg-card border border-border rounded-lg p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { id: "acceptance", label: "1. Acceptance of Terms" },
                { id: "eligibility", label: "2. Eligibility" },
                { id: "credit-system", label: "3. Credit System" },
                { id: "account", label: "4. Account & Security" },
                { id: "content", label: "5. Content & Intellectual Property" },
                { id: "availability", label: "6. Service Availability" },
                { id: "pricing", label: "7. Pricing & Payments" },
                { id: "liability", label: "8. Limitation of Liability" },
                { id: "indemnification", label: "9. Indemnification" },
                { id: "privacy", label: "10. Privacy & Data" },
                { id: "modifications", label: "11. Modifications to Terms" },
                { id: "governing-law", label: "12. Governing Law" },
                { id: "contact", label: "13. Contact Information" },
                { id: "severability", label: "14. Severability" },
                { id: "entire-agreement", label: "15. Entire Agreement" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-primary hover:text-primary/80 hover:underline transition-colors text-sm"
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="prose prose-invert max-w-none space-y-10">
            {/* Section 1 */}
            <section id="acceptance">
              <h2 className="text-2xl font-bold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using ImagineCreate.AI ("Service", "Platform", "we", "us"), you agree to be bound by these Terms and Conditions. If you do not agree, do not use the Service.
              </p>
            </section>

            {/* Section 2 */}
            <section id="eligibility">
              <h2 className="text-2xl font-bold mb-4 text-foreground">2. Eligibility</h2>
              <p className="text-muted-foreground leading-relaxed">
                You must be at least <strong className="text-foreground">18 years old</strong> to use this Service. By using the Platform, you represent that you meet this age requirement.
              </p>
            </section>

            {/* Section 3 */}
            <section id="credit-system">
              <h2 className="text-2xl font-bold mb-4 text-foreground">3. Credit System</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">3.1 Credit Purchase</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Credits are the virtual currency used to generate AI content</li>
                <li><strong className="text-foreground">1 credit = 1 AI photo generation</strong></li>
                <li><strong className="text-foreground">10 credits = 1 AI video generation</strong></li>
                <li>Credits are purchased through PayPal checkout</li>
                <li>All prices are in USD</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">3.2 Credit Usage</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Credits are deducted immediately upon successful generation</li>
                <li>If generation fails due to technical error, credits are automatically refunded</li>
                <li>Credits never expire and remain in your account indefinitely</li>
                <li>Credits are non-transferable and cannot be exchanged for cash</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">3.3 Refund Policy - IMPORTANT</h3>
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-4">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong className="text-destructive">NO REFUNDS</strong> once credits have been used for any generation</li>
                  <li>Refunds available <strong className="text-foreground">ONLY within 24 hours</strong> of purchase IF zero credits have been used</li>
                  <li>To request a refund, contact [support email] with your order ID</li>
                  <li>Failed generations receive automatic credit refunds (not monetary refunds)</li>
                  <li>We reserve the right to deny refund requests that violate this policy</li>
                  <li><strong className="text-foreground">Chargebacks after credit usage will result in immediate account termination</strong></li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="account">
              <h2 className="text-2xl font-bold mb-4 text-foreground">4. Account & Security</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">4.1 Account Creation</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>You must provide accurate information during signup</li>
                <li>One account per user</li>
                <li>You are responsible for maintaining account security</li>
                <li>Notify us immediately of unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">4.2 Account Termination</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We reserve the right to suspend or terminate accounts for Terms violations</li>
                <li>Prohibited activities include: illegal content generation, copyright infringement, abuse of the system</li>
                <li><strong className="text-foreground">Upon termination, all unused credits are forfeited without refund</strong></li>
                <li>You may delete your account at any time; unused credits are forfeited</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="content">
              <h2 className="text-2xl font-bold mb-4 text-foreground">5. Content & Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">5.1 User-Generated Content</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>You retain all rights to images and videos you generate using our Service</li>
                <li>You may use generated content for personal and commercial purposes</li>
                <li>You are responsible for ensuring your prompts don't infringe others' rights</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">5.2 Prohibited Content</h3>
              <p className="text-muted-foreground mb-3">You may <strong className="text-foreground">NOT</strong> use the Service to create:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Illegal, harmful, or offensive content</li>
                <li>Content depicting minors in any inappropriate context</li>
                <li>Content that violates copyright, trademark, or intellectual property rights</li>
                <li>Deepfakes or unauthorized representations of real people</li>
                <li>Content intended to harass, threaten, or defame others</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">5.3 Platform Rights</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We retain rights to improve our AI models using anonymized generation data</li>
                <li>We may showcase user-generated content (with permission) for marketing</li>
                <li>We reserve the right to remove content that violates these Terms</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="availability">
              <h2 className="text-2xl font-bold mb-4 text-foreground">6. Service Availability</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">6.1 No Guarantees</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>The Service is provided "as is" without warranties</li>
                <li>We do not guarantee continuous, uninterrupted access</li>
                <li>AI generation quality may vary; results are not guaranteed</li>
                <li>We may modify, suspend, or discontinue features at any time</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">6.2 Maintenance</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We may perform maintenance that temporarily limits access</li>
                <li>We will attempt to provide notice for scheduled maintenance</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="pricing">
              <h2 className="text-2xl font-bold mb-4 text-foreground">7. Pricing & Payments</h2>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">7.1 Payment Processing</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>All payments processed securely through PayPal</li>
                <li>We do not store your payment card information</li>
                <li>Prices may change at any time with notice on the pricing page</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">7.2 Billing Issues</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Contact PayPal directly for payment disputes</li>
                <li>Contact us at [support email] for credit discrepancies</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="liability">
              <h2 className="text-2xl font-bold mb-4 text-foreground">8. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">To the maximum extent permitted by law:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We are not liable for any indirect, incidental, or consequential damages</li>
                <li>Our total liability shall not exceed the amount you paid in the last 12 months</li>
                <li>We are not responsible for AI-generated content that causes harm or offense</li>
                <li><strong className="text-foreground">You use the Service at your own risk</strong></li>
              </ul>
            </section>

            {/* Section 9 */}
            <section id="indemnification">
              <h2 className="text-2xl font-bold mb-4 text-foreground">9. Indemnification</h2>
              <p className="text-muted-foreground mb-4">
                You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Your violation of these Terms</li>
                <li>Your generated content</li>
                <li>Your infringement of any third-party rights</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="privacy">
              <h2 className="text-2xl font-bold mb-4 text-foreground">10. Privacy & Data</h2>
              <p className="text-muted-foreground mb-4">
                Your use of the Service is also governed by our{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="text-muted-foreground mb-3">Key points:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We collect email, name, and payment info via Clerk and PayPal</li>
                <li>Generated images/videos stored for 30 days, then deleted</li>
                <li>We do not sell your personal data</li>
                <li>See full Privacy Policy for details</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="modifications">
              <h2 className="text-2xl font-bold mb-4 text-foreground">11. Modifications to Terms</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We may update these Terms at any time</li>
                <li>Changes effective immediately upon posting</li>
                <li>Continued use after changes constitutes acceptance</li>
                <li>Major changes will be communicated via email</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section id="governing-law">
              <h2 className="text-2xl font-bold mb-4 text-foreground">12. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of <strong className="text-foreground">Taiwan</strong>. Any disputes will be resolved in Taiwanese courts.
              </p>
            </section>

            {/* Section 13 */}
            <section id="contact">
              <h2 className="text-2xl font-bold mb-4 text-foreground">13. Contact Information</h2>
              <p className="text-muted-foreground mb-3">For questions about these Terms:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Email: [support email]</li>
                <li>Response time: 24-48 hours</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section id="severability">
              <h2 className="text-2xl font-bold mb-4 text-foreground">14. Severability</h2>
              <p className="text-muted-foreground leading-relaxed">
                If any provision is found unenforceable, the remaining provisions remain in effect.
              </p>
            </section>

            {/* Section 15 */}
            <section id="entire-agreement">
              <h2 className="text-2xl font-bold mb-4 text-foreground">15. Entire Agreement</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms constitute the entire agreement between you and ImagineCreate.AI.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-center text-muted-foreground text-sm">
              By using ImagineCreate.AI, you agree to these Terms & Conditions.
            </p>
            <div className="flex justify-center mt-6">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
