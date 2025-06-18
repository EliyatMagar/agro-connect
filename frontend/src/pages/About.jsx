import React from 'react';
import Navbar from '../components/Navbar';

const AboutPage = () => {
  return (
      <div className="min-h-screen bg-gray-50">
        <Navbar/>
      {/* Hero Section */}
      <div className="relative bg-[#4CAF50] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            About AgroConnect
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-green-100">
            Bridging the gap between farmers and technology for sustainable agriculture
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Empowering farmers through technology
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              AgroConnect is dedicated to revolutionizing agriculture by providing farmers with the tools, 
              knowledge, and connections they need to thrive in the modern world.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">What We Offer</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive solutions for modern farming
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Market Access",
                description: "Direct connections to buyers and real-time price information",
                icon: "📊",
              },
              {
                title: "Digital Advisory",
                description: "Expert farming advice and best practices at your fingertips",
                icon: "🌱",
              },
              {
                title: "Supply Marketplace",
                description: "Verified suppliers for all your agricultural inputs",
                icon: "🛒",
              },
              {
                title: "Weather Intelligence",
                description: "Accurate forecasts and crop management recommendations",
                icon: "⛅",
              },
              {
                title: "Financial Services",
                description: "Access to credit and insurance products",
                icon: "💰",
              },
              {
                title: "Community Network",
                description: "Connect with fellow farmers and share knowledge",
                icon: "👥",
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center mb-12">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Our Team</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Passionate people behind AgroConnect
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Binod syangtan",
                role: "Frontend developer",
                bio: "2+ years of experience ",
              },
              {
                name: "Eliyat thapa magar",
                role: "Backend developer",
                bio: "2+ years of experience",
              },
              {
                name: "Saurav aryal",
                role: "UI designer",
                bio: "2+ years of experience",
              },
              {
                name: "Aayush aryal",
                role: "Business Development",
                bio: "2+ years of experience",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center text-4xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                <p className="text-green-600">{member.role}</p>
                <p className="text-gray-500 mt-1">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#6D4C41]">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to join the AgroConnect revolution?</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-green-100">
            Whether you're a farmer, supplier, or partner, we have solutions for you.
          </p>
          <a
            href="#"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 sm:w-auto"
          >
            Get in touch
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;