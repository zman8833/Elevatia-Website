export default function AboutPage() {
  return (
    <div className="min-h-screen pt-16">
      <section className="section-padding">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">
            About Elevatia
          </h1>
          
          <div className="max-w-3xl mx-auto space-y-8">
            <section className="card">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                Elevatia is dedicated to transforming personal wellness through innovative technology solutions. 
                We believe in empowering individuals with tools that enhance their daily lives, streamline their wellness journey, 
                and support their personal growth.
              </p>
            </section>

            <section className="card">
              <h2 className="text-2xl font-semibold mb-4 gradient-text">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                We envision a world where everyone has access to cutting-edge tools that make their wellness journey 
                more efficient and rewarding. By combining AI technology with personalized guidance, we&apos;re creating 
                a platform that supports the entire wellness community.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
} 