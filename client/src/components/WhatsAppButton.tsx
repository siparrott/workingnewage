import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { SITE } from '../config/site';

const WhatsAppButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = SITE.phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  
  // Pre-filled message for better UX
  const defaultMessage = encodeURIComponent('Hallo! Ich interessiere mich für ein Fotoshooting und hätte gerne mehr Informationen.');
  const whatsappUrlWithMessage = `${whatsappUrl}?text=${defaultMessage}`;

  return (
    <>
      {/* Floating WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Chat Popup */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-green-600 px-4 py-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">{SITE.name}</h3>
                    <p className="text-xs text-green-100">Normalerweise antwortet innerhalb 1 Stunde</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Chat Content */}
            <div className="p-4 bg-[#e5ddd5]">
              <div className="bg-white rounded-lg p-3 shadow-sm max-w-[85%]">
                <p className="text-sm text-gray-700">
                  👋 Hallo! Wie können wir Ihnen helfen? Schreiben Sie uns direkt über WhatsApp!
                </p>
                <span className="text-xs text-gray-400 mt-1 block text-right">Jetzt</span>
              </div>
            </div>
            
            {/* Action Button */}
            <div className="p-4 bg-gray-50 border-t">
              <a
                href={whatsappUrlWithMessage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat starten
              </a>
            </div>
          </div>
        )}
        
        {/* Main Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isOpen 
              ? 'bg-gray-600 hover:bg-gray-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
          aria-label={isOpen ? 'Chat schließen' : 'WhatsApp Chat öffnen'}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </button>
        
        {/* Pulse animation when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
        )}
      </div>
    </>
  );
};

export default WhatsAppButton;
