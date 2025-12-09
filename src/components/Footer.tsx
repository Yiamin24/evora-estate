import { motion } from 'framer-motion';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t-2 border-primary/20">
      <div className="max-w-[120rem] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Project Info */}
          <div>
            <h3 className="font-heading text-2xl font-bold text-primary mb-4">
              Evora Estate
            </h3>
            <p className="font-paragraph text-sm text-foreground/70 mb-4">
              Premium Resort-Style Plotted Development by Godrej Properties
            </p>
            <div className="space-y-2">
              <p className="font-paragraph text-xs text-foreground/60">
                <strong>RERA Number:</strong> RERA-PKL-1860-2025
              </p>
              <p className="font-paragraph text-xs text-foreground/60">
                RERA Status: Approved & ready for certificate issuing
              </p>
            </div>
          </div>

          {/* Realty X Info */}
          <div>
            <h4 className="font-heading text-xl font-bold text-primary mb-4">
              Realty X
            </h4>
            <p className="font-paragraph text-sm text-foreground/70 mb-4">
              Exclusive Channel Partner
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary" />
                <span className="font-paragraph text-sm text-foreground/70">
                  +91 98765 43210
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary" />
                <span className="font-paragraph text-sm text-foreground/70">
                  info@realtyx.com
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-paragraph text-sm text-foreground/70">
                  Sector 40, Panipat, Haryana
                </span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-xl font-bold text-primary mb-4">
              Quick Links
            </h4>
            <div className="space-y-2">
              <a
                href="#highlights"
                className="block font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                Key Highlights
              </a>
              <a
                href="#pricing"
                className="block font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                Pricing
              </a>
              <a
                href="#location"
                className="block font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                Location
              </a>
              <a
                href="#usps"
                className="block font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#contact"
                className="block font-paragraph text-sm text-foreground/70 hover:text-primary transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-light-gold/20 border border-primary/20 rounded-lg p-6 mb-8"
        >
          <p className="font-paragraph text-xs text-foreground/60 leading-relaxed">
            <strong>Disclaimer:</strong> This website is for marketing and informational purposes only. 
            All information provided is subject to change without notice. The developer reserves the right 
            to make modifications to the project specifications, pricing, and availability. Images shown 
            are for representational purposes only and may not reflect the actual product. Pre-launch 
            pricing is valid only during the specified period (December 15-20, 2025). Please verify all 
            details with Realty X or Godrej Properties before making any investment decisions. This does 
            not constitute an offer or contract. RERA registration does not guarantee project completion 
            or delivery timelines.
          </p>
        </motion.div>

        {/* Copyright */}
        <div className="text-center">
          <p className="font-paragraph text-xs text-foreground/50">
            © 2025 Evora Estate by Godrej Properties. Exclusively marketed by Realty X. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
