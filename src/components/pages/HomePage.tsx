// HPI 1.6-G
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GoogleMap from '@/components/GoogleMap';
import {
  Leaf,
  MapPin,
  Grid3x3,
  Shield,
  TrendingUp,
  Users,
  Home,
  Award,
  Building2,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star
} from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import type {
  KeyHighlights,
  LifestyleGallery,
  LocationAdvantages,
  ProjectPartners,
  ProjectUSPs,
} from '@/entities';

// --- Utility Components ---

type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(element);
      }
    }, { threshold: 0.1 });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className || ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const SectionDivider = () => (
  <div className="w-full flex justify-center py-12">
    <div className="h-px w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
  </div>
);

// --- Main Component ---

export default function HomePage() {
  // --- Data Fidelity Protocol: Canonical Data Sources ---
  const [keyHighlights, setKeyHighlights] = useState<KeyHighlights[]>([]);
  const [lifestyleGallery, setLifestyleGallery] = useState<LifestyleGallery[]>([]);
  const [locationAdvantages, setLocationAdvantages] = useState<LocationAdvantages | null>(null);
  const [projectPartners, setProjectPartners] = useState<ProjectPartners[]>([]);
  const [projectUSPs, setProjectUSPs] = useState<ProjectUSPs[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
    whatsapp: false,
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // --- Scroll & Parallax Hooks ---
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 400]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // --- Effects (Preserved Logic) ---
  useEffect(() => {
    loadData();
    startCountdown();
  }, []);

  const loadData = async () => {
    const highlights = await BaseCrudService.getAll<KeyHighlights>('keyhighlights');
    const gallery = await BaseCrudService.getAll<LifestyleGallery>('lifestylegallery');
    const location = await BaseCrudService.getAll<LocationAdvantages>('locationadvantages');
    const partners = await BaseCrudService.getAll<ProjectPartners>('projectpartners');
    const usps = await BaseCrudService.getAll<ProjectUSPs>('projectusps');

    setKeyHighlights(highlights.items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    setLifestyleGallery(gallery.items.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
    setLocationAdvantages(location.items[0] || null);
    setProjectPartners(partners.items);
    setProjectUSPs(usps.items.filter(usp => usp.isActive).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
  };

  const startCountdown = () => {
    const targetDate = new Date('2025-12-20T23:59:59').getTime(); // Updated to end of pre-launch window

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you! We will contact you shortly.');
    setFormData({ name: '', phone: '', email: '', message: '', whatsapp: false });
  };

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Lifestyle Slider State ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (lifestyleGallery.length || 6));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (lifestyleGallery.length || 6)) % (lifestyleGallery.length || 6));
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-background font-paragraph text-foreground overflow-x-clip selection:bg-primary/20 selection:text-primary">
      <Header />

      {/* 1️⃣ HERO SECTION (PARALLAX + LUXURY LOOK) */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
          <Image
            src="https://static.wixstatic.com/media/cef78c_0294cbf2be46425299f4ed4acd1dea82~mv2.png?id=hero-resort-aerial"
            alt="Evora Estate luxury resort-style township aerial view with lush greenery"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-gold-accent rounded-full blur-[1px]"
              initial={{
                x: Math.random() * 100 + 'vw',
                y: Math.random() * 100 + 'vh',
                opacity: 0
              }}
              animate={{
                y: [null, Math.random() * -100],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 5 + Math.random() * 5,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        <div className="relative z-20 container mx-auto px-6 text-center">
          <AnimatedElement>
            <div className="inline-block mb-6 px-4 py-1 border border-white/30 rounded-full backdrop-blur-sm bg-white/10">
              <span className="text-white/90 text-sm tracking-widest uppercase font-medium">RERA Approved: RERA-PKL-1860-2025</span>
            </div>
          </AnimatedElement>

          <AnimatedElement delay={200}>
            <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 drop-shadow-2xl tracking-tight">
              Evora Estate
            </h1>
          </AnimatedElement>

          <AnimatedElement delay={400}>
            <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
              Premium Resort-Style Plotted Development in Sector 40, Panipat. <br className="hidden md:block" />
              <span className="text-light-gold font-medium">Launching at an Exclusive Pre-Launch Price – Limited 5-Day Window</span>
            </p>
          </AnimatedElement>

          <AnimatedElement delay={800}>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={scrollToContact}
                size="lg"
                className="bg-primary text-white hover:bg-primary/90 px-10 py-7 text-lg rounded-none border border-primary shadow-[0_0_20px_rgba(184,134,11,0.3)] hover:shadow-[0_0_30px_rgba(184,134,11,0.5)] transition-all duration-300"
              >
                Book Pre-Launch Slot
              </Button>
              <Button
                onClick={() => document.getElementById('highlights')?.scrollIntoView({ behavior: 'smooth' })}
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary px-10 py-7 text-lg rounded-none backdrop-blur-sm transition-all duration-300"
              >
                Get Project Details
              </Button>
            </div>
          </AnimatedElement>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce text-white/50">
          <ArrowRight className="rotate-90 w-6 h-6" />
        </div>
      </section>

      {/* 2️⃣ KEY HIGHLIGHTS SECTION (LUXURY IMAGE CARDS WITH ANIMATED OVERLAYS) */}
      <section id="highlights" className="py-24 md:py-32 bg-white relative">
        <div className="container mx-auto px-6 max-w-[120rem]">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-4">43 Acres Township</h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">Expansive integrated living with premium amenities and thoughtfully designed spaces</p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyHighlights.length > 0 ? (
              keyHighlights.map((highlight, index) => (
                <AnimatedElement key={highlight._id} delay={index * 100}>
                  <div className="group relative h-80 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer">
                    {/* Background Image */}
                    {highlight.highlightIcon ? (
                      <Image 
                        src={highlight.highlightIcon} 
                        alt={highlight.highlightTitle || ''} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-heading text-3xl md:text-4xl font-bold text-white mb-3"
                      >
                        {highlight.highlightTitle}
                      </motion.h3>
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/90 text-base leading-relaxed"
                      >
                        {highlight.shortDescription}
                      </motion.p>
                    </div>
                  </div>
                </AnimatedElement>
              ))
            ) : (
              // Fallback Static Data with Images
              <>
                {[
                  { 
                    title: "43 Acres Township", 
                    desc: "Expansive Integrated Living",
                    image: "https://static.wixstatic.com/media/cef78c_0294cbf2be46425299f4ed4acd1dea82~mv2.png?id=highlight-township"
                  },
                  { 
                    title: "750 Premium Plots", 
                    desc: "Exclusive Inventory",
                    image: "https://static.wixstatic.com/media/cef78c_18f05f7fe37d4a04af69d54d4637c019~mv2.png?id=highlight-plots"
                  },
                  { 
                    title: "Resort-Style Living", 
                    desc: "Nature-First Design",
                    image: "https://static.wixstatic.com/media/cef78c_9e93d53231df40feabb3d7106b15637e~mv2.png?id=highlight-resort"
                  },
                  { 
                    title: "RERA Approved", 
                    desc: "RERA-PKL-1860-2025",
                    image: "https://static.wixstatic.com/media/cef78c_0294cbf2be46425299f4ed4acd1dea82~mv2.png?id=highlight-rera"
                  }
                ].map((item, i) => (
                  <AnimatedElement key={i} delay={i * 100}>
                    <div className="group relative h-80 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 cursor-pointer">
                      {/* Background Image */}
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 group-hover:via-black/50 transition-all duration-500" />
                      
                      {/* Content Overlay */}
                      <div className="absolute inset-0 flex flex-col justify-end p-8">
                        <motion.h3 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className="font-heading text-3xl md:text-4xl font-bold text-white mb-3"
                        >
                          {item.title}
                        </motion.h3>
                        <motion.p 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="text-white/90 text-base leading-relaxed"
                        >
                          {item.desc}
                        </motion.p>
                      </div>
                    </div>
                  </AnimatedElement>
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* 3️⃣ PRICING SECTION (COMPARISON + SAVINGS) */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-white via-light-gold/20 to-white relative overflow-hidden">
        {/* Background Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gold-accent rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-6 max-w-[120rem] relative z-10">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-4">Exclusive Pre-Launch Pricing</h2>
              <p className="text-foreground/60 max-w-2xl mx-auto">Secure your legacy at an unbeatable value. Offer valid for a limited time.</p>
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
            {/* Standard Price Card */}
            <AnimatedElement delay={100}>
              <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm opacity-80 hover:opacity-100 transition-opacity">
                <h3 className="font-heading text-3xl text-gray-400 mb-2">Standard Price</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-gray-400 line-through decoration-red-400 decoration-2">₹1,50,000</span>
                  <span className="text-gray-400">/ sq yd</span>
                </div>
                <ul className="space-y-4 text-gray-500">
                  <li className="flex items-center gap-3"><Clock className="w-5 h-5" /> Post-Launch Pricing</li>
                  <li className="flex items-center gap-3"><Grid3x3 className="w-5 h-5" /> Standard Inventory Allocation</li>
                </ul>
              </div>
            </AnimatedElement>

            {/* Pre-Launch Price Card */}
            <AnimatedElement delay={300}>
              <div className="relative bg-gradient-to-br from-primary to-[#8B6508] p-10 rounded-2xl shadow-2xl text-white transform scale-105 border-2 border-gold-accent/30">
                <div className="absolute -top-5 right-10 bg-white text-primary px-6 py-2 rounded-full font-bold shadow-lg animate-pulse">
                  SAVE ₹20,000 / sq yd
                </div>
                <h3 className="font-heading text-3xl text-white/90 mb-2">Pre-Launch Offer</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-bold text-white">₹1,30,000</span>
                  <span className="text-white/80">/ sq yd</span>
                </div>
                <p className="text-gold-accent font-medium mb-8">13.33% Instant Discount</p>

                <div className="space-y-4 border-t border-white/20 pt-6 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">EOI Amount</span>
                    <span className="text-2xl font-bold">₹5,00,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Plot Sizes</span>
                    <span className="text-xl font-bold">130 – 179 sq yd</span>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4 text-center mb-6">
                  <p className="text-sm text-white/90">Pre-launch pricing valid only till <span className="font-bold text-gold-accent">Dec 20, 2025</span></p>
                </div>

                <Button onClick={scrollToContact} className="w-full bg-white text-primary hover:bg-gray-100 font-bold py-6 text-lg">
                  Lock This Price Now
                </Button>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* 4️⃣ LIFESTYLE / GALLERY SECTION */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 max-w-[120rem]">
          <AnimatedElement>
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-4">Experience Resort-Style Living</h2>
                <p className="text-lg text-foreground/70">Green open spaces, peaceful landscapes, and thoughtfully designed neighbourhoods.</p>
              </div>
              <div className="flex gap-4 mt-6 md:mt-0">
                <Button variant="outline" size="icon" onClick={prevSlide} className="rounded-full border-primary/30 hover:bg-primary hover:text-white transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextSlide} className="rounded-full border-primary/30 hover:bg-primary hover:text-white transition-colors">
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </AnimatedElement>

          <div className="relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7 }}
                className="absolute inset-0"
              >
                {lifestyleGallery.length > 0 ? (
                  <>
                    <Image
                      src={lifestyleGallery[currentSlide].image || ''}
                      alt={lifestyleGallery[currentSlide].altText || 'Lifestyle'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-12 max-w-3xl">
                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
                      >
                        {lifestyleGallery[currentSlide].imageTitle}
                      </motion.h3>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/90 text-lg"
                      >
                        {lifestyleGallery[currentSlide].description}
                      </motion.p>
                    </div>
                  </>
                ) : (
                  // Fallback Slider Content
                  <>
                    <Image
                      src={'https://static.wixstatic.com/media/cef78c_18f05f7fe37d4a04af69d54d4637c019~mv2.png?originWidth=1024&originHeight=576'}
                      alt="Lifestyle"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-12 max-w-3xl">
                      <motion.h3
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-heading text-4xl md:text-5xl font-bold text-white mb-4"
                      >
                        {['Green Park Spaces', 'Walking Trails', 'Beautiful Landscapes', 'Aerial Township View', 'Clubhouse Amenities'][currentSlide % 5]}
                      </motion.h3>
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/90 text-lg"
                      >
                        {['Lush landscaped gardens for serene mornings.', 'Scenic pathways designed for your daily wellness.', 'Thoughtfully designed zones for community interaction.', 'Master-planned layout integrating nature and luxury.', 'Premium facilities for a resort-like experience.'][currentSlide % 5]}
                      </motion.p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 5️⃣ LOCATION ADVANTAGE SECTION */}
      <section id="location" className="py-24 bg-gradient-to-br from-primary/5 to-gold-accent/5">
        <div className="container mx-auto px-6 max-w-[120rem]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedElement>
              <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary mb-8 leading-tight">
                {locationAdvantages?.sectionHeadline || 'A Location That Connects You Everywhere'}
              </h2>
              <div className="space-y-6">
                {(locationAdvantages ? [
                  locationAdvantages.advantage1,
                  locationAdvantages.advantage2,
                  locationAdvantages.advantage3,
                  locationAdvantages.advantage4,
                  locationAdvantages.advantage5
                ] : [
                  "Prime NH44 GT Road access",
                  "40 minutes to Karnal",
                  "60–70 minutes to Delhi-NCR",
                  "Central Panipat connectivity",
                  "Surrounded by established residential zones"
                ]).filter(Boolean).map((adv, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-primary/10 hover:border-primary/40 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-lg text-foreground/80 font-medium">{adv}</span>
                  </div>
                ))}
              </div>
            </AnimatedElement>

            <AnimatedElement delay={200}>
              <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px]">
                <GoogleMap />
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* 6️⃣ USPs SECTION - WHY CHOOSE EVORA ESTATE */}
      <section id="usps" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-[120rem]">
          <AnimatedElement>
            <div className="text-center mb-20">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="font-heading text-5xl md:text-7xl font-bold text-primary mb-6"
              >
                Why Choose Evora Estate
              </motion.h2>
              <motion.div 
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                className="h-1 w-32 bg-gradient-to-r from-primary via-gold-accent to-primary mx-auto origin-center"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg text-foreground/70 mt-6 max-w-2xl mx-auto"
              >
                Discover what makes Evora Estate the premier choice for luxury living
              </motion.p>
            </div>
          </AnimatedElement>

          {/* Enhanced Grid with Image-First Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectUSPs.length > 0 ? (
              projectUSPs.map((usp, i) => (
                <AnimatedElement key={usp._id} delay={i * 80}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="group relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  >
                    {/* Large Background Image */}
                    {usp.uspIcon ? (
                      <motion.div
                        className="absolute inset-0"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Image 
                          src={usp.uspIcon} 
                          alt={usp.uspText || ''} 
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-gold-accent/10" />
                    )}

                    {/* Gradient Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                      whileHover={{ opacity: 0.95 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Content Overlay */}
                    <div className="relative h-full min-h-[400px] flex flex-col justify-end p-8 z-10">
                      {/* Icon with Animation */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                        className="mb-4 w-12 h-12 rounded-full bg-gold-accent/20 flex items-center justify-center group-hover:bg-gold-accent/40 transition-colors duration-300"
                      >
                        <div className="text-gold-accent">
                          {usp.uspIcon ? (
                            <Star className="w-6 h-6" />
                          ) : (
                            <Star className="w-6 h-6" />
                          )}
                        </div>
                      </motion.div>

                      {/* Animated Title */}
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                        className="font-heading text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
                      >
                        {usp.uspText}
                      </motion.h3>

                      {/* Animated Description */}
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                        className="text-white/90 text-base leading-relaxed"
                      >
                        {usp.shortDescription}
                      </motion.p>

                      {/* Animated Accent Line */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                        className="mt-4 h-1 w-12 bg-gold-accent origin-left"
                      />
                    </div>

                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gold-accent/0 via-gold-accent/10 to-gold-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ opacity: 0.2 }}
                    />
                  </motion.div>
                </AnimatedElement>
              ))
            ) : (
              // Fallback USPs with Enhanced Design
              [
                { 
                  icon: <Leaf />, 
                  title: 'Resort-style green living', 
                  desc: 'Lush landscapes and open spaces designed for your wellness',
                  image: 'https://static.wixstatic.com/media/cef78c_9e93d53231df40feabb3d7106b15637e~mv2.png?id=usp-green'
                },
                { 
                  icon: <Grid3x3 />, 
                  title: 'Master-planned layout', 
                  desc: 'Thoughtfully designed community with premium amenities',
                  image: 'https://static.wixstatic.com/media/cef78c_18f05f7fe37d4a04af69d54d4637c019~mv2.png?id=usp-layout'
                },
                { 
                  icon: <Building2 />, 
                  title: '43-acre township', 
                  desc: 'Expansive integrated development with world-class facilities',
                  image: 'https://static.wixstatic.com/media/cef78c_0294cbf2be46425299f4ed4acd1dea82~mv2.png?id=usp-township'
                },
                { 
                  icon: <Home />, 
                  title: '750 exclusive plots', 
                  desc: 'Limited premium inventory with prime locations',
                  image: 'https://static.wixstatic.com/media/cef78c_18f05f7fe37d4a04af69d54d4637c019~mv2.png?id=usp-plots'
                },
                { 
                  icon: <MapPin />, 
                  title: 'Prime connectivity', 
                  desc: 'NH44 GT Road access with excellent regional links',
                  image: 'https://static.wixstatic.com/media/cef78c_4eb8389129164d20ae5f84d56138b12c~mv2.png?id=usp-location'
                },
                { 
                  icon: <Award />, 
                  title: 'Godrej brand trust', 
                  desc: 'Legacy of excellence and premium quality standards',
                  image: 'https://static.wixstatic.com/media/cef78c_0294cbf2be46425299f4ed4acd1dea82~mv2.png?id=usp-godrej'
                },
                { 
                  icon: <Shield />, 
                  title: 'RERA-approved', 
                  desc: 'Investment security with regulatory compliance',
                  image: 'https://static.wixstatic.com/media/cef78c_9e93d53231df40feabb3d7106b15637e~mv2.png?id=usp-rera'
                },
                { 
                  icon: <TrendingUp />, 
                  title: 'Strong appreciation', 
                  desc: 'Prime location advantage with growth potential',
                  image: 'https://static.wixstatic.com/media/cef78c_18f05f7fe37d4a04af69d54d4637c019~mv2.png?id=usp-growth'
                },
                { 
                  icon: <Users />, 
                  title: 'Peaceful family lifestyle', 
                  desc: 'Safe and serene environment for your loved ones',
                  image: 'https://static.wixstatic.com/media/cef78c_0294cbf2be46425299f4ed4acd1dea82~mv2.png?id=usp-family'
                },
              ].map((item, i) => (
                <AnimatedElement key={i} delay={i * 80}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: i * 0.08 }}
                    className="group relative h-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  >
                    {/* Large Background Image */}
                    <motion.div
                      className="absolute inset-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                    </motion.div>

                    {/* Gradient Overlay */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                      whileHover={{ opacity: 0.95 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Content Overlay */}
                    <div className="relative h-full min-h-[400px] flex flex-col justify-end p-8 z-10">
                      {/* Icon with Animation */}
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                        className="mb-4 w-12 h-12 rounded-full bg-gold-accent/20 flex items-center justify-center group-hover:bg-gold-accent/40 transition-colors duration-300"
                      >
                        <div className="text-gold-accent">
                          {React.cloneElement(item.icon as React.ReactElement, { className: "w-6 h-6 stroke-[1.5]" })}
                        </div>
                      </motion.div>

                      {/* Animated Title */}
                      <motion.h3 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.1 }}
                        className="font-heading text-2xl md:text-3xl font-bold text-white mb-3 leading-tight"
                      >
                        {item.title}
                      </motion.h3>

                      {/* Animated Description */}
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: i * 0.08 + 0.2 }}
                        className="text-white/90 text-base leading-relaxed"
                      >
                        {item.desc}
                      </motion.p>

                      {/* Animated Accent Line */}
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                        className="mt-4 h-1 w-12 bg-gold-accent origin-left"
                      />
                    </div>

                    {/* Hover Glow Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gold-accent/0 via-gold-accent/10 to-gold-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ opacity: 0.2 }}
                    />
                  </motion.div>
                </AnimatedElement>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 7️⃣ PRE-LAUNCH COUNTDOWN SECTION */}
      <section className="py-24 bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20" />
        <div className="container mx-auto px-6 max-w-[120rem] relative z-10 text-center">
          <AnimatedElement>
            <h2 className="font-heading text-5xl md:text-7xl font-bold text-gold-accent mb-4">Pre-Launch Ends Soon</h2>
            <p className="text-xl text-white/80 mb-12">December 15–20, 2025 | Limited 5-day opportunity</p>
          </AnimatedElement>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
            {Object.entries(timeLeft).map(([unit, value], i) => (
              <AnimatedElement key={unit} delay={i * 100}>
                <div className="bg-white/5 backdrop-blur-md border border-gold-accent/30 rounded-2xl p-6">
                  <div className="font-heading text-5xl md:text-6xl font-bold text-white mb-2 tabular-nums">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm uppercase tracking-widest text-gold-accent">{unit}</div>
                </div>
              </AnimatedElement>
            ))}
          </div>

          <AnimatedElement delay={400}>
            <Button onClick={scrollToContact} size="lg" className="bg-gold-accent text-black hover:bg-white px-12 py-6 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_40px_rgba(255,215,0,0.6)] transition-all">
              Register Interest Now
            </Button>
          </AnimatedElement>
        </div>
      </section>

      {/* 8️⃣ ABOUT DEVELOPER & CHANNEL PARTNER */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-[120rem]">
          <AnimatedElement>
            <div className="text-center mb-16">
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-4">Trusted Partners</h2>
              <div className="h-1 w-24 bg-primary mx-auto" />
            </div>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Godrej */}
            <AnimatedElement delay={100}>
              <div className="p-10 bg-background rounded-2xl border border-primary/10 text-center h-full hover:shadow-xl transition-shadow">
                <h3 className="font-heading text-3xl font-bold text-primary mb-2">Godrej Properties</h3>
                <p className="text-sm uppercase tracking-widest text-foreground/50 mb-6">Developer</p>
                <ul className="text-left space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/80">Trusted national developer with decades of excellence</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/80">Award-winning planning & sustainable design practices</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/80">Strong track record in premium plotted developments</span>
                  </li>
                </ul>
              </div>
            </AnimatedElement>

            {/* Realty X */}
            <AnimatedElement delay={200}>
              <div className="p-10 bg-background rounded-2xl border border-primary/10 text-center h-full hover:shadow-xl transition-shadow">
                <h3 className="font-heading text-3xl font-bold text-primary mb-2">Realty X</h3>
                <p className="text-sm uppercase tracking-widest text-foreground/50 mb-6">Exclusive Channel Partner</p>
                <ul className="text-left space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/80">Exclusive pre-launch partner for Evora Estate</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/80">Known for premium project curation and client service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-foreground/80">Trusted by investors & families across the region</span>
                  </li>
                </ul>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </section>

      {/* 9️⃣ LEAD FORM SECTION */}
      <section id="contact" className="py-24 bg-gradient-to-b from-white to-light-gold/30 relative">
        <div className="container mx-auto px-6 max-w-[120rem] relative z-10">
          <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-primary/20">
            <div className="bg-primary p-8 text-center">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-2">Get Pre-Launch Access</h2>
              <p className="text-white/90">Limited slots | Best pricing guaranteed</p>
            </div>
            <div className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Full Name</label>
                    <Input
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="border-primary/20 focus:border-primary h-12"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground/70">Phone Number</label>
                    <Input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-primary/20 focus:border-primary h-12"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-primary/20 focus:border-primary h-12"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">Message</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-primary/20 focus:border-primary min-h-[120px]"
                    placeholder="I am interested in..."
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp"
                    checked={formData.whatsapp}
                    onCheckedChange={(checked) => setFormData({ ...formData, whatsapp: checked as boolean })}
                    className="border-primary data-[state=checked]:bg-primary"
                  />
                  <label htmlFor="whatsapp" className="text-sm text-foreground/70 cursor-pointer select-none">
                    Send me updates on WhatsApp
                  </label>
                </div>
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all">
                  Request a Call Back
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}