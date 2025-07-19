"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    functional: true,
    analytics: true,
    marketing: false,
  });

  // Check if consent has been given on component mount
  useEffect(() => {
    const hasConsent = localStorage.getItem("cookie-consent");
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("cookie-consent", "true");
    localStorage.setItem("cookie-preferences", JSON.stringify(prefs));
    
    // Apply cookie preferences
    if (!prefs.analytics) {
      // Disable analytics cookies (example)
      document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "_gid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "_gat=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    if (!prefs.marketing) {
      // Disable marketing cookies (example)
      document.cookie = "_fbp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    setShowBanner(false);
    setShowPreferences(false);
  };

  // Accept all cookies
  const acceptAll = () => {
    const allPrefs = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allPrefs);
    savePreferences(allPrefs);
  };

  // Accept only necessary cookies
  const acceptNecessary = () => {
    const necessaryPrefs = {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
    };
    setPreferences(necessaryPrefs);
    savePreferences(necessaryPrefs);
  };

  // Handle checkbox changes
  const handlePreferenceChange = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Cannot change necessary cookies
    
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!showBanner && !showPreferences) {
    return null;
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t border-gray-200 dark:border-gray-700 z-50 p-4">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2">Cookie Consent</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>{" "}
                to learn more.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowPreferences(true)}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Customize cookie preferences"
              >
                Customize
              </button>
              <button
                onClick={acceptNecessary}
                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Accept only necessary cookies"
              >
                Necessary Only
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                aria-label="Accept all cookies"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Modal */}
      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Cookie Preferences</h2>
                <button
                  onClick={() => setShowPreferences(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label="Close preferences"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Customize your cookie preferences below. Necessary cookies are required for the website to function properly.
              </p>
              
              <div className="space-y-4">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div>
                    <h3 className="font-medium">Necessary Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      These cookies are essential for the website to function properly.
                    </p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      aria-label="Necessary cookies (always enabled)"
                    />
                    <span className="ml-2 text-xs text-gray-500">Always active</span>
                  </div>
                </div>
                
                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div>
                    <h3 className="font-medium">Functional Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      These cookies enable personalized features and functionality.
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.functional}
                        onChange={() => handlePreferenceChange("functional")}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        aria-label="Enable functional cookies"
                      />
                    </label>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div>
                    <h3 className="font-medium">Analytics Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={() => handlePreferenceChange("analytics")}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        aria-label="Enable analytics cookies"
                      />
                    </label>
                  </div>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <div>
                    <h3 className="font-medium">Marketing Cookies</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      These cookies are used to track visitors across websites to display relevant advertisements.
                    </p>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={() => handlePreferenceChange("marketing")}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        aria-label="Enable marketing cookies"
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Cancel changes"
                >
                  Cancel
                </button>
                <button
                  onClick={() => savePreferences(preferences)}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  aria-label="Save cookie preferences"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 