import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Shield, MessageCircle, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import upesLogo from '@/assets/upes-logo.jpeg';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={upesLogo} alt="UPES" className="h-10 w-10 rounded-lg object-contain" />
            <span className="text-xl font-bold text-foreground">UPES Lost & Found</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto text-center max-w-4xl">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              For UPES Students
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 text-foreground"
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
          >
            Lost Something at UPES?{' '}
            <span className="gradient-text">We've Got You Covered.</span>
          </motion.h1>
          <motion.p
            className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
          >
            Report lost items, post found items, and claim them securely — all in one place built for UPES campus.
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial="hidden" animate="visible" variants={fadeUp} custom={3}>
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground px-8 gap-2">
                Report Lost Item <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="lg" variant="outline" className="px-8">
                Report Found Item
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why UPES Lost & Found?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">A modern platform designed specifically for UPES students to manage lost and found items.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Search, title: 'Easy Reporting', desc: 'Report lost or found items in seconds with our simple form.' },
              { icon: Shield, title: 'Secure Claiming', desc: 'Verify ownership with proof before claiming any item.' },
              { icon: MessageCircle, title: 'AI Assistant', desc: 'Get instant help finding your items with our smart chatbot.' },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="bg-card rounded-2xl p-8 shadow-sm hover-lift border border-border/50"
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Report', desc: 'Post your lost or found item with details and a photo.' },
              { step: '02', title: 'Discover', desc: 'Browse items and search by category, location, or date.' },
              { step: '03', title: 'Claim', desc: 'Submit proof of ownership and get verified by admins.' },
            ].map((item, i) => (
              <motion.div key={item.step} className="text-center" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <div className="text-5xl font-extrabold gradient-text mb-4">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-foreground text-center mb-16">What Students Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', sap: 'CSE 2024', text: 'Found my laptop charger within 2 hours of posting. Amazing platform!' },
              { name: 'Rahul Verma', sap: 'ECE 2025', text: 'The claim verification system is so secure. Highly recommend!' },
              { name: 'Ananya Gupta', sap: 'MBA 2024', text: 'Lost my ID card and someone found it same day. Life saver!' },
            ].map((t, i) => (
              <motion.div key={t.name} className="bg-card rounded-2xl p-8 border border-border/50" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                <p className="text-muted-foreground text-sm mb-6">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.sap}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="container mx-auto flex items-center justify-center gap-3">
          <img src={upesLogo} alt="UPES" className="h-8 w-8 rounded-lg object-contain" />
          <span className="font-semibold text-foreground">UPES Lost & Found</span>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
