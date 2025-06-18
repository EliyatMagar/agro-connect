import React from 'react';
import Navbar from '../components/Navbar';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar Section - Replace with your actual navbar component */}
      <Navbar/>


      {/* Hero Section */}
      <div className="relative bg-green-700 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Contact AgroConnect
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-green-100">
            We'd love to hear from you! Reach out for support, partnerships, or just to say hello.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mb-12 lg:mb-0">
              <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">Get in touch</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Contact our team
              </p>
              <p className="mt-4 text-lg text-gray-500">
                Have questions about our platform? Want to explore partnership opportunities? Fill out the form and we'll get back to you within 24 hours.
              </p>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Our offices</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-base text-gray-500">
                      <span className="font-medium text-gray-900">Headquarters</span><br />
                      chamati-15 , kathamndu <br />
                     
                    </p>
                  </div>
                  <div>
                    <p className="text-base text-gray-500">
                      <span className="font-medium text-gray-900">Regional Office</span><br />
                      bara <br />
                     
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900">Contact information</h3>
                <div className="mt-4">
                  <p className="flex text-base text-gray-500">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="ml-3">+1 (555) 123-4567</span>
                  </p>
                  <p className="mt-3 flex text-base text-gray-500">
                    <svg className="flex-shrink-0 h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="ml-3">contact@agroconnect.com</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 py-8 px-6 sm:p-10 rounded-lg">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      autoComplete="name"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      autoComplete="tel"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <div className="mt-1">
                    <select
                      id="subject"
                      name="subject"
                      className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    >
                      <option>General inquiry</option>
                      <option>Technical support</option>
                      <option>Partnership opportunities</option>
                      <option>Media inquiries</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="py-3 px-4 block w-full shadow-sm focus:ring-green-500 focus:border-green-500 border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-gray-200">
        <div className="max-w-7xl mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3532.063261604041!2d85.29877407525414!3d27.71533297617803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDQyJzU1LjIiTiA4NcKwMTgnMDQuOSJF!5e0!3m2!1sen!2snp!4v1750231324507!5m2!1sen!2snp"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          {/* <iframe src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3532.063261604041!2d85.29877407525414!3d27.71533297617803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjfCsDQyJzU1LjIiTiA4NcKwMTgnMDQuOSJF!5e0!3m2!1sen!2snp!4v1750231324507!5m2!1sen!2snp" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Join our community</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-green-100">
            Follow us on social media for the latest updates and farming tips.
          </p>
          <div className="mt-8 flex justify-center space-x-6">
            <a href="#" className="text-green-200 hover:text-white">
              <span className="sr-only">Facebook</span>
              {/* <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg> */}
            </a>
            <a href="#" className="text-green-200 hover:text-white">
              <span className="">Twitter</span>

            </a>
            <a href="#" className="text-green-200 hover:text-white">
              <span className="">Instagram</span>

            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;