export default function ContactPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">
            Contact Us
          </h1>

          <div className="max-w-3xl mx-auto">
            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-6 gradient-text">Get in Touch</h2>
              <p className="text-gray-600 mb-8">
                Have questions about Elevatia? We&apos;re here to help. Fill out the form below or reach out to us directly.
              </p>

              <form className="space-y-6" action="mailto:admin@elevatia.org" method="post" encType="text/plain">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-gray-900 focus:border-gray-900"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 gradient-text">Other Ways to Reach Us</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  <strong>Email:</strong> info@getelevatia.com
                </p>
                <p>
                  <strong>Support Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM EST
                </p>
                <p>
                  <strong>Follow Us:</strong>
                  <div className="flex space-x-4 mt-2">
                    <a 
                      href="https://www.linkedin.com/company/elevatia-co/?viewAsMember=true" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-900 hover:text-gray-700"
                    >
                      LinkedIn
                    </a>
                    <a 
                      href="https://www.instagram.com/elevatiahq?igsh=Z3Z4amhpMThhOW9i&utm_source=qr" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-900 hover:text-gray-700"
                    >
                      Instagram
                    </a>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 