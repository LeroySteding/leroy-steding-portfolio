"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Cookie, Settings, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface CookieConsentProps {
  className?: string;
}

type ConsentState = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export default function CookieConsent({ className = "" }: CookieConsentProps) {
  const t = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [consent, setConsent] = useState<ConsentState>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const consentGiven = localStorage.getItem("cookieConsent");
    if (!consentGiven) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAcceptAll = () => {
    const allConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allConsent);
  };

  const handleAcceptNecessary = () => {
    const necessaryConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(necessaryConsent);
  };

  const handleSavePreferences = () => {
    saveConsent(consent);
  };

  const saveConsent = (consentData: ConsentState) => {
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));
    localStorage.setItem("cookieConsentDate", new Date().toISOString());
    setIsVisible(false);

    // Here you would typically integrate with your analytics tools
    if (consentData.analytics) {
      // Enable analytics
      console.log("Analytics enabled");
    }
    if (consentData.marketing) {
      // Enable marketing cookies
      console.log("Marketing enabled");
    }
  };

  const toggleCookieType = (type: keyof ConsentState) => {
    if (type === "necessary") return; // Can't disable necessary cookies
    setConsent((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
            <div className="bg-secondary-bg border-2 border-accent-primary/30 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-lg">
              {/* Main Content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-primary/10 rounded-xl flex items-center justify-center">
                    <Cookie className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-text-primary mb-2">
                      {t.cookies.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {t.cookies.description}{" "}
                      <Link
                        href="/privacy"
                        className="text-accent-primary hover:text-accent-secondary underline transition-colors"
                      >
                        {t.cookies.learnMore}
                      </Link>
                    </p>
                  </div>
                  <button
                    onClick={handleAcceptNecessary}
                    className="flex-shrink-0 text-text-muted hover:text-text-primary transition-colors"
                    aria-label="Close and accept necessary cookies only"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Cookie Settings Panel */}
                <AnimatePresence>
                  {showSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 overflow-hidden"
                    >
                      <div className="space-y-4 pt-4 border-t border-surface">
                        {/* Necessary Cookies */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <div className="w-12 h-6 bg-accent-primary rounded-full flex items-center justify-end px-1 cursor-not-allowed">
                              <div className="w-4 h-4 bg-white rounded-full" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-text-primary text-sm">
                                {t.cookies.types.necessary.title}
                              </h4>
                              <span className="px-2 py-0.5 text-xs font-bold bg-accent-primary/20 text-accent-primary rounded">
                                {t.cookies.types.necessary.required}
                              </span>
                            </div>
                            <p className="text-xs text-text-muted leading-relaxed">
                              {t.cookies.types.necessary.description}
                            </p>
                          </div>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <button
                              onClick={() => toggleCookieType("analytics")}
                              className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center ${
                                consent.analytics
                                  ? "bg-accent-primary justify-end"
                                  : "bg-surface justify-start"
                              } px-1`}
                            >
                              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                            </button>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-text-primary text-sm mb-1">
                              {t.cookies.types.analytics.title}
                            </h4>
                            <p className="text-xs text-text-muted leading-relaxed">
                              {t.cookies.types.analytics.description}
                            </p>
                          </div>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            <button
                              onClick={() => toggleCookieType("marketing")}
                              className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center ${
                                consent.marketing
                                  ? "bg-accent-primary justify-end"
                                  : "bg-surface justify-start"
                              } px-1`}
                            >
                              <div className="w-4 h-4 bg-white rounded-full shadow-md" />
                            </button>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-text-primary text-sm mb-1">
                              {t.cookies.types.marketing.title}
                            </h4>
                            <p className="text-xs text-text-muted leading-relaxed">
                              {t.cookies.types.marketing.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-primary font-semibold border border-surface-light hover:border-accent-primary transition-all duration-300"
                  >
                    <Settings className="w-4 h-4" />
                    {showSettings
                      ? t.cookies.buttons.hideSettings
                      : t.cookies.buttons.customize}
                  </button>

                  {showSettings ? (
                    <button
                      onClick={handleSavePreferences}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-bold transition-all duration-300 shadow-lg shadow-accent-primary/20"
                    >
                      <Check className="w-4 h-4" />
                      {t.cookies.buttons.savePreferences}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleAcceptNecessary}
                        className="flex-1 px-6 py-3 rounded-xl bg-surface hover:bg-surface-light text-text-primary font-semibold border border-surface-light hover:border-text-muted transition-all duration-300"
                      >
                        {t.cookies.buttons.necessaryOnly}
                      </button>
                      <button
                        onClick={handleAcceptAll}
                        className="flex-1 px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-bold transition-all duration-300 shadow-lg shadow-accent-primary/20"
                      >
                        {t.cookies.buttons.acceptAll}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
