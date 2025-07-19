"use client";

import { useState } from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  
  const handleCookiePreferences = (preferences: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  }) => {
    // Save cookie preferences
    localStorage.setItem('cookie-preferences', JSON.stringify(preferences));
    setShowCookieSettings(false);
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Last updated: July 15, 2025
      </p>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to SkillLearn. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
          <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc pl-6 my-4">
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
            <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
            <li><strong>Learning Data</strong> includes your course progress, quiz results, and learning activities.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul className="list-disc pl-6 my-4">
            <li>To register you as a new user.</li>
            <li>To provide and manage your access to our platform.</li>
            <li>To personalize your learning experience.</li>
            <li>To track your progress and provide feedback.</li>
            <li>To improve our platform and services.</li>
            <li>To communicate with you about your account or our services.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
          </p>
          <p>
            We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Data Retention</h2>
          <p>
            We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
          <p>
            To determine the appropriate retention period for personal data, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your personal data, the purposes for which we process your personal data and whether we can achieve those purposes through other means, and the applicable legal requirements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Request access to your personal data.</li>
            <li>Request correction of your personal data.</li>
            <li>Request erasure of your personal data.</li>
            <li>Object to processing of your personal data.</li>
            <li>Request restriction of processing your personal data.</li>
            <li>Request transfer of your personal data.</li>
            <li>Right to withdraw consent.</li>
          </ul>
          <p>
            You can exercise these rights by contacting us at privacy@skilllearn.com. You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is clearly unfounded, repetitive or excessive. Alternatively, we may refuse to comply with your request in these circumstances.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
          <p>
            Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site.
          </p>
          <button 
            onClick={() => setShowCookieSettings(true)}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Manage Cookie Preferences
          </button>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Changes to This Privacy Policy</h2>
          <p>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date at the top of this privacy policy.
          </p>
          <p>
            You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are posted on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Email:</strong> privacy@skilllearn.com<br />
            <strong>Address:</strong> SkillLearn Inc., 123 Learning Street, Education City, 12345
          </p>
        </section>
      </div>

      <div className="mt-8 border-t pt-6">
        <Link href="/terms" className="text-blue-600 hover:underline">
          Terms of Service
        </Link>
      </div>

      {showCookieSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Cookie Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Necessary Cookies</p>
                  <p className="text-sm text-gray-500">Required for the website to function</p>
                </div>
                <input type="checkbox" checked disabled className="h-5 w-5" />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Functional Cookies</p>
                  <p className="text-sm text-gray-500">Enable personalized features</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="h-5 w-5" 
                  id="functional-cookies"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Analytics Cookies</p>
                  <p className="text-sm text-gray-500">Help us improve our website</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked 
                  className="h-5 w-5" 
                  id="analytics-cookies"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Marketing Cookies</p>
                  <p className="text-sm text-gray-500">Used to deliver relevant ads</p>
                </div>
                <input 
                  type="checkbox" 
                  defaultChecked={false} 
                  className="h-5 w-5" 
                  id="marketing-cookies"
                />
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-4">
              <button 
                onClick={() => setShowCookieSettings(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleCookiePreferences({
                  necessary: true,
                  functional: (document.getElementById('functional-cookies') as HTMLInputElement).checked,
                  analytics: (document.getElementById('analytics-cookies') as HTMLInputElement).checked,
                  marketing: (document.getElementById('marketing-cookies') as HTMLInputElement).checked
                })}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 