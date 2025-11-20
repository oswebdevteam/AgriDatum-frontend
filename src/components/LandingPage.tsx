import React from 'react'
import { ChevronRight, Shield, Users, Globe, BarChart3, Cpu, Database } from 'lucide-react'

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen">
      <nav className="bg-white/80 backdrop-blur-md border-b border-primary-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-primary-900">AgriDatum</span>
            </div>
            <button 
              onClick={onGetStarted}
              className="btn-primary"
            >
              Get Started
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </nav>

    
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-primary-900 mb-6">
            Empowering
            <span className="block text-primary-600">African Farmers</span>
            <span className="block text-primary-900 text-4xl sm:text-5xl lg:text-6xl mt-4">
              Through Data Ownership
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A platform designed to give African farmers complete control over their agricultural data, 
            enabling better decisions, fairer markets, and sustainable growth through blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={onGetStarted}
              className="btn-primary text-lg px-8 py-4"
            >
              Start Recording Harvest
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
            <button className="btn-secondary text-lg px-8 py-4">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="card p-8">
              <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-lg font-semibold text-primary-900 mb-2">Smallholder Farmers</div>
              <p className="text-gray-600">Registered and actively using the platform</p>
            </div>
            <div className="card p-8">
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-lg font-semibold text-primary-900 mb-2">Data Accuracy</div>
              <p className="text-gray-600">Verified and validated harvest records</p>
            </div>
            <div className="card p-8">
              <div className="text-3xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-lg font-semibold text-primary-900 mb-2">Partner Applications</div>
              <p className="text-gray-600">Integrated with agricultural services</p>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Farmers Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              Built for Farmers, Powered by Technology
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform operates 24/7, providing real-time data access, secure transactions, 
              and comprehensive agricultural insights. All data is owned and controlled by you.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card p-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-primary-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              How AgriDatum Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From simple mobile input to secure blockchain storage - see your data work for you in real-time.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="card p-8 bg-white">
                  <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-lg font-bold mb-6">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-primary-300 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary-600 font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-white">AgriDatum</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-primary-200">
                Empowering African Farmers Through Data Ownership
              </p>
              <p className="text-primary-300 text-sm mt-2">
                © 2025 AgriDatum. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Shield,
    title: "Full Data Ownership",
    description: "Complete control and ownership of your agricultural data with transparent access and usage tracking."
  },
  {
    icon: Users,
    title: "Better Commodity Pricing",
    description: "Access fair market prices and better commodity deals through verified production data and market insights."
  },
  {
    icon: Database,
    title: "Blockchain Security",
    description: "Military-grade security with blockchain technology ensuring data integrity and permanent record keeping."
  },
  {
    icon: Globe,
    title: "Market Network Access",
    description: "Connect with buyers, suppliers, and service providers across the agricultural value chain network."
  },
  {
    icon: BarChart3,
    title: "AI Protocol Insights",
    description: "Advanced analytics and AI-powered insights for better crop planning and yield optimization."
  },
  {
    icon: Cpu,
    title: "Community Research",
    description: "Participate in agricultural research programs and access community-driven insights and best practices."
  }
]

const steps = [
  {
    title: "Record Your Harvest",
    description: "Simply enter your harvest details using any mobile device - no technical knowledge required."
  },
  {
    title: "Secure Data Storage",
    description: "Your data is cryptographically signed and permanently stored on the Cardano blockchain."
  },
  {
    title: "Access & Benefit",
    description: "Use your verified data to access better markets, financing, and agricultural insights."
  }
]

export default LandingPage