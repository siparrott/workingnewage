import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface PillarLink {
  title: string;
  path: string;
  description: string;
  badge?: string;
}

// All primary pillar + cluster pages grouped for cross-linking from support pages
const ALL_PILLARS: PillarLink[] = [
  { title: 'Familienfotos Wien', path: '/familienfotos-wien/', description: 'Studio & Outdoor, bis 12 Personen', badge: 'Beliebt' },
  { title: 'Neugeborenenfotos Wien', path: '/neugeborenenfotos-wien/', description: 'Ab 5 Tage nach der Geburt', badge: 'Top' },
  { title: 'Schwangerschaftsfotos Wien', path: '/schwangerschaftsfotos-wien/', description: 'Babybauch-Shooting im Studio' },
  { title: 'Babyfotos Wien', path: '/babyfotos-wien/', description: 'Babys von 3–12 Monaten' },
  { title: 'Kinderfotografie Wien', path: '/kinder-fotografie-wien/', description: 'Natürliche Kinderportraits' },
  { title: 'Business Portrait Wien', path: '/business-portrait-wien/', description: 'LinkedIn, Website & HR', badge: 'Business' },
  { title: 'Teamfotos Wien', path: '/teamfotos-wien/', description: 'Einheitliche Mitarbeiterbilder' },
  { title: 'Bewerbungsfotos Wien', path: '/bewerbungsfotos-wien/', description: 'Professionelle Bewerbungsbilder' },
  { title: 'Hochzeitsfotografie Wien', path: '/hochzeitsfotografie-wien/', description: 'Für euren besonderen Tag' },
  { title: 'Eventfotografie Wien', path: '/eventfotografie-wien/', description: 'Firmen- & Privatevent-Reportagen' },
  { title: 'Studio-Fotografie Wien', path: '/studio-fotografie-wien/', description: 'Modernes Fotostudio Wien 5' },
  { title: 'Portraitfotografie Wien', path: '/portrait-fotografie-wien/', description: 'Persönliche Portraits' },
];

interface PillarLinksBlockProps {
  /** Exclude the current page from the list */
  currentPath?: string;
  title?: string;
  /** Show only top N pillars (default: all) */
  limit?: number;
}

export function PillarLinksBlock({
  currentPath,
  title = 'Alle Fotoshootings in Wien',
  limit,
}: PillarLinksBlockProps) {
  const normalizedCurrent = currentPath
    ? currentPath.endsWith('/') ? currentPath : `${currentPath}/`
    : null;

  const links = ALL_PILLARS.filter(l => {
    const lp = l.path.endsWith('/') ? l.path : `${l.path}/`;
    return lp !== normalizedCurrent;
  }).slice(0, limit ?? ALL_PILLARS.length);

  return (
    <section className="py-14 bg-white border-t border-gray-100" data-seo="pillar-links">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-purple-900 mb-3 text-center">
          {title}
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Professionelle Fotografie in Wien – Studio Wehrgasse 11A/2+5, 1050 Wien
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="group relative bg-gray-50 rounded-xl border border-gray-100 p-4 hover:bg-purple-50 hover:border-purple-200 transition-all"
            >
              {link.badge && (
                <span className="absolute top-3 right-3 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">
                  {link.badge}
                </span>
              )}
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-purple-700 transition-colors leading-snug mb-1 pr-12">
                {link.title}
              </h3>
              <p className="text-xs text-gray-500 leading-snug mb-2">{link.description}</p>
              <span className="inline-flex items-center text-purple-600 text-xs font-medium group-hover:text-purple-700">
                Mehr <ArrowRight className="ml-0.5 h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PillarLinksBlock;
