import React from 'react';

const PartnerLogos: React.FC = () => {
  // Partner logos with correct URL-to-image mappings based on visual appearance
  const partners = [
    // Row 1
    { url: "https://i.postimg.cc/ZKLvM5kh/erste.jpg", alt: "Erste Bank", link: "https://www.erstebank.at" },
    { url: "https://i.postimg.cc/xT9cMVXp/217447.png", alt: "Open Day", link: "https://www.openday.at" },
    { url: "https://i.postimg.cc/hPRVYYfV/bank-austria-edvfiasko-kostet-bank-austria20121107201134.jpg", alt: "Bank Austria", link: "https://www.bankaustria.at" },
    { url: "https://i.postimg.cc/bJGQXcx9/1626165386655.jpg", alt: "KIRA Kinder", link: "https://www.kira.at" },
    { url: "https://i.postimg.cc/MHVVT7rc/download-1.png", alt: "Mattel", link: "https://www.mattel.com" },
    { url: "https://i.postimg.cc/sfhpwzDV/download-2.jpg", alt: "REMAX", link: "https://www.remax.at" },
    // Row 2
    { url: "https://i.postimg.cc/26PnrcTR/cropped-logo-web-text1.png", alt: "Vapiano", link: "https://www.vapiano.at" },
    { url: "https://i.postimg.cc/1XGVP9fw/download-8.png", alt: "Volksbank", link: "https://www.volksbank.at" },
    { url: "https://i.postimg.cc/Qd05HxSq/download-3.png", alt: "Trayport", link: "https://www.trayport.com" },
    { url: "https://i.postimg.cc/2jhZnx2y/download.jpg", alt: "Canon", link: "https://www.canon.at" },
    { url: "https://i.postimg.cc/SNLcbGM3/download-2.png", alt: "SPAR", link: "https://www.spar.at" },
    { url: "https://i.postimg.cc/s2xWSdNC/download-4.png", alt: "Stadt Wien", link: "https://www.wien.gv.at" },
    // Row 3
    { url: "https://i.postimg.cc/Jz6DRY46/images-3.jpg", alt: "Nielsen", link: "https://www.nielsen.com" },
    { url: "https://i.postimg.cc/mkf10c2T/download-7.png", alt: "Wiener Musikverein", link: "https://www.musikverein.at" },
    { url: "https://i.postimg.cc/3xKm8DjR/download-4.jpg", alt: "Derenko", link: "https://www.derenko.at" },
    { url: "https://i.postimg.cc/ZKLvM5kh/erste.jpg", alt: "Erste Group", link: "https://www.erstegroup.com" },
    { url: "https://i.postimg.cc/wTzs2sGV/Eurovision.jpg", alt: "Eurovision Song Contest", link: "https://www.eurovision.tv" },
    { url: "https://i.postimg.cc/jSdn0YKn/Google-Trusted-Photographer-Badge.jpg", alt: "Google Trusted Photographer", link: "https://www.google.com/streetview/trusted" },
    // Row 4
    { url: "https://i.postimg.cc/DzSW0QS2/IGEPHA-Logo-transparent.png", alt: "IGEPHA", link: "https://www.igepha.at" },
    { url: "https://i.postimg.cc/1XGVP9fw/download-8.png", alt: "Design District", link: "https://www.designdistrict.at" },
    { url: "https://i.postimg.cc/g01xZwh3/images.png", alt: "Q19", link: "https://www.q19.at" },
    { url: "https://i.postimg.cc/wvJ7c65Z/kieninger-lagler-gmbh-full-1510837544.jpg", alt: "Kieninger Lagler", link: "https://www.kieninger-lagler.at" },
    { url: "https://i.postimg.cc/xTgqPpHf/kl-herzen-logo4c-ohnetext.jpg", alt: "Kleine Herzen", link: "https://www.kleineherzen.at" },
    { url: "https://i.postimg.cc/PfWCC558/RB4PRNY.jpg", alt: "smartex", link: "https://www.smartex.at" },
    // Row 5
    { url: "https://i.postimg.cc/Gpfyx7W8/download-5.png", alt: "PORR", link: "https://www.porr.at" },
    { url: "https://i.postimg.cc/rmttnGTh/download-6.png", alt: "Seeff Properties", link: "https://www.seeff.com" },
    { url: "https://i.postimg.cc/rwrHG303/Leier-International-logo-svg.png", alt: "Leier", link: "https://www.leier.at" },
    { url: "https://i.postimg.cc/gjWrgfNJ/logo-300x141.png", alt: "Liechtenstein Gruppe", link: "https://www.liechtensteingruppe.at" },
    { url: "https://i.postimg.cc/BbnyxvHB/images.png", alt: "Leier", link: "https://www.leier.at" },
    { url: "https://i.postimg.cc/PrccwTx1/Logo-BB-svg.png", alt: "ÖBB", link: "https://www.oebb.at" },
    // Row 6
    { url: "https://i.postimg.cc/vT2KXdvF/mydays-logo-png-seeklogo-357684.png", alt: "MyDays", link: "https://www.mydays.at" },
    { url: "https://i.postimg.cc/66MFBdxj/QAP.png", alt: "Qualified Austrian Photographer", link: "https://www.wkw.at" },
    { url: "https://i.postimg.cc/QxVwCHXX/RIH-logo-90-90-90-300x152.jpg", alt: "RIH", link: "https://www.rih.at" },
    { url: "https://i.postimg.cc/FKXBTp0R/stekovics-tomaten-chili.jpg", alt: "Stekovics", link: "https://www.stekovics.at" },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Our Partners
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <a 
              key={index}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-4 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              title={partner.alt}
            >
              <img
                src={partner.url}
                alt={partner.alt}
                loading="lazy"
                decoding="async"
                className="max-h-16 w-auto object-contain transition-transform hover:scale-105"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnerLogos;