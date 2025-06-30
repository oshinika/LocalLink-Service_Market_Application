
import { FiCheckCircle, FiUsers, FiShield, FiAward } from 'react-icons/fi';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-900 text-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Welcome to LocalLink
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Your trusted platform for premium local services
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-blue-800 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300">
              Explore Services
            </button>
            <button className="border-2 border-white text-white hover:bg-blue-700 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300">
              Join as Provider
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 -mb-8"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Value Proposition */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Why Choose LocalLink?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <FiCheckCircle className="text-blue-700 text-4xl mb-4 mx-auto" />,
                title: "Verified Professionals",
                desc: "Rigorous vetting process ensures only qualified providers"
              },
              {
                icon: <FiUsers className="text-blue-700 text-4xl mb-4 mx-auto" />,
                title: "Local Expertise",
                desc: "Professionals with deep knowledge of your community"
              },
              {
                icon: <FiShield className="text-blue-700 text-4xl mb-4 mx-auto" />,
                title: "Premium Standards",
                desc: "Consistent quality you can rely on every time"
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition duration-300">
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 rounded-2xl p-12 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                step: "01",
                title: "Discover",
                desc: "Browse our curated selection of top local services"
              },
              {
                step: "02",
                title: "Connect",
                desc: "Directly communicate with service professionals"
              },
              {
                step: "03",
                title: "Engage",
                desc: "Arrange services at your convenience"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-blue-800">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <FiAward className="text-blue-600 text-4xl mx-auto mb-6" />
          <p className="text-xl text-gray-600 italic mb-6">
            "LocalLink transformed how we find service professionals. The quality and reliability have been exceptional across every category we've tried."
          </p>
          <p className="font-medium text-blue-800">- Michael T., Commercial Client</p>
        </div>

        {/* Final CTA */}
        <div className="bg-blue-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Difference</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our network of discerning clients and premium service providers
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <button className="bg-white text-blue-800 hover:bg-gray-100 px-10 py-4 rounded-lg text-lg font-semibold transition duration-300">
              Browse Services
            </button>
            <button className="border-2 border-white text-white hover:bg-blue-700 px-10 py-4 rounded-lg text-lg font-semibold transition duration-300">
              Provider Inquiry
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-blue-300">LocalLink</h3>
              <p className="text-gray-400">
                Elevating service standards through trusted connections
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Company</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Our Standards</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Resources</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Service Guides</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Provider Network</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Service Agreement</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} LocalLink. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}