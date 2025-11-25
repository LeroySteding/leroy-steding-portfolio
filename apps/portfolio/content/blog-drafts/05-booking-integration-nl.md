# Een Professioneel Boekingssysteem Bouwen met Cal.com en Calendly in Next.js

*Een uitgebreide handleiding voor het integreren van planningsoplossingen in je portfolio*

**Leestijd:** ~20 minuten  
**Moeilijkheid:** Gemiddeld  
**Vereisten:** Next.js basis, React hooks, TypeScript

---

## Inhoudsopgave

1. [Introductie](#introductie)
2. [Kiezen Tussen Cal.com en Calendly](#kiezen-tussen-calcom-en-calendly)
3. [Cal.com Integratie Opzetten](#calcom-integratie-opzetten)
4. [Calendly Integratie Opzetten](#calendly-integratie-opzetten)
5. [Herbruikbare Boekingscomponenten Maken](#herbruikbare-boekingscomponenten-maken)
6. [Een Uniforme Boekingspagina Bouwen](#een-uniforme-boekingspagina-bouwen)
7. [Boekingsbevestiging Afhandelen](#boekingsbevestiging-afhandelen)
8. [Analytics en Tracking](#analytics-en-tracking)
9. [Internationalisatie](#internationalisatie)
10. [Best Practices](#best-practices)
11. [Probleemoplossing](#probleemoplossing)

---

## Introductie

Een professioneel boekingssysteem is essentieel voor elke portfolio of zakelijke website. Het stroomlijnt het proces van het plannen van afspraken, vermindert het heen-en-weer e-mailen en presenteert een professioneel imago aan potentiële klanten.

In deze tutorial implementeren we zowel Cal.com als Calendly integraties, waardoor gebruikers de flexibiliteit hebben om hun voorkeursplatform te kiezen. We bouwen:

- Modal-gebaseerde boekingswidgets
- Dedicated boekingspagina's
- Succes-bevestigingsflows
- Analytics tracking
- Volledige internationalisatie ondersteuning

### Wat We Bouwen

```
/book
├── Cal.com embed (inline)
├── Calendly embed (inline)
├── Snelle boekingsknoppen
└── Succespagina met bevestiging
```

---

## Kiezen Tussen Cal.com en Calendly

### Cal.com

**Voordelen:**
- Open-source en zelf te hosten
- Meer aanpassingsmogelijkheden
- Betere prijzen voor teams
- Native dark mode ondersteuning

**Nadelen:**
- Nieuwer platform, kleiner ecosysteem
- Minder native integraties

### Calendly

**Voordelen:**
- Gevestigd platform met bewezen betrouwbaarheid
- Uitgebreide integraties (Zoom, Teams, etc.)
- Betere naamsbekendheid
- Meer gepolijste UI

**Nadelen:**
- Duurder op schaal
- Minder aanpasbaar
- Closed source

### Onze Aanpak

We implementeren beide opties, zodat gebruikers kunnen kiezen op basis van hun voorkeuren. Dit biedt ook fallback-opties als één dienst problemen ondervindt.

---

## Cal.com Integratie Opzetten

### Stap 1: Cal.com Account Aanmaken

1. Registreer op [cal.com](https://cal.com)
2. Stel je beschikbaarheid in
3. Maak evenementtypes aan (bijv. "30 minuten gesprek", "Kennismakingsgesprek")
4. Noteer je gebruikersnaam (bijv. `leroysteding`)

### Stap 2: Cal.com Embed Installeren

```bash
pnpm add @calcom/embed-react
```

### Stap 3: Type Definities Maken

Maak `types/calendar.d.ts`:

```typescript
// Cal.com types
declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void;
      q?: unknown[];
      ns?: Record<string, unknown>;
      loaded?: boolean;
    };
  }
}

// Uitbreiding voor gtag analytics
declare function gtag(
  command: 'event',
  action: string,
  params?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: unknown;
  }
): void;

export {};
```

### Stap 4: Cal.com Button Component Maken

Maak `components/ui/CalcomButton.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { Calendar } from 'lucide-react';

interface CalcomButtonProps {
  calLink: string;
  buttonText?: string;
  className?: string;
}

export default function CalcomButton({ 
  calLink, 
  buttonText = 'Plan via Cal.com',
  className = ''
}: CalcomButtonProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function initCal() {
      try {
        const cal = await getCalApi();
        cal('ui', {
          theme: 'auto',
          styles: { branding: { brandColor: '#3b82f6' } },
          hideEventTypeDetails: false,
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Cal.com initialisatie mislukt:', error);
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <button
      type="button"
      data-cal-link={calLink}
      data-cal-config='{"layout":"month_view"}'
      disabled={isLoading}
      className={`
        inline-flex items-center gap-2 px-6 py-3 
        bg-blue-600 hover:bg-blue-700 
        text-white font-medium rounded-lg
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <Calendar className="w-5 h-5" />
      {isLoading ? 'Laden...' : buttonText}
    </button>
  );
}
```

### Stap 5: Cal.com Modal Component Maken

Maak `components/ui/CalcomModal.tsx`:

```typescript
'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { X, Calendar, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalcomModalProps {
  isOpen: boolean;
  onClose: () => void;
  calLink: string;
  title?: string;
}

export default function CalcomModal({ 
  isOpen, 
  onClose, 
  calLink,
  title = 'Plan een Afspraak'
}: CalcomModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialiseer Cal.com
  useEffect(() => {
    if (!isOpen) return;

    (async function initCal() {
      try {
        setIsLoading(true);
        setError(null);
        
        const cal = await getCalApi();
        cal('ui', {
          theme: 'auto',
          styles: { branding: { brandColor: '#3b82f6' } },
        });
        
        setIsLoading(false);
      } catch (err) {
        console.error('Cal.com initialisatie mislukt:', err);
        setError('Laden van agenda mislukt. Probeer het opnieuw.');
        setIsLoading(false);
      }
    })();
  }, [isOpen]);

  // Escape toets afhandelen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Track boeking events
  const handleBookingComplete = useCallback(() => {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'booking_complete', {
        event_category: 'engagement',
        event_label: 'cal.com',
      });
    }
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Achtergrond */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Modal sluiten"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inhoud */}
            <div className="p-4 overflow-y-auto" style={{ height: '70vh' }}>
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <p className="text-gray-600 dark:text-gray-400">Agenda laden...</p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <p className="text-red-600">{error}</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Opnieuw proberen
                  </button>
                </div>
              )}

              {!isLoading && !error && (
                <div
                  data-cal-link={calLink}
                  data-cal-config='{"layout":"month_view"}'
                  className="w-full h-full"
                  onLoad={handleBookingComplete}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Calendly Integratie Opzetten

### Stap 1: Calendly Account Aanmaken

1. Registreer op [calendly.com](https://calendly.com)
2. Configureer je beschikbaarheid
3. Maak evenementtypes aan
4. Noteer je gebruikersnaam (bijv. `leroysteding`)

### Stap 2: Calendly Widget Installeren

```bash
pnpm add react-calendly
```

### Stap 3: Calendly Button Component Maken

Maak `components/ui/CalendlyButton.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { PopupButton } from 'react-calendly';
import { Calendar } from 'lucide-react';

interface CalendlyButtonProps {
  url: string;
  buttonText?: string;
  className?: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  utm?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
  };
}

export default function CalendlyButton({
  url,
  buttonText = 'Plan via Calendly',
  className = '',
  prefill,
  utm,
}: CalendlyButtonProps) {
  const [rootElement, setRootElement] = useState<HTMLElement | null>(null);

  // Stel root element in bij mount
  if (typeof window !== 'undefined' && !rootElement) {
    setRootElement(document.getElementById('__next') || document.body);
  }

  if (!rootElement) {
    return (
      <button
        type="button"
        disabled
        className={`
          inline-flex items-center gap-2 px-6 py-3 
          bg-purple-600 text-white font-medium rounded-lg
          opacity-50 cursor-not-allowed
          ${className}
        `}
      >
        <Calendar className="w-5 h-5" />
        Laden...
      </button>
    );
  }

  return (
    <PopupButton
      url={url}
      rootElement={rootElement}
      prefill={prefill}
      utm={utm}
      text={buttonText}
      className={`
        inline-flex items-center gap-2 px-6 py-3 
        bg-purple-600 hover:bg-purple-700 
        text-white font-medium rounded-lg
        transition-all duration-200
        ${className}
      `}
    />
  );
}
```

### Stap 4: Calendly Modal Component Maken

Maak `components/ui/CalendlyModal.tsx`:

```typescript
'use client';

import { useEffect, useCallback } from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { X, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  prefill?: {
    name?: string;
    email?: string;
    customAnswers?: Record<string, string>;
  };
  utm?: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  };
}

export default function CalendlyModal({
  isOpen,
  onClose,
  url,
  title = 'Plan een Afspraak',
  prefill,
  utm,
}: CalendlyModalProps) {
  // Luister naar Calendly events
  useCalendlyEventListener({
    onEventScheduled: (e) => {
      console.log('Evenement gepland:', e.data.payload);
      
      // Track met analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', 'booking_complete', {
          event_category: 'engagement',
          event_label: 'calendly',
        });
      }

      // Redirect naar succespagina
      setTimeout(() => {
        window.location.href = '/book/success?source=calendly';
      }, 1000);
    },
    onDateAndTimeSelected: () => {
      if (typeof gtag !== 'undefined') {
        gtag('event', 'time_selected', {
          event_category: 'engagement',
          event_label: 'calendly',
        });
      }
    },
  });

  // Escape toets afhandelen
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Achtergrond */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold">{title}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Modal sluiten"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Calendly Widget */}
            <div className="h-[70vh]">
              <InlineWidget
                url={url}
                prefill={prefill}
                utm={utm}
                styles={{
                  height: '100%',
                  minWidth: '320px',
                }}
                pageSettings={{
                  backgroundColor: 'ffffff',
                  hideEventTypeDetails: false,
                  hideLandingPageDetails: false,
                  primaryColor: '9333ea',
                  textColor: '1f2937',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

---

## Herbruikbare Boekingscomponenten Maken

### Uniforme Boekingskaart

Maak `components/ui/BookingCard.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Calendar, Clock, Video, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import CalcomModal from './CalcomModal';
import CalendlyModal from './CalendlyModal';

interface BookingOption {
  id: string;
  provider: 'calcom' | 'calendly';
  title: string;
  duration: string;
  description: string;
  link: string;
  features: string[];
}

interface BookingCardProps {
  option: BookingOption;
  onSelect?: (option: BookingOption) => void;
}

export default function BookingCard({ option, onSelect }: BookingCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const providerColors = {
    calcom: 'blue',
    calendly: 'purple',
  };

  const color = providerColors[option.provider];

  const handleOpenModal = () => {
    // Track modal open
    if (typeof gtag !== 'undefined') {
      gtag('event', 'booking_modal_open', {
        event_category: 'engagement',
        event_label: option.provider,
        value: option.id,
      });
    }
    
    setIsModalOpen(true);
    onSelect?.(option);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        className={`
          relative p-6 bg-white dark:bg-gray-800 rounded-2xl
          border-2 border-gray-100 dark:border-gray-700
          hover:border-${color}-500 dark:hover:border-${color}-500
          transition-all duration-300 shadow-lg hover:shadow-xl
        `}
      >
        {/* Provider Badge */}
        <div className={`
          absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium
          bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400
        `}>
          {option.provider === 'calcom' ? 'Cal.com' : 'Calendly'}
        </div>

        {/* Titel */}
        <h3 className="text-xl font-bold mb-2 pr-20">{option.title}</h3>

        {/* Duur */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
          <Clock className="w-4 h-4" />
          <span>{option.duration}</span>
        </div>

        {/* Beschrijving */}
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {option.description}
        </p>

        {/* Features */}
        <ul className="space-y-2 mb-6">
          {option.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Video className="w-4 h-4 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Acties */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleOpenModal}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3
              bg-${color}-600 hover:bg-${color}-700 text-white
              font-medium rounded-lg transition-colors
            `}
          >
            <Calendar className="w-5 h-5" />
            Nu Boeken
          </button>
          
          <a
            href={option.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label="Openen in nieuw tabblad"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </motion.div>

      {/* Modal */}
      {option.provider === 'calcom' ? (
        <CalcomModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          calLink={option.link.replace('https://cal.com/', '')}
          title={option.title}
        />
      ) : (
        <CalendlyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          url={option.link}
          title={option.title}
        />
      )}
    </>
  );
}
```

---

## Een Uniforme Boekingspagina Bouwen

Maak `app/[locale]/book/page.tsx`:

```typescript
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BookingPageClient from './BookingPageClient';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });

  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.title'),
      description: t('meta.description'),
      type: 'website',
    },
  };
}

export default async function BookingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'booking' });

  const bookingOptions = [
    {
      id: 'discovery-cal',
      provider: 'calcom' as const,
      title: t('options.discovery.title'),
      duration: '30 min',
      description: t('options.discovery.description'),
      link: 'https://cal.com/leroysteding/discovery',
      features: [
        t('options.discovery.features.video'),
        t('options.discovery.features.flexible'),
        t('options.discovery.features.followup'),
      ],
    },
    {
      id: 'consultation-calendly',
      provider: 'calendly' as const,
      title: t('options.consultation.title'),
      duration: '60 min',
      description: t('options.consultation.description'),
      link: 'https://calendly.com/leroysteding/consultation',
      features: [
        t('options.consultation.features.deep'),
        t('options.consultation.features.screen'),
        t('options.consultation.features.recommendations'),
      ],
    },
  ];

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Sectie */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* Boekingsopties */}
        <BookingPageClient options={bookingOptions} />

        {/* FAQ Sectie */}
        <section className="mt-20">
          <h2 className="text-2xl font-bold text-center mb-8">
            {t('faq.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* FAQ items komen hier */}
          </div>
        </section>
      </div>
    </main>
  );
}
```

Maak `app/[locale]/book/BookingPageClient.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import BookingCard from '@/components/ui/BookingCard';

interface BookingOption {
  id: string;
  provider: 'calcom' | 'calendly';
  title: string;
  duration: string;
  description: string;
  link: string;
  features: string[];
}

interface BookingPageClientProps {
  options: BookingOption[];
}

export default function BookingPageClient({ options }: BookingPageClientProps) {
  const [filter, setFilter] = useState<'all' | 'calcom' | 'calendly'>('all');

  const filteredOptions = options.filter(
    (option) => filter === 'all' || option.provider === filter
  );

  return (
    <div>
      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {(['all', 'calcom', 'calendly'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-colors
              ${filter === tab
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
            `}
          >
            {tab === 'all' ? 'Alle' : tab === 'calcom' ? 'Cal.com' : 'Calendly'}
          </button>
        ))}
      </div>

      {/* Boekingskaarten Grid */}
      <motion.div
        layout
        className="grid md:grid-cols-2 gap-6"
      >
        {filteredOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            layout
          >
            <BookingCard option={option} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
```

---

## Boekingsbevestiging Afhandelen

Maak `app/[locale]/book/success/page.tsx`:

```typescript
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import BookingSuccessClient from './BookingSuccessClient';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ source?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'booking' });

  return {
    title: t('success.meta.title'),
    description: t('success.meta.description'),
    robots: { index: false }, // Indexeer geen succespagina's
  };
}

export default async function BookingSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { source } = await searchParams;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'booking' });

  return (
    <main className="min-h-screen flex items-center justify-center pt-24 pb-16">
      <BookingSuccessClient 
        source={source || 'unknown'}
        translations={{
          title: t('success.title'),
          subtitle: t('success.subtitle'),
          checkEmail: t('success.checkEmail'),
          addToCalendar: t('success.addToCalendar'),
          backHome: t('success.backHome'),
          contact: t('success.contact'),
        }}
      />
    </main>
  );
}
```

Maak `app/[locale]/book/success/BookingSuccessClient.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Mail, Calendar, Home, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingSuccessClientProps {
  source: string;
  translations: {
    title: string;
    subtitle: string;
    checkEmail: string;
    addToCalendar: string;
    backHome: string;
    contact: string;
  };
}

export default function BookingSuccessClient({ 
  source, 
  translations 
}: BookingSuccessClientProps) {
  // Confetti bij mount
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#3b82f6', '#8b5cf6', '#10b981'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Track conversie
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        event_category: 'booking',
        event_label: source,
        value: 1,
      });
    }
  }, [source]);

  return (
    <div className="container mx-auto px-4 max-w-2xl text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold mb-4"
      >
        {translations.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-gray-600 dark:text-gray-400 mb-8"
      >
        {translations.subtitle}
      </motion.p>

      {/* Volgende Stappen */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8"
      >
        <div className="flex items-center gap-3 text-left">
          <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <p className="text-gray-700 dark:text-gray-300">
            {translations.checkEmail}
          </p>
        </div>
      </motion.div>

      {/* Acties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          <Home className="w-5 h-5" />
          {translations.backHome}
        </Link>
        
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          {translations.contact}
        </Link>
      </motion.div>

      {/* Bron indicator (voor debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <p className="mt-8 text-sm text-gray-400">
          Geboekt via: {source}
        </p>
      )}
    </div>
  );
}
```

---

## Analytics en Tracking

### Event Tracking Opzetten

Maak `lib/analytics/booking.ts`:

```typescript
type BookingEvent =
  | 'booking_page_view'
  | 'booking_modal_open'
  | 'time_selected'
  | 'booking_complete'
  | 'booking_cancelled';

interface BookingEventParams {
  provider: 'calcom' | 'calendly';
  event_type?: string;
  duration?: string;
  value?: number;
}

export function trackBookingEvent(
  event: BookingEvent,
  params: BookingEventParams
): void {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', event, {
      event_category: 'booking',
      event_label: params.provider,
      ...params,
    });
  }

  // Console logging voor development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Booking Analytics]', event, params);
  }

  // Voeg hier andere analytics providers toe (Mixpanel, Amplitude, etc.)
}

// Conversie tracking
export function trackBookingConversion(provider: string, value = 1): void {
  if (typeof gtag !== 'undefined') {
    // Google Ads conversie tracking
    gtag('event', 'conversion', {
      send_to: process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID,
      value,
      currency: 'EUR',
    });
  }
}
```

### Funnel Tracking Implementeren

```typescript
// Track de volledige booking funnel
export const BookingFunnel = {
  step1_pageView: () => trackBookingEvent('booking_page_view', { provider: 'all' }),
  step2_modalOpen: (provider: 'calcom' | 'calendly') => 
    trackBookingEvent('booking_modal_open', { provider }),
  step3_timeSelected: (provider: 'calcom' | 'calendly') => 
    trackBookingEvent('time_selected', { provider }),
  step4_complete: (provider: 'calcom' | 'calendly') => {
    trackBookingEvent('booking_complete', { provider });
    trackBookingConversion(provider);
  },
};
```

---

## Internationalisatie

### Vertalingsbestanden

Voeg toe aan `locales/en.ts`:

```typescript
export default {
  // ... bestaande vertalingen
  booking: {
    meta: {
      title: 'Book a Meeting - Leroy Steding',
      description: 'Schedule a discovery call or consultation to discuss your project.',
    },
    hero: {
      title: 'Let\'s Talk',
      subtitle: 'Book a free consultation to discuss your project, ideas, or any questions you have.',
    },
    options: {
      discovery: {
        title: 'Discovery Call',
        description: 'A quick 30-minute call to discuss your needs and see if we\'re a good fit.',
        features: {
          video: 'Video call via Google Meet',
          flexible: 'Flexible scheduling',
          followup: 'Follow-up email with summary',
        },
      },
      consultation: {
        title: 'Deep Dive Consultation',
        description: 'A comprehensive 60-minute session to explore your project in detail.',
        features: {
          deep: 'In-depth project discussion',
          screen: 'Screen sharing available',
          recommendations: 'Detailed recommendations',
        },
      },
    },
    success: {
      meta: {
        title: 'Booking Confirmed!',
        description: 'Your meeting has been scheduled successfully.',
      },
      title: 'You\'re All Set!',
      subtitle: 'Your meeting has been scheduled successfully.',
      checkEmail: 'Check your email for a calendar invitation with all the details.',
      addToCalendar: 'Add to Calendar',
      backHome: 'Back to Home',
      contact: 'Contact Me',
    },
    faq: {
      title: 'Frequently Asked Questions',
    },
  },
};
```

Voeg toe aan `locales/nl.ts`:

```typescript
export default {
  // ... bestaande vertalingen
  booking: {
    meta: {
      title: 'Plan een Gesprek - Leroy Steding',
      description: 'Plan een kennismakingsgesprek of consultatie om je project te bespreken.',
    },
    hero: {
      title: 'Laten We Praten',
      subtitle: 'Plan een gratis consultatie om je project, ideeën of vragen te bespreken.',
    },
    options: {
      discovery: {
        title: 'Kennismakingsgesprek',
        description: 'Een kort gesprek van 30 minuten om je behoeften te bespreken.',
        features: {
          video: 'Videogesprek via Google Meet',
          flexible: 'Flexibele planning',
          followup: 'Follow-up e-mail met samenvatting',
        },
      },
      consultation: {
        title: 'Uitgebreide Consultatie',
        description: 'Een uitgebreide sessie van 60 minuten om je project in detail te verkennen.',
        features: {
          deep: 'Diepgaande projectbespreking',
          screen: 'Scherm delen beschikbaar',
          recommendations: 'Gedetailleerde aanbevelingen',
        },
      },
    },
    success: {
      meta: {
        title: 'Boeking Bevestigd!',
        description: 'Je afspraak is succesvol ingepland.',
      },
      title: 'Je Bent Helemaal Klaar!',
      subtitle: 'Je afspraak is succesvol ingepland.',
      checkEmail: 'Controleer je e-mail voor een agenda-uitnodiging met alle details.',
      addToCalendar: 'Toevoegen aan Agenda',
      backHome: 'Terug naar Home',
      contact: 'Neem Contact Op',
    },
    faq: {
      title: 'Veelgestelde Vragen',
    },
  },
};
```

---

## Best Practices

### 1. Toegankelijkheid

```typescript
// Gebruik altijd correcte ARIA labels
<button
  type="button"
  aria-label="Open boekingsagenda"
  aria-expanded={isModalOpen}
  aria-controls="booking-modal"
>
  Nu Boeken
</button>

// Houd focus binnen modal
useEffect(() => {
  if (isOpen) {
    const firstFocusable = modalRef.current?.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    (firstFocusable as HTMLElement)?.focus();
  }
}, [isOpen]);
```

### 2. Laadstates

Toon altijd laadstates om gebruikersverwarring te voorkomen:

```typescript
{isLoading ? (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-8 h-8 animate-spin" />
    <span className="sr-only">Agenda laden...</span>
  </div>
) : (
  <CalendarWidget />
)}
```

### 3. Foutafhandeling

```typescript
const [error, setError] = useState<string | null>(null);

try {
  await initializeCalendar();
} catch (err) {
  setError('Laden van agenda mislukt. Ververs de pagina.');
  
  // Log naar error tracking service
  console.error('Agenda initialisatie mislukt:', err);
}
```

### 4. Mobiele Optimalisatie

```typescript
// Detecteer mobiel voor volledig scherm modal
const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

<div className={`
  ${isMobile ? 'fixed inset-0' : 'max-w-4xl max-h-[90vh]'}
  bg-white rounded-2xl overflow-hidden
`}>
```

### 5. Caching en Prestaties

```typescript
// Preload Cal.com script
<Head>
  <link
    rel="preconnect"
    href="https://app.cal.com"
  />
  <link
    rel="dns-prefetch"
    href="https://app.cal.com"
  />
</Head>
```

---

## Probleemoplossing

### Veelvoorkomende Problemen

#### Cal.com Widget Laadt Niet

```typescript
// Controleer of Cal correct is geïnitialiseerd
useEffect(() => {
  const checkCal = setInterval(() => {
    if (window.Cal?.loaded) {
      clearInterval(checkCal);
      setIsLoading(false);
    }
  }, 100);

  // Timeout na 10 seconden
  setTimeout(() => {
    clearInterval(checkCal);
    if (!window.Cal?.loaded) {
      setError('Agenda kon niet worden geladen. Probeer het opnieuw.');
    }
  }, 10000);

  return () => clearInterval(checkCal);
}, []);
```

#### Calendly Event Listeners Werken Niet

```typescript
// Zorg ervoor dat je de juiste event namen gebruikt
useCalendlyEventListener({
  onProfilePageViewed: () => console.log('Profiel bekeken'),
  onDateAndTimeSelected: () => console.log('Tijd geselecteerd'),
  onEventTypeViewed: () => console.log('Event type bekeken'),
  onEventScheduled: (e) => console.log('Gepland!', e),
});
```

#### Dark Mode Problemen

```typescript
// Cal.com
cal('ui', {
  theme: 'auto', // of 'dark' / 'light'
  styles: { branding: { brandColor: '#3b82f6' } },
});

// Calendly
pageSettings={{
  backgroundColor: isDark ? '1f2937' : 'ffffff',
  textColor: isDark ? 'f9fafb' : '1f2937',
  primaryColor: '3b82f6',
}}
```

#### TypeScript Fouten

```typescript
// Voeg toe aan types/calendar.d.ts indien nodig
declare module 'react-calendly' {
  export interface CalendlyEventPayload {
    event: {
      uri: string;
    };
    invitee: {
      uri: string;
      email: string;
      name: string;
    };
  }
}
```

---

## Conclusie

Je hebt nu een volledig functioneel boekingssysteem met:

- ✅ Zowel Cal.com als Calendly integraties
- ✅ Modal en inline embed opties
- ✅ Succesbevestiging met animaties
- ✅ Volledige analytics tracking
- ✅ Internationalisatie ondersteuning
- ✅ Toegankelijkheid compliance
- ✅ Mobiel-responsief ontwerp

### Volgende Stappen

1. **A/B Testing**: Test welke booking provider beter converteert
2. **Automatisering**: Zet Zapier/Make integraties op voor follow-ups
3. **CRM Integratie**: Verbind boekingen met je CRM
4. **Notificaties**: Voeg Slack/e-mail notificaties toe voor nieuwe boekingen

### Bronnen

- [Cal.com Documentatie](https://cal.com/docs)
- [Calendly Developer Docs](https://developer.calendly.com)
- [react-calendly Package](https://www.npmjs.com/package/react-calendly)
- [@calcom/embed-react Package](https://www.npmjs.com/package/@calcom/embed-react)

---

*Veel plezier met boeken! 📅*
