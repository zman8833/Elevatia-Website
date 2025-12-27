import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
          <p className="text-gray-600 mb-8">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By downloading, installing, or using the Elevatia mobile application (&ldquo;App&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the App.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="text-gray-700 mb-4">
                Elevatia is an AI-powered wellness companion app that helps users track and improve various aspects of their life through structured wellness paths. The App provides personalized guidance, progress tracking, and gamification features to support your wellness journey.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>
              <p className="text-gray-700 mb-4">
                To use certain features of the App, you may be required to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and complete information</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Acceptable Use</h2>
              <p className="text-gray-700 mb-4">
                You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Use the App for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to the App or its systems</li>
                <li>Interfere with or disrupt the App&apos;s functionality</li>
                <li>Upload or transmit harmful, offensive, or inappropriate content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Health and Wellness Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                <strong>Important:</strong> Elevatia is designed for general wellness and lifestyle improvement purposes only. The App is not intended to diagnose, treat, cure, or prevent any disease or medical condition. 
              </p>
              <p className="text-gray-700 mb-4">
                Always consult with qualified healthcare professionals before making significant changes to your diet, exercise routine, or lifestyle. Do not rely solely on the App for medical advice or treatment decisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                The App and its content, including but not limited to text, graphics, images, software, and other materials, are owned by Elevatia, Co. and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. User-Generated Content</h2>
              <p className="text-gray-700 mb-4">
                You retain ownership of any content you create or upload through the App. However, by submitting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content solely for the purpose of operating and improving the App.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
              <p className="text-gray-700 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information when you use the App.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Subscription and Payments</h2>
              <p className="text-gray-700 mb-4">
                Some features of the App may require a paid subscription. Subscription fees are charged in advance and are non-refundable except as required by law. You may cancel your subscription at any time through your device&apos;s app store settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Elevatia, Co. shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising out of or relating to your use of the App.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Disclaimer of Warranties</h2>
              <p className="text-gray-700 mb-4">
                The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or completely secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Termination</h2>
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access to the App at any time, with or without cause or notice. Upon termination, your right to use the App will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes through the App or by email. Your continued use of the App after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Governing Law</h2>
              <p className="text-gray-700 mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Elevatia, Co. is incorporated, without regard to conflict of law principles.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none text-gray-700">
                <li><strong>Email:</strong> legal@elevatia.co</li>
                <li><strong>Company:</strong> Elevatia, Co.</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
} 