import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Database, Share2, UserCheck, Lock, Cookie, Baby, Globe, Sparkles, FileText, AlertTriangle, Mail, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";

const Privacy = () => {
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
          
          <h1 className="text-4xl font-heading font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 27, 2025</p>
          
          {/* Introduction */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <p className="text-muted-foreground leading-relaxed">
              ImagineCreate.AI ("we", "us", "our") respects your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our AI content generation platform.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              By using our Service, you consent to the data practices described in this policy.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-card border border-border rounded-lg p-6 mb-10">
            <h2 className="text-xl font-semibold mb-4">Table of Contents</h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { id: "information-collect", label: "1. Information We Collect" },
                { id: "how-we-use", label: "2. How We Use Your Information" },
                { id: "data-storage", label: "3. Data Storage & Retention" },
                { id: "data-sharing", label: "4. Data Sharing & Third Parties" },
                { id: "your-rights", label: "5. Your Rights & Choices" },
                { id: "security", label: "6. Security Measures" },
                { id: "cookies", label: "7. Cookies & Tracking" },
                { id: "children", label: "8. Children's Privacy" },
                { id: "international", label: "9. International Data Transfers" },
                { id: "ai-content", label: "10. AI-Generated Content" },
                { id: "changes", label: "11. Changes to Privacy Policy" },
                { id: "breach", label: "12. Data Breach Notification" },
                { id: "contact", label: "13. Contact Us" },
                { id: "compliance", label: "14. Compliance" },
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
            <section id="information-collect">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">1. Information We Collect</h2>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">1.1 Information You Provide</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">Account Information</strong>: Name, email address (collected via Clerk authentication)</li>
                <li><strong className="text-foreground">Payment Information</strong>: Processed by PayPal (we do not store credit card details)</li>
                <li><strong className="text-foreground">User Content</strong>: Text prompts, generated images, and generated videos</li>
                <li><strong className="text-foreground">Support Communications</strong>: When you contact customer support</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">1.2 Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">Usage Data</strong>: Features used, generation frequency, credit usage patterns</li>
                <li><strong className="text-foreground">Device Information</strong>: IP address, browser type, operating system, device identifiers</li>
                <li><strong className="text-foreground">Log Data</strong>: Access times, pages viewed, actions taken</li>
                <li><strong className="text-foreground">Cookies</strong>: Session cookies for authentication and functionality</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">1.3 Third-Party Data</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Authentication</strong>: Clerk provides basic profile information (name, email)</li>
                <li><strong className="text-foreground">Payments</strong>: PayPal provides transaction confirmation (not full payment details)</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section id="how-we-use">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">2. How We Use Your Information</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">We use collected data to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">Provide Service</strong>: Process generations, manage credits, maintain your account</li>
                <li><strong className="text-foreground">Improve Platform</strong>: Analyze usage patterns, enhance AI models, fix bugs</li>
                <li><strong className="text-foreground">Communication</strong>: Send transactional emails (purchase confirmations, credit updates)</li>
                <li><strong className="text-foreground">Security</strong>: Detect fraud, prevent abuse, enforce Terms of Service</li>
                <li><strong className="text-foreground">Legal Compliance</strong>: Respond to legal requests, protect our rights</li>
              </ul>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-foreground font-semibold mb-2">We do NOT:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li><strong className="text-foreground">Sell your personal data</strong> to third parties</li>
                  <li>Use your data for advertising outside our platform</li>
                  <li>Share your generated content without permission</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section id="data-storage">
              <div className="flex items-center gap-3 mb-4">
                <Database className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">3. Data Storage & Retention</h2>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">3.1 Storage Location</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">User Accounts</strong>: Stored in secure cloud database</li>
                <li><strong className="text-foreground">Generated Content</strong>: Stored for <strong className="text-foreground">30 days</strong>, then automatically deleted</li>
                <li><strong className="text-foreground">Payment Records</strong>: Transaction history retained for accounting/legal purposes</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">3.2 Retention Periods</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">Active Accounts</strong>: Data retained while account is active</li>
                <li><strong className="text-foreground">Deleted Accounts</strong>: Personal data deleted within 30 days of account deletion</li>
                <li><strong className="text-foreground">Generated Images/Videos</strong>: Automatically deleted after <strong className="text-foreground">30 days</strong></li>
                <li><strong className="text-foreground">Transaction History</strong>: Retained for 7 years for tax/legal compliance</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">3.3 Geographic Storage</h3>
              <p className="text-muted-foreground mb-2">Your data may be stored and processed in:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>United States (cloud servers)</li>
                <li>Your local region for performance optimization</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="data-sharing">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">4. Data Sharing & Third Parties</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">We share limited data with:</p>

              <h3 className="text-xl font-semibold mb-3 text-foreground">4.1 Service Providers</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">Clerk</strong>: Authentication and user management</li>
                <li><strong className="text-foreground">PayPal</strong>: Payment processing</li>
                <li><strong className="text-foreground">Cloud Storage</strong>: Database and file storage</li>
                <li><strong className="text-foreground">AI Providers</strong>: Image/video generation (prompts only, not personal info)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">4.2 Legal Requirements</h3>
              <p className="text-muted-foreground mb-6">
                We may disclose data if required by law, court order, or government request.
              </p>

              <h3 className="text-xl font-semibold mb-3 text-foreground">4.3 Business Transfers</h3>
              <p className="text-muted-foreground mb-6">
                If we merge or are acquired, your data may be transferred to the new entity.
              </p>

              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-foreground font-semibold mb-2">We do NOT share data with:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Advertising networks</li>
                  <li>Data brokers</li>
                  <li>Marketing companies</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section id="your-rights">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">5. Your Rights & Choices</h2>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">5.1 Access & Portability</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>View your account data anytime in your profile</li>
                <li>Request a copy of your data by contacting [support email]</li>
                <li>Export your generated content before the 30-day deletion</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">5.2 Correction & Deletion</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Update your profile information anytime</li>
                <li>Delete your account (and associated data) from account settings</li>
                <li>Request specific data deletion by contacting us</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">5.3 Communication Preferences</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Opt out of promotional emails (transactional emails cannot be disabled)</li>
                <li>Manage email preferences in account settings</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">5.4 GDPR Rights (European Users)</h3>
              <p className="text-muted-foreground mb-3">If you're in the EU, you have additional rights:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                <li>Right to access your data</li>
                <li>Right to rectification (correction)</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
              </ul>
              <p className="text-muted-foreground mb-6">Contact [support email] to exercise these rights.</p>

              <h3 className="text-xl font-semibold mb-3 text-foreground">5.5 CCPA Rights (California Users)</h3>
              <p className="text-muted-foreground mb-3">If you're in California, you have rights to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Know what personal data we collect</li>
                <li>Know if we sell your data (<strong className="text-foreground">we don't</strong>)</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of data sales (not applicable)</li>
              </ul>
            </section>

            {/* Section 6 */}
            <section id="security">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">6. Security Measures</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">We implement industry-standard security:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">Encryption</strong>: HTTPS for all data transmission</li>
                <li><strong className="text-foreground">Authentication</strong>: Secure login via Clerk</li>
                <li><strong className="text-foreground">Access Controls</strong>: Limited employee access to user data</li>
                <li><strong className="text-foreground">Regular Audits</strong>: Security reviews and updates</li>
              </ul>
              
              <div className="bg-muted/50 border border-border rounded-lg p-4">
                <p className="text-muted-foreground">
                  However, no system is 100% secure. Use strong passwords and protect your account.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="cookies">
              <div className="flex items-center gap-3 mb-4">
                <Cookie className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">7. Cookies & Tracking</h2>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">7.1 Essential Cookies</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Authentication session cookies (required for login)</li>
                <li>Security cookies (prevent unauthorized access)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">7.2 Functional Cookies</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>User preferences and settings</li>
                <li>Language selection</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">7.3 Analytics Cookies</h3>
              <p className="text-muted-foreground mb-6">
                Currently: None (may add in future with notice)
              </p>

              <p className="text-muted-foreground">
                You can disable cookies in your browser, but this may limit functionality.
              </p>
            </section>

            {/* Section 8 */}
            <section id="children">
              <div className="flex items-center gap-3 mb-4">
                <Baby className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">8. Children's Privacy</h2>
              </div>
              
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Our Service is <strong className="text-foreground">not intended for users under 18</strong></li>
                <li>We do not knowingly collect data from minors</li>
                <li>If we discover an underage account, we will delete it immediately</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section id="international">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">9. International Data Transfers</h2>
              </div>
              
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Your data may be transferred to countries outside your residence</li>
                <li>We ensure appropriate safeguards for international transfers</li>
              </ul>
            </section>

            {/* Section 10 */}
            <section id="ai-content">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">10. AI-Generated Content</h2>
              </div>
              
              <h3 className="text-xl font-semibold mb-3 text-foreground">10.1 Content Ownership</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li><strong className="text-foreground">You own the images/videos you generate</strong></li>
                <li>We may use anonymized generation patterns to improve AI models</li>
                <li>We do NOT train on your specific generated content without permission</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-foreground">10.2 Content Moderation</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We may review flagged content for Terms violations</li>
                <li>Illegal content is reported to authorities</li>
              </ul>
            </section>

            {/* Section 11 */}
            <section id="changes">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">11. Changes to Privacy Policy</h2>
              </div>
              
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We may update this policy periodically</li>
                <li>Changes posted with new "Last Updated" date</li>
                <li>Significant changes will be emailed to users</li>
                <li>Continued use after changes = acceptance</li>
              </ul>
            </section>

            {/* Section 12 */}
            <section id="breach">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">12. Data Breach Notification</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">In case of a data breach affecting your information:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We will notify you within <strong className="text-foreground">72 hours</strong></li>
                <li>We will explain what data was affected</li>
                <li>We will provide steps to protect yourself</li>
              </ul>
            </section>

            {/* Section 13 */}
            <section id="contact">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">13. Contact Us</h2>
              </div>
              
              <p className="text-muted-foreground mb-3">For privacy questions or requests:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                <li>Email: [support email]</li>
                <li>Response time: 24-48 hours</li>
              </ul>

              <p className="text-muted-foreground mb-3">For GDPR/CCPA requests:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Email: [privacy email]</li>
                <li>Include "Privacy Request" in subject line</li>
              </ul>
            </section>

            {/* Section 14 */}
            <section id="compliance">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold text-foreground m-0">14. Compliance</h2>
              </div>
              
              <p className="text-muted-foreground mb-4">This Privacy Policy complies with:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">General Data Protection Regulation (GDPR)</strong> - EU</li>
                <li><strong className="text-foreground">California Consumer Privacy Act (CCPA)</strong> - USA</li>
                <li><strong className="text-foreground">Taiwan Personal Data Protection Act</strong></li>
              </ul>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <p className="text-center text-muted-foreground text-sm">
                Your privacy is important to us. Contact us with any concerns.
              </p>
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <Link to="/terms">
                <Button variant="ghost" size="sm">
                  Terms & Conditions
                </Button>
              </Link>
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

export default Privacy;
