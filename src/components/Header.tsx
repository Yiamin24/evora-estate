import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-[120rem] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl md:text-3xl font-bold text-primary">
              Evora Estate
            </h1>
            <span className="hidden md:block text-sm text-secondary">by Godrej Properties</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('highlights')}
              className="font-paragraph text-sm text-foreground hover:text-primary transition-colors"
            >
              Highlights
            </button>
            <button
              onClick={() => scrollToSection('pricing')}
              className="font-paragraph text-sm text-foreground hover:text-primary transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection('location')}
              className="font-paragraph text-sm text-foreground hover:text-primary transition-colors"
            >
              Location
            </button>
            <button
              onClick={() => scrollToSection('usps')}
              className="font-paragraph text-sm text-foreground hover:text-primary transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="font-paragraph text-sm text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => scrollToSection('contact')}
              variant="outline"
              className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-white transition-all"
            >
              Get Details
            </Button>
            <Button
              onClick={() => scrollToSection('contact')}
              className="bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
