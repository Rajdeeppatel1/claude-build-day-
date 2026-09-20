import { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import AnimatedButton from '../components/AnimatedButton';
import { useData } from '../context/DataContext';

const STATIC_NGOS = [
  { name: 'Success Stairs Group of Company', phone: '07554918241', address: 'Bus stops, Ankur complex phase 2 near 6 no, Bhopal, MP 462011' },
  { name: 'Atmos_24', phone: '09313666555', address: 'S-33, F-Sector, Rajharsh Colony, Kolar Rd, Bhopal, MP 462042' },
  { name: 'Narayan Seva Sansthan', phone: '09928027946', address: '483, Seva Dham, Seva Nagar, Hiran Magri, Udaipur, Rajasthan 313001' },
  { name: 'Progressive Advance Welfare Society', phone: '09200004033', address: '208 A Block Pradhan Urban Live Apartment, near Danapani Restaurant, Bhopal, MP 462039' },
  { name: 'Back To Life Again Foundation', phone: '07415405522', address: 'DK-2/6, Danish Kunj, Kolar Rd, Bhopal, MP 462042' },
  { name: 'Unnatisheel Chhayaa Path Jan Kalyan Samiti', phone: '07415841689', address: 'H.no 514, opp Himanshu Tower, Ramanand Nagar, Lalghati, Bhopal, MP 462001' },
  { name: 'Aabhiruchi Jan Kalyan Sansthan', phone: '09993183204', address: '4, 80 Feet Rd, Near Laxmi Mandi School, Ashoka Garden, Bhopal, MP 462010' },
  { name: 'Roti Bank', phone: '09111004666', address: '63, VIP Road, Nakkar Khana, Peer Gate Area, Bhopal, MP 462001' },
  { name: 'PRAKRITI - Hope for Stray Animals & Nature', phone: '09826121155', address: 'Prakriti Shelter, Amravat Road, near Barkheda Pathani, Bhopal, MP 462022' },
  { name: 'Youth for Seva - Bhopal', phone: '08827708913', address: 'BDA Complex, 228, near PNB Bank, near AIIMS, Saket Nagar, Bhopal, MP 462024' },
  { name: "SOS Children's Villages of India", phone: '07552757588', address: 'Khajuri Kalan Rd, Sukh Sagar Phase-III, Piplani, Bhopal, MP 462022' },
  { name: "SOS Children's Village Khajuri Kalan", phone: '18001026905', address: 'Kokta Bypass Rd, Bhopal, MP 462022' },
  { name: 'Human Help Foundation', phone: '07869966499', address: 'HIG 37 Eco Park, Old Subhash Nagar, Bhopal, MP 462023' },
  { name: 'CPHD Healthcare Foundation (NGO)', phone: '08878924454', address: 'Behind Brilliant Convent School, Barkhedi, Jahangirabad, Bhopal, MP 462008' },
  { name: 'Arushi India', phone: '07554293399', address: '1, Main Rd 1, Shivaji Nagar, Bhopal, MP 462016' },
];

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const navigate = useNavigate();
  const { getUsersByRole, getDonations } = useData();

  const registeredNGOs = getUsersByRole('ngo').map(u => ({
    name: u.organization || u.name,
    phone: u.phone,
    address: u.address || 'Address pending verification',
  }));

  const allNGOs = [...registeredNGOs, ...STATIC_NGOS];
  const recentDonations = getDonations().slice(0, 6);
  
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
        position: 'fixed', 
        width: 'calc(100% - 48px)',
        maxWidth: '1200px',
        zIndex: 50, 
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '12px 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '100px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'white', color: 'var(--color-teal)', padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="ri-leaf-fill" style={{ fontSize: '24px' }}></i>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
            AnnaSetu
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link to="/about" style={{ color: 'white', fontWeight: 500, fontSize: '1rem', textShadow: '0 2px 10px rgba(0,0,0,0.2)', marginRight: '8px' }}>About Us</Link>
          <AnimatedButton variant="secondary" icon="ri-search-eye-line" onClick={() => document.getElementById('ngo-directory')?.scrollIntoView({ behavior: 'smooth' })}>
            Explore NGOs
          </AnimatedButton>
          <AnimatedButton variant="primary" icon="ri-restaurant-line" onClick={() => navigate('/donate')}>
            Donate
          </AnimatedButton>
          <AnimatedButton variant="secondary" icon="ri-user-add-line" onClick={() => navigate('/register')}>
            Register NGO
          </AnimatedButton>
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

        {/* Live Donations Feed */}
        {recentDonations.length > 0 && (
          <section style={{ marginTop: '160px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
              <h3 data-reveal style={{ fontSize: '3rem', fontWeight: 800 }}>Recent Donations</h3>
              <span data-reveal style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>(Live Feed)</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {recentDonations.map((donation) => (
                <div data-reveal key={donation.id} style={{
                  padding: '24px',
                  background: 'var(--color-bg-secondary)',
                  borderRadius: '20px',
                  border: '1px solid var(--color-border)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
                      background: donation.status === 'pending' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: donation.status === 'pending' ? 'var(--color-amber)' : 'var(--color-teal)'
                    }}>
                      {donation.status}
                    </span>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-black)', marginBottom: '8px' }}>
                    {donation.quantity} of {donation.foodType}
                  </h4>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                    <i className="ri-map-pin-line" style={{ marginRight: '6px' }}></i>
                    {donation.area || 'Bhopal'}
                  </p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                    <i className="ri-user-line" style={{ marginRight: '6px' }}></i>
                    {donation.donorName}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* NGO Partner Directory */}
        <section id="ngo-directory" style={{ marginTop: '160px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '64px' }}>
            <h3 data-reveal style={{ fontSize: '3rem', fontWeight: 800 }}>Our NGO Partners</h3>
            <span data-reveal style={{ color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>(Directory)</span>
          </div>
          <p data-reveal style={{ color: 'var(--color-text-secondary)', fontSize: '1.15rem', marginBottom: '48px', maxWidth: '600px' }}>
            We work with trusted NGOs across Bhopal and beyond to ensure every surplus meal reaches someone in need.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
            {allNGOs.map((ngo, i) => (
              <div data-reveal key={i} style={{
                padding: '28px',
                background: 'var(--color-bg-secondary)',
                borderRadius: '20px',
                border: '1px solid var(--color-border)',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-black)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{
                  minWidth: '48px', height: '48px', borderRadius: '14px',
                  background: 'var(--color-black)', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  <i className="ri-building-2-fill"></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-black)' }}>{ngo.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>{ngo.address}</p>
                  <a href={`tel:${ngo.phone}`} style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-teal)',
                    textDecoration: 'none'
                  }}>
                    <i className="ri-phone-fill"></i> {ngo.phone}
                  </a>
                </div>
              </div>
            ))}
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
