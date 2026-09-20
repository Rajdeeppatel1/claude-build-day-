import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedButton from '../components/AnimatedButton';

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  
  useGSAP(() => {
    const elements = gsap.utils.toArray("[data-reveal]");
    elements.forEach((el) => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
        },
      });
    });

    if (heroRef.current) {
      gsap.to(heroRef.current, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }
  }, { scope: containerRef });

  return (
    <div className="home-page bg-white text-black" ref={containerRef}>
      
      {/* Top Navbar */}
      <nav className="home-navbar" style={{ 
        position: 'absolute', width: '100%', zIndex: 50, top: 0,
        padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'white', color: 'var(--color-teal)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ri-leaf-fill" style={{ fontSize: '24px' }}></i>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            AnnaSetu
          </span>
        </div>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
          <Link to="/about" style={{ color: 'white', fontWeight: 500, fontSize: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>About Us</Link>
          <AnimatedButton variant="secondary" onClick={() => navigate('/login')}>
            Sign In
          </AnimatedButton>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ 
        position: 'relative', 
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5%'
      }}>
        <div 
          ref={heroRef}
          style={{
            position: 'absolute',
            top: '-10%', left: 0, width: '100%', height: '120%',
            backgroundImage: 'url(/hero-bg.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0
          }}
        />
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: 'linear-gradient(to right, rgba(2, 44, 34, 0.9) 0%, rgba(2, 44, 34, 0.3) 100%)',
          zIndex: 1
        }}/>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px', width: '100%', textAlign: 'left' }}>
          <h1 data-reveal style={{ 
            fontSize: 'clamp(3rem, 5.5vw, 5rem)', 
            lineHeight: 1.1, 
            marginBottom: '24px',
            color: 'white',
            fontWeight: 800
          }}>
            Discover & Support NGOs Making <br/>
            <span style={{ color: 'var(--color-teal)' }}>Real Impact</span>
          </h1>
          
          <p data-reveal style={{ 
            fontSize: '1.15rem', 
            color: 'rgba(255,255,255,0.9)', 
            marginBottom: '40px',
            lineHeight: 1.6
          }}>
            Join our network to redistribute surplus food, reduce waste, and bring meals to those who need it most.
          </p>

          <div data-reveal style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <AnimatedButton variant="primary" icon="ri-hand-heart-line" onClick={() => navigate('/register?role=donor')}>
              Donate Food
            </AnimatedButton>
            <AnimatedButton variant="secondary" icon="ri-organization-chart" onClick={() => navigate('/register?role=ngo')}>
              Register NGO
            </AnimatedButton>
          </div>
        </div>
        
        {/* Glass Badges positioned absolute to the hero section, not the text content */}
        <div data-reveal className="glass-card" style={{ 
          position: 'absolute', right: '15%', top: '25%', 
          padding: '16px 24px', borderRadius: '16px',
          display: 'flex', alignItems: 'center', gap: '12px', color: 'white',
          background: 'rgba(255,255,255,0.15)',
          zIndex: 2,
          backdropFilter: 'blur(12px)'
        }}>
          <i className="ri-shield-check-fill" style={{ fontSize: '24px', color: 'white' }}></i>
          <span style={{ fontWeight: 600 }}>80G Certified</span>
        </div>

        <div data-reveal className="glass-card" style={{ 
          position: 'absolute', right: '10%', top: '55%', 
          padding: '16px 24px', borderRadius: '16px',
          display: 'flex', alignItems: 'center', gap: '12px', color: 'white',
          background: 'rgba(255,255,255,0.15)',
          zIndex: 2,
          backdropFilter: 'blur(12px)'
        }}>
          <i className="ri-calendar-check-fill" style={{ fontSize: '24px', color: 'white' }}></i>
          <span style={{ fontWeight: 600 }}>Real-time Tracking</span>
        </div>
      </section>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '120px 24px' }}>
        
        {/* Mission Statement */}
        <section style={{ marginBottom: '160px', textAlign: 'center', maxWidth: '900px', margin: '0 auto 160px' }}>
          <h2 data-reveal style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
            fontWeight: 800, 
            lineHeight: 1.1,
            color: 'var(--color-black)',
            marginBottom: '40px'
          }}>
            Connecting hearts with purpose, we're here to amplify your impact through transparency, trust, and community.
          </h2>
          <AnimatedButton data-reveal variant="secondary" icon="ri-arrow-right-line" onClick={() => navigate('/about')}>
            Read Our Story
          </AnimatedButton>
        </section>

        {/* How it works grid */}
        <section style={{ marginBottom: '160px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
            <h3 data-reveal style={{ fontSize: '3rem', fontWeight: 800 }}>How it works</h3>
            <span data-reveal style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>(Process)</span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div data-reveal style={{ padding: '32px', background: 'var(--color-bg-secondary)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>01</span> Post Donation
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Restaurants and individuals list surplus food quickly and securely.</p>
              </div>
              <div data-reveal style={{ padding: '32px', background: 'var(--color-bg-secondary)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>02</span> Instant Alert
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>Nearby NGOs are notified immediately to claim the donation.</p>
              </div>
              <div data-reveal style={{ padding: '32px', background: 'var(--color-bg-secondary)', borderRadius: '24px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>03</span> Rescue & Distribute
                </h4>
                <p style={{ color: 'var(--color-text-secondary)', margin: 0 }}>NGOs pick up the food and distribute it to those in need, eliminating waste.</p>
              </div>
            </div>
            
            <div data-reveal style={{ 
              background: 'var(--color-bg-secondary)', 
              borderRadius: '24px', 
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid var(--color-border)'
            }}>
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <h3 style={{ fontSize: '5rem', color: 'var(--color-teal)', marginBottom: '16px', lineHeight: 1 }}>+40%</h3>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-black)', fontWeight: 600 }}>Average increase in food rescued <br/>after joining our platform.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Numbers */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
            <h3 data-reveal style={{ fontSize: '3rem', fontWeight: 800 }}>Our Impact</h3>
            <span data-reveal style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>(Numbers)</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div data-reveal style={{ padding: '48px 32px', border: '1px solid var(--color-border)', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-blue)', marginBottom: '8px' }}>50k+</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Meals Distributed</div>
            </div>
            <div data-reveal style={{ padding: '48px 32px', border: '1px solid var(--color-border)', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-teal)', marginBottom: '8px' }}>120+</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Active NGOs</div>
            </div>
            <div data-reveal style={{ padding: '48px 32px', border: '1px solid var(--color-border)', borderRadius: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-amber)', marginBottom: '8px' }}>Trusted</div>
              <div style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>By Donors Worldwide</div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--color-black)', color: 'white', padding: '80px 24px 40px', borderRadius: '40px 40px 0 0', margin: '0 16px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <div style={{ background: 'var(--color-teal)', color: 'white', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <i className="ri-leaf-fill" style={{ fontSize: '24px' }}></i>
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>AnnaSetu</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '400px', marginBottom: '48px' }}>
            A Smart Food Waste Management System with Real-Time NGO Notification and Donation Tracking.
          </p>
          <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '40px' }} />
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
            &copy; 2026 AnnaSetu Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
