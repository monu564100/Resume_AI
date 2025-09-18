import React from 'react';
import { Link } from 'react-router-dom';
export const Footer: React.FC = () => {
  return <footer className="mt-auto py-8 bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold tracking-tight text-black">Resume</span>
              <span className="text-xl font-bold tracking-tight text-neutral-600 ml-1">Analyzer</span>
            </Link>
            <p className="text-neutral-600 text-sm mt-2">
              Validate your resume and find the perfect career fit
            </p>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <div>
              <h3 className="text-black font-medium mb-2">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-neutral-600 hover:text-black text-sm">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/upload" className="text-neutral-600 hover:text-black text-sm">
                    Upload Resume
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-neutral-600 hover:text-black text-sm">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-black font-medium mb-2">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-neutral-600 hover:text-black text-sm">
                    Career Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-600 hover:text-black text-sm">
                    Resume Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-neutral-600 hover:text-black text-sm">
                    Interview Tips
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-black font-medium mb-2">Contact</h3>
              <ul className="space-y-2">
                <li className="text-neutral-600 text-sm">
                  support@resumeanalyzer.com
                </li>
                <li className="text-neutral-600 text-sm">(555) 123-4567</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <p className="text-neutral-600 text-sm text-center">
            © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};