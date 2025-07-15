import React, { useEffect, useReducer, useState,useRef } from 'react';
import { useParams } from 'react-router-dom';
import Search from '../../components/Search/Search';
import Tags from '../../components/Tags/Tags';
import Thumbnails from '../../components/Thumbnails/Thumbnails';
import {
  getAll,
  getAllByTag,
  getAllTags,
  search,
} from '../../services/foodService';
import NotFound from '../../components/NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import './HomePage.css';
import aboutImage from '../../components/assets/images/about.jpg';
import axios from 'axios';
import StatsSection from '../../components/StatsSection/StatsSection';
import CategorySection from '../../components/Category/category'; // ad
import CountdownBanner from '../../components/CountdownBanner/CountdownBanner';

import TopSelling from '../../components/TopSelling/TopSelling';
import TestimonialSlider from '../../components/Testimonials/TestimonialSlider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeDetails from '../../components/RecipeDetails/RecipeDetails';

const initialState = {
  foods: [],
  tags: [],
  loading: true,
  error: null,
};

const promises = [
  {
   icon:<img src="/pure.jpg" alt="Purity Icon" style={{ width: '150px', height: '140px', borderRadius: '12px', objectFit: 'cover' }} />,
    title: 'PURITY',
    description: 'Delivering food in its most natural form, sourced directly from trusted farms.'
  },
  {
    icon: <img src="/heritage.jpg" alt="Purity Icon" style={{ width: '150px', height: '140px', borderRadius: '12px', objectFit: 'cover' }} />,
    title: 'HERITAGE',
    description: 'Celebrating traditional practices and recipes passed down through generations.'
  },
  {
    icon: <img src="/honest.jpg" alt="Purity Icon" style={{ width: '150px', height: '140px', borderRadius: '12px', objectFit: 'cover' }} />,
    title: 'HONESTY',
    description: 'Ensuring complete transparency and rigorous quality checks.'
  },
  {
    icon: <img src="/impact.jpeg" alt="Purity Icon" style={{ width: '150px', height: '140px', borderRadius: '12px', objectFit: 'cover' }} />,
    title: 'IMPACT',
    description: 'Supporting rural communities through fair trade and responsible sourcing.'
  },
  {
    icon: <img src="/sustainability.jpg" alt="Purity Icon" style={{ width: '150px', height: '140px', borderRadius: '12px', objectFit: 'cover' }} />,
    title: 'SUSTAINABILITY',
    description: 'Committed to eco-friendly packaging and environmentally responsible sourcing.'
  },
  {
    icon: <img src="/fastdelivery.png" alt="Purity Icon" style={{ width: '150px', height: '140px', borderRadius: '12px', objectFit: 'cover' }} />,
    title: 'TRUSTED DELIVERY',
    description: 'Ensuring safe, fast, and hygienic delivery of every order to your doorstep.'
  }
];

const shorts = [
    {
      id: 'jfG9504I7OE',
      title: 'Our Organic Promise in 60 Seconds'
    },
    {
      id: 'lEq7JXUYxsM',
      title: 'Behind the Scenes – Oil Making'
    },
    {
      id: 'QTJMKEm_nu4',
      title: 'Why Isvaryam Cold Pressed?'
    },
    {id:'fN0GYiUVFfA',
      title:'isvaryam'
    }
  ];

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'TAGS_LOADED':
      return { ...state, tags: action.payload };
    case 'FOODS_LOADED':
      return { ...state, foods: action.payload, loading: false };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function HomePage() {
  useEffect(() => {
  const scrollToTop = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  };

  const timeout = setTimeout(scrollToTop, 100);
  return () => clearTimeout(timeout);
}, []);

  const [{ foods, tags, loading, error }, dispatch] = useReducer(reducer, initialState);
  const { searchTerm, tag } = useParams();

  const [bannerImages, setBannerImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bgColor, setBgColor] = useState('#ffffff');
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const mouseStartX = useRef(null);
  const mouseEndX = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [subject, setSubject] = useState('');
const [message, setMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true); // 🔒 Disable button

    try {
      const res = await fetch('https://isvaryam-backend.onrender.com/api/contact/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert('✅ Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      alert('❌ Failed to send message.');
    }

    setIsSending(false); // 🔓 Re-enable button
  };


  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const [imagesRes, colorRes] = await Promise.all([
          axios.get('https://admin-isvaryam.onrender.com/images'),
          axios.get('https://admin-isvaryam.onrender.com/colorhome'),
        ]);

        if (Array.isArray(imagesRes.data) && imagesRes.data.length > 0) {
          setBannerImages(imagesRes.data.map(img => img.imageUrl));
        } else {
          setBannerImages(['/bg.png', '/bg2.png']);
        }

        if (colorRes.data?.color) {
          setBgColor(colorRes.data.color);
        }
      } catch (err) {
        console.error('Error loading banner or color:', err);
        setBannerImages(['/bg.png', '/bg2.png']);
      }
    };

    fetchAssets();
  }, []);

  useEffect(() => {
    if (bannerImages.length < 2) return;
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % bannerImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [bannerImages]);

  const handleSwipe = (start, end) => {
    if (start == null || end == null) return;
    const delta = start - end;
    if (Math.abs(delta) > 50) {
      if (delta > 0) {
        setCurrentImageIndex(prev => (prev + 1) % bannerImages.length);
      } else {
        setCurrentImageIndex(prev => (prev - 1 + bannerImages.length) % bannerImages.length);
      }
    }
  };

  const handleTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = e => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe(touchStartX.current, touchEndX.current);
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseDown = e => {
    setIsDragging(true);
    mouseStartX.current = e.clientX;
  };
  const handleMouseUp = e => {
    if (!isDragging) return;
    mouseEndX.current = e.clientX;
    handleSwipe(mouseStartX.current, mouseEndX.current);
    setIsDragging(false);
    mouseStartX.current = null;
    mouseEndX.current = null;
  };
  const handleMouseLeave = () => {
    if (!isDragging) return;
    setIsDragging(false);
    mouseEndX.current = mouseStartX.current;
  };

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const [tagsData, foodsData] = await Promise.all([
          getAllTags(),
          tag ? getAllByTag(tag) : searchTerm ? search(searchTerm) : getAll(),
        ]);
        if (isMounted) {
          dispatch({ type: 'TAGS_LOADED', payload: tagsData });
          dispatch({ type: 'FOODS_LOADED', payload: foodsData });
        }
      } catch (err) {
        if (isMounted) {
          dispatch({ type: 'FETCH_ERROR', payload: err.message || 'Failed to load data.' });
        }
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [searchTerm, tag]);


  return (
    <div className="home-page" style={{ backgroundColor: bgColor, transition: 'background-color 1s ease-in-out' }} >

      {/* Hero Section */}

      <div className="about-hero">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="about-hero-video"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            left: 0,
            top: 0,
            zIndex: 0,
          }}
        >
          <source src="/about hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="hero-overlay" style={{ position: 'relative', zIndex: 1}} >
            <h1>WELCOME TO ISVARYAM</h1>
            <p>HEALTHY HEART BETTER LIFE</p>
        </div>
      </div>
      
      <div className="search-container" style={{ marginTop: '2rem' }}>
        
    </div>
      
    
       
    <CountdownBanner />

    <section className="categories-section">   
       <CategorySection tags={tags} />
    </section>
     
    <section className="products-section container fadeInUp" style={{ backgroundImage: `url('/bg2.png')`,
        backgroundColor: bgColor,

      }}
    >
        
    {loading ? (
          <Loading />
        ) : error ? (
          <NotFound linkText="Try Again" message={error} />
        ) : foods.length === 0 ? (
          <NotFound linkText="Reset Search" message="No items found." />
        ) : (
      
      <div className="products-grid-container" /*style={{
        backgroundColor: bgColor,
        backgroundImage: `url('/bg2.png')`, 
      }}*/
      >
      <TopSelling foods={foods} />
      </div>
    )}

      <>
      {/* rest of homepage */}
      </>
      
        <h2 className="section-title"><br />Fresh From Our Farms</h2>
        <div className="filter-container">
          <Tags tags={tags} />
        </div>

      

        {loading ? (
          <Loading />
        ) : error ? (
          <NotFound linkText="Try Again" message={error} />
        ) : foods.length === 0 ? (
          <NotFound linkText="Reset Search" message="No items found." />
        ) : (
          <Thumbnails foods={foods} />
        )}
      </section>

      <section className="why-choose-section fadeInUp">
        <div className="container">
          <h2 className="section-title" style={{ color: '#000000' }}><br />Why Choose Us</h2>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
  <img src="/nature.jpg" alt="Benefit Icon" style={{ width: '150px', height: '140px' }} />
</div>

              <h3>100% Organic</h3>
              <p>Chemical-free farming practices for healthier living</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><img src="/direct.jpg" alt="Benefit Icon" style={{ width: '150px', height: '140px' }} /></div>
              <h3>Farm to Table</h3>
              <p>Directly from our farms to your home within 24 hours</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><img src="/eco.jpg" alt="Benefit Icon" style={{ width: '150px', height: '140px' }} /></div>
              <h3>Sustainable</h3>
              <p>Eco-friendly packaging & sustainable farming practices</p>
            </div>
          </div>
        </div>
      </section>

      <section
  className="about-us-section fadeInUp"
  style={{
    backgroundColor: bgColor,
    backgroundImage: `url('/bg2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '60vh',
    transition: 'background-image 1s ease-in-out, background-color 1s ease-in-out',
  }}
>
  <div className="container">
    <h2 className="section-title" style={{ color: '#000000' }}><br />About Us</h2>
    <div
      className="about-us-content"
      style={{
        backgroundColor: '#ffffff',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        gap: '30px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <img
        src={aboutImage}
        alt="Our Farm"
        className="about-image"
        style={{ maxWidth: '50%', borderRadius: '12px', flex: '1 1 300px' }}
      />
      <div className="about-text" style={{ flex: '1 1 300px', fontSize: '1.2rem', lineHeight: '1.6' }}>
        <p>
          At Isvaryam, we are committed to delivering nature’s best straight
          from our farms to your home. Our journey began with a mission to
          promote healthier lifestyles through organic, sustainable, and
          chemical-free food. Transparency and tradition drive us—every
          product reflects our values. Experience nature’s true taste.
        </p>
      </div>
    </div>
  </div>
</section>
<section style={{backgroundColor:'#fffffff'}}><p>.</p></section>
<section className="chefs section">
  <div className="container">
    <div className="section-title">
      <h2>Our Professional Team</h2>
      <p>Meet Our <span className="description-title">Talented Team & Owners</span></p>
    </div>

    <div className="row gy-4">
      {/* Owner 1 */}
      <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
        <div className="team-member w-100 owner">
          <div className="member-img">
            <img src="/profile.jpg" className="img-fluid" alt="Owner Alice Parker" />
            <div className="social">
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-instagram"></i></a>
            </div>
          </div>
          <div className="member-info">
            <h4>Isvarya</h4>
            <span>Founder & CEO</span>
            <p>
              Isvaryam with a vision to bring back the purity of traditional cold-press oil extraction. Under her guidance, the brand has stayed committed to producing 100% chemical-free, unrefined oils using age-old wooden ghani methods that preserve natural nutrients.


              </p>
          </div>
        </div>
      </div>

      {/* Owner 2 */}
      <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
        <div className="team-member w-100 owner">
          <div className="member-img">
            <img src="/profile.jpg" className="img-fluid" alt="Owner David Lee" />
            <div className="social">
              <a href="#"><i className="bi bi-twitter"></i></a>
              <a href="#"><i className="bi bi-facebook"></i></a>
              <a href="#"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>
          <div className="member-info">
            <h4>Arul</h4>
            <span>Marketing manager</span>
            <p>
              Isvaryam's production unit where high-quality groundnut, coconut, and sesame oils are made without heat or solvents. His focus on sourcing from trusted farmers and maintaining hygiene ensures every bottle meets the highest purity and nutritional standards.

              </p>
          </div>
        </div>
      </div>

      {/* Existing Chefs */}
      <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
        
      </div>
     
      <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
        
      </div>
      
      <div className="col-lg-4 col-md-6 d-flex align-items-stretch">
       
      </div>
    </div>
  </div>
</section>

<StatsSection />

{/* Add Stats Section below */}


{/* Isvaryam Promise */}


      <section className="isvaryam-promise-section" style={{ color: '#000000' }}  >
      <h2 className="section-title">The Isvaryam Oath</h2>
      <div className="promise-container">
        {promises.map((item, index) => (
          <div className="promise-card" key={index}>
            <div className="promise-icon">{item.icon}</div>
            <h3 className="promise-title">{item.title}</h3>
            <p className="promise-description">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
    <section
  className="contact-redirect"
  style={{
    backgroundColor: bgColor,
    backgroundImage: `url('/bg2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '60vh',
    transition: 'background-image 1s ease-in-out, background-color 1s ease-in-out',
  }}
>
  <div
  className="contact-panel"
  style={{
    cursor: 'pointer',
    padding: '40px',
    margin: '40px auto',
    maxWidth: '900px',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    fontSize: '1.4rem',
    lineHeight: '1.6',
    textAlign: 'right'
  }}
>
  <h3 style={{ fontSize: '2rem', marginBottom: '20px' , color:'#000000' ,textAlign:'left'}}>
    Have Questions or Bulk Orders?
  </h3>
  <p style={{ marginBottom: '16px' , color:'#000000' ,textAlign:'left'}}>
    Contact us — we’d love to hear from you!
  </p>
  <p>
    <a
      href="#contact"
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#007BFF',
        color: '#ffffff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '1.2rem',
        fontWeight: 'bold'
      }}
    >
      Contact
    </a>
  </p>
</div>

</section>



      {/* After About Us or StatsSection */}
<TestimonialSlider />

    <section  style={{
    backgroundColor: bgColor,
    backgroundImage: `url('/bg2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '60vh',
    transition: 'background-image 1s ease-in-out, background-color 1s ease-in-out',
  }}>
    <RecipeDetails /></section>
       <section  className="contact-section" style={{ backgroundColor: '#fff', padding: '60px 20px' }}>
      <div className="container">
        {/* Google Map Embed */}
        <div className="map mb-4">
          <iframe
            title="Google Map"
            style={{ border: 0, width: '100%', height: '350px', borderRadius: '12px' }}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.128706510114!2d77.06089447588557!3d10.99896718921483!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8590c20a52b59%3A0x6f9be67824b2b6e5!2s10%20E%2C%20Ondipudur-Irugur%20Rd%2C%20Irugur%2C%20Tamil%20Nadu%20641103!5e0!3m2!1sen!2sin!4v1720141116242!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        {/* Contact Info Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="info-box">
              <i className="bi bi-geo-alt-fill text-danger fs-4"></i>
              <h5>Address</h5>
              <p>10 e, Ondipudur-Irugur Rd, Coimbatore, Irugur, Tamil Nadu 641103</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="info-box">
              <i className="bi bi-telephone-fill text-danger fs-4"></i>
              <h5>Call Us</h5>
              <p>+91 9578822000</p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="info-box">
              <i className="bi bi-envelope-fill text-danger fs-4"></i>
              <h5>Email Us</h5>
              <p>isvaryam@hotmail.com</p>
            </div>
          </div>
          
        </div>

        

      </div>
    </section>
  
<section className="contact-section"  
  style={{
    backgroundColor: bgColor,
    backgroundImage: `url('/bg2.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    minHeight: '60vh',
    transition: 'background-image 1s ease-in-out, background-color 1s ease-in-out',
  }}>
  <div className="contact-form-wrapper">
    <div className="contact-info">
      <h2>Get in Touch</h2>
      <div className="opening-hours">
        <h3>Opening Hours</h3>
        <p><strong>Mon–Sat:</strong> 10AM - 9PM</p>
        <p><strong>Sunday:</strong> Closed</p>
      </div>
    </div>
      <form  id="contact" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Your Name"
        className="contact-input"
        required
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Your Email"
        className="contact-input"
        required
      />
      <input
        type="text"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
        placeholder="Subject"
        className="contact-input"
        required
      />
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Message"
        className="contact-input"
        required
      ></textarea>
      
      <button
        type="submit"
        className="send-btn"
        disabled={isSending}
        style={{ opacity: isSending ? 0.6 : 1, cursor: isSending ? 'not-allowed' : 'pointer' }}
      >
        {isSending ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  </div>
</section>

<section className="shorts-section">
      <h2>🎥 Explore Our Shorts</h2>
      <div className="shorts-grid">
        {shorts.map((short, index) => (
          <div className="shorts-video-wrapper" key={index}>
            <iframe
              src={`https://www.youtube.com/embed/${short.id}`}
              title={short.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <p>{short.title}</p>
          </div>
        ))}

      </div>
    </section>
    </div>

    
    
  );
}