import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Get in Touch</h1>
          <p className="text-gray-700 text-lg">
            Have questions about our consulting services? Need support or want to discuss partnerships? We're here to help and would love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <form className="bg-white p-8 rounded-xl shadow-md space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              placeholder="Your full name"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <input
              type="text"
              placeholder="What's this about?"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea
              rows={5}
              placeholder="Tell us how we can help you..."
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Send Message
          </button>
        </form>

        {/* Support Options */}
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-orange-600 mb-2">24/7 Support Chat</h3>
            <p className="text-gray-700">Get instant help through our live chat support available around the clock.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-orange-600 mb-2">Knowledge Base</h3>
            <p className="text-gray-700">Find answers to common questions in our comprehensive documentation.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-orange-600 mb-2">Expert Consultation</h3>
            <p className="text-gray-700">Schedule a one-on-one consultation with our consulting experts.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Transform Your Business?</h2>
          <p className="text-gray-700 mb-4">
            Skip the wait and discover how our consulting expertise can drive your success.
          </p>
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
            Start Your Journey
          </button>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-16">
          © 2025 atkind. All rights reserved. <br />
          Powered by <a href="https://atkind.com" className="text-orange-600 font-medium">atkind.com</a>
        </footer>
      </div>
    </div>
  );
};

export default Contact;