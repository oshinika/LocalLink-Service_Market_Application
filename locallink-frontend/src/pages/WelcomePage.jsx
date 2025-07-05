
import {
  FiCheckCircle,
  FiUsers,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white font-sans flex flex-col items-center">
      {/* Hero Section - Smaller Square Box */}
      <div className="relative w-[1100px] h-[400px] mt-12 mb-16 rounded-2xl overflow-hidden shadow-lg">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/src/assets/welcome.jpg')" }}
        ></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>

        {/* Content */}
        <div className="relative z-10 h-full w-full flex flex-col justify-center items-center text-center text-white px-6">
          <h1 className="text-2xl font-bold mb-3 drop-shadow-md">
            Trusted Local Professionals
          </h1>
          <p className="text-base mb-5 max-w-xs drop-shadow-sm">
            Find quality services or grow your business through{" "}
            <span className="font-semibold text-blue-300">LocalLink</span>
          </p>
         
        </div>
      </div>

      {/* Value Proposition */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Why Choose LocalLink?
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We make finding and offering local services reliable, easy, and secure.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiCheckCircle className="text-blue-600 text-4xl mb-4 mx-auto" />,
              title: "Verified Professionals",
              desc: "Every provider undergoes thorough background checks and verification.",
            },
            {
              icon: <FiUsers className="text-blue-600 text-4xl mb-4 mx-auto" />,
              title: "Community Focused",
              desc: "We prioritize local connections to strengthen neighborhoods.",
            },
            {
              icon: <FiShield className="text-blue-600 text-4xl mb-4 mx-auto" />,
              title: "Quality Guarantee",
              desc: "Our satisfaction guarantee ensures you'll love the service.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-400 transition duration-300 hover:shadow-xl"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      

     
    </div>
  );
}
