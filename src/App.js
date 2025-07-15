import { useEffect, useState } from 'react';
import AppRoutes from './AppRoutes';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Loading from './components/Loading/Loading';
import { useLoading } from './hooks/useLoading';
import { setLoadingInterceptor } from './interceptors/loadingInterceptor';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

import './App.css';

function App() {
  const { showLoading, hideLoading } = useLoading();
  const [showChatbot, setShowChatbot] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Mobile flag

  useEffect(() => {
    setLoadingInterceptor({ showLoading, hideLoading });

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showLoading, hideLoading]);

  const toggleChatbot = () => {
    setShowChatbot(prev => !prev);
  };

  return (
    <>
      <ScrollToTop />
      <div className="app-container">
        <Loading />
        <Header />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />

        {/* Chatbot Toggle Button */}
        <button
          onClick={toggleChatbot}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1100,
            borderRadius: '50%',
            width: isMobile ? '50px' : '60px',
            height: isMobile ? '50px' : '60px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            fontSize: isMobile ? '22px' : '28px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            cursor: 'pointer'
          }}
        >
          💬
        </button>

        {/* Chatbot Popup */}
        {showChatbot && (
          <div
            style={{
              position: 'fixed',
              bottom: isMobile ? '70px' : '90px',
              right: '20px',
              width: isMobile ? '90vw' : '350px',
              height: isMobile ? '75vh' : '500px',
              zIndex: 1000,
              borderRadius: '12px',
              boxShadow: '0 0 10px rgba(0,0,0,0.2)',
              backgroundColor: '#fff',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={toggleChatbot}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: '#000000',
                color: 'white',
                border: 'none',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                zIndex: 1101,
              }}
            >
              ✖
            </button>

            <iframe
              src="https://isvarayam-chatbot-1.onrender.com/"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
              }}
              allow="microphone; camera"
              title="Chatbot"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
