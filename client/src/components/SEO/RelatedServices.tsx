import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export interface RelatedServiceLink {
  title: string;
  path: string;
  description?: string;
}

interface RelatedServicesProps {
  currentPath: string;
  title?: string;
}

// Internal links map for SEO cross-linking between service pages
const serviceLinks: Record<string, RelatedServiceLink[]> = {
  '/bewerbungsfotos-wien/': [
    { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Für LinkedIn & Website' },
    { title: 'Team- & Mitarbeiterfotos', path: '/teamfotos-wien/', description: 'Einheitlicher Look fürs Team' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/business-portrait-wien/': [
    { title: 'Bewerbungsfotos', path: '/bewerbungsfotos-wien/', description: 'Für Bewerbungen & HR' },
    { title: 'Team- & Mitarbeiterfotos', path: '/teamfotos-wien/', description: 'Einheitlicher Look fürs Team' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/neugeborenenfotos-wien/': [
    { title: 'Babyfotos (3–12 Monate)', path: '/babyfotos-wien/', description: 'Für ältere Babys' },
    { title: 'Schwangerschaftsfotos', path: '/schwangerschaftsfotos-wien/', description: 'Babybauch-Shooting' },
    { title: 'Familienfotos', path: '/familien-fotoshooting-wien/', description: 'Mit der ganzen Familie' }
  ],
  '/babyfotos-wien/': [
    { title: 'Neugeborenenfotos', path: '/neugeborenenfotos-wien/', description: 'Für die ersten Lebenstage' },
    { title: 'Familienfotos', path: '/familien-fotoshooting-wien/', description: 'Mit der ganzen Familie' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/schwangerschaftsfotos-wien/': [
    { title: 'Neugeborenenfotos', path: '/neugeborenenfotos-wien/', description: 'Nach der Geburt' },
    { title: 'Familienfotos', path: '/familien-fotoshooting-wien/', description: 'Mit der ganzen Familie' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/familien-fotoshooting-wien/': [
    { title: 'Neugeborenenfotos', path: '/neugeborenenfotos-wien/', description: 'Für Neugeborene' },
    { title: 'Babyfotos', path: '/babyfotos-wien/', description: 'Für Babys 3–12 Monate' },
    { title: 'Studio-Fotografie', path: '/studio-fotografie-wien/', description: 'Im professionellen Studio' }
  ],
  '/familienfotos-wien/': [
    { title: 'Neugeborenenfotos', path: '/neugeborenenfotos-wien/', description: 'Für Neugeborene' },
    { title: 'Babyfotos', path: '/babyfotos-wien/', description: 'Für Babys 3–12 Monate' },
    { title: 'Studio-Fotografie', path: '/studio-fotografie-wien/', description: 'Im professionellen Studio' }
  ],
  '/teamfotos-wien/': [
    { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Einzelportraits' },
    { title: 'Bewerbungsfotos', path: '/bewerbungsfotos-wien/', description: 'Für Bewerbungen' },
    { title: 'Eventfotografie', path: '/eventfotografie-wien/', description: 'Für Firmenevents' }
  ],
  '/eventfotografie-wien/': [
    { title: 'Hochzeitsfotografie', path: '/hochzeitsfotografie-wien/', description: 'Für euren großen Tag' },
    { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Für LinkedIn & Website' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/hochzeitsfotografie-wien/': [
    { title: 'Eventfotografie', path: '/eventfotografie-wien/', description: 'Für andere Events' },
    { title: 'Familienfotos', path: '/familien-fotoshooting-wien/', description: 'Für Familientreffen' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/portrait-fotografie-wien/': [
    { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Für den professionellen Auftritt' },
    { title: 'Bewerbungsfotos', path: '/bewerbungsfotos-wien/', description: 'Für Bewerbungen' },
    { title: 'Studio-Fotografie', path: '/studio-fotografie-wien/', description: 'Im professionellen Studio' }
  ],
  '/produkt-fotografie-wien/': [
    { title: 'Immobilienfotografie', path: '/immobilien-fotografie-wien/', description: 'Für Immobilien' },
    { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Für LinkedIn & Website' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/immobilien-fotografie-wien/': [
    { title: 'Produktfotografie', path: '/produkt-fotografie-wien/', description: 'Für Produkte' },
    { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Für Makler-Portraits' },
    { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
  ],
  '/studio-fotografie-wien/': [
    { title: 'Familienfotos', path: '/familien-fotoshooting-wien/', description: 'Mit der ganzen Familie' },
    { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Für LinkedIn & Website' },
    { title: 'Portraitfotografie', path: '/portrait-fotografie-wien/', description: 'Persönliche Portraits' }
  ]
};

// Default links if page not in map
const defaultLinks: RelatedServiceLink[] = [
  { title: 'Familienfotos', path: '/familien-fotoshooting-wien/', description: 'Für die ganze Familie' },
  { title: 'Business Portraits', path: '/business-portrait-wien/', description: 'Professionelle Portraits' },
  { title: 'Alle Fotoshootings', path: '/fotoshootings/', description: 'Übersicht aller Angebote' }
];

export function RelatedServices({ currentPath, title = 'Weitere Fotoshootings in Wien' }: RelatedServicesProps) {
  // Normalize path (ensure trailing slash)
  const normalizedPath = currentPath.endsWith('/') ? currentPath : `${currentPath}/`;
  const links = serviceLinks[normalizedPath] || defaultLinks;

  // Filter out current page from links
  const filteredLinks = links.filter(link => {
    const linkPath = link.path.endsWith('/') ? link.path : `${link.path}/`;
    return linkPath !== normalizedPath;
  });

  if (filteredLinks.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50" data-seo="related-services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-8 text-center">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredLinks.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <h3 className="text-lg font-semibold text-purple-800 mb-2 group-hover:text-purple-600 transition-colors">
                {link.title}
              </h3>
              {link.description && (
                <p className="text-gray-600 text-sm mb-3">{link.description}</p>
              )}
              <span className="inline-flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                Mehr erfahren <ArrowRight className="ml-1 h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedServices;
