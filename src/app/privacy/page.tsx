export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">
            Privacy Policy
          </h1>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="card">
              <p className="text-sm text-gray-500 mb-6">Last updated: June 19, 2025</p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Elevatia ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Personal Information</h3>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                  <li>Name, email address, and profile information</li>
                  <li>User account credentials and authentication data</li>
                  <li>Device information and identifiers</li>
                  <li>Usage data and app analytics</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-gray-800">Health Data</h3>
                <p className="text-gray-600 mb-4">
                  We collect health-related information to provide personalized wellness insights and track your progress. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                  <li>Health metrics from your device (HealthKit on iOS, Google Fit on Android)</li>
                  <li>Activity data (steps, workouts, sleep patterns)</li>
                  <li>Wellness goals and preferences</li>
                  <li>Progress tracking and achievement data</li>
                </ul>

                <h3 className="text-xl font-semibold mb-3 text-gray-800">Third-Party Health Data Integrations</h3>
                <p className="text-gray-600 mb-4">
                  With your explicit consent, we may collect health data from third-party services including:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1">
                  <li><strong>WHOOP</strong>: Recovery, strain, sleep, and heart rate variability data</li>
                  <li><strong>Oura Ring</strong>: Sleep quality, readiness, activity, and temperature data</li>
                  <li><strong>Eight Sleep</strong>: Sleep tracking, temperature preferences, and sleep environment data</li>
                  <li><strong>Apple HealthKit</strong>: Comprehensive health and fitness data from your iPhone</li>
                  <li><strong>Google Fit</strong>: Activity and health data from Android devices</li>
                </ul>
                <p className="text-gray-600">
                  You can revoke access to any third-party service at any time through your device settings or the respective service's privacy controls.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>To provide and maintain our wellness coaching service</li>
                  <li>To generate personalized health insights and recommendations</li>
                  <li>To track your progress and achievements</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To provide customer support and respond to inquiries</li>
                  <li>To improve our algorithms and service quality</li>
                  <li>To send you relevant wellness tips and updates (with your consent)</li>
                  <li>To ensure app security and prevent fraud</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Data Sharing and Disclosure</h2>
                <p className="text-gray-600 mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li><strong>With your consent</strong>: When you explicitly authorize us to share data</li>
                  <li><strong>Service providers</strong>: With trusted third-party services that help us operate our app (Firebase, analytics providers)</li>
                  <li><strong>Legal requirements</strong>: When required by law, court order, or government request</li>
                  <li><strong>Safety purposes</strong>: To protect the rights, property, or safety of Elevatia, our users, or others</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Data Storage and Security</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Your data is stored securely using Firebase and Google Cloud Platform</li>
                  <li>All data transmission is encrypted using industry-standard TLS encryption</li>
                  <li>Data is encrypted at rest using AES-256 encryption</li>
                  <li>We implement multi-factor authentication and access controls</li>
                  <li>Regular security audits and monitoring are performed</li>
                  <li>Health data is stored in compliance with HIPAA security standards where applicable</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Data Retention</h2>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Personal data is retained as long as your account is active</li>
                  <li>Health data is retained for up to 7 years to provide historical insights</li>
                  <li>You can request deletion of your data at any time</li>
                  <li>Some data may be retained longer if required by law</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Your Rights</h2>
                <p className="text-gray-600 mb-4">You have the right to:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Access your personal data and request a copy</li>
                  <li>Correct or update your personal data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing your personal data</li>
                  <li>Request transfer of your personal data (data portability)</li>
                  <li>Withdraw consent for data processing</li>
                  <li>Disconnect third-party health data integrations</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  To exercise these rights, please contact us at support@elevatia.app.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">International Data Transfers</h2>
                <p className="text-gray-600">
                  Your data may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Children's Privacy</h2>
                <p className="text-gray-600">
                  Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete it immediately.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Changes to This Privacy Policy</h2>
                <p className="text-gray-600 mb-4">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Posting the new Privacy Policy on this page</li>
                  <li>Sending you an email notification</li>
                  <li>Displaying a prominent notice in our app</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Continued use of our service after changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>Email: support@elevatia.app</li>
                  <li>Website: https://getelevatia.com</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 gradient-text">Compliance</h2>
                <p className="text-gray-600 mb-4">This Privacy Policy complies with:</p>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  <li>General Data Protection Regulation (GDPR)</li>
                  <li>California Consumer Privacy Act (CCPA)</li>
                  <li>Health Insurance Portability and Accountability Act (HIPAA) where applicable</li>
                  <li>Apple App Store and Google Play Store privacy requirements</li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 