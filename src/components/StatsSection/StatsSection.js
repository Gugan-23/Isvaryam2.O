import React, { useEffect, useRef, useState } from 'react';
import './StatsSection.css';

export default function StatsSection() {
  const stats = [
    { number: 10, label: 'Clients' },
    { number: 2, label: 'Stores' },
    { number: 1453, label: 'Hours Of Support' },
    { number: 24, label: 'Workers' },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animateCounts();
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 } // Trigger when 40% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const animateCounts = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      let step = 0;
      const increment = stat.number / steps;

      const timer = setInterval(() => {
        step++;
        setCounts(prev =>
          prev.map((val, i) =>
            i === index
              ? step >= steps
                ? stat.number
                : Math.floor(step * increment)
              : val
          )
        );
        if (step >= steps) clearInterval(timer);
      }, interval);
    });
  };

  return (
    <section
  className="stats-section"
  ref={sectionRef}
  style={{
    backgroundImage: "url('/is.png')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  }}
>
  <div className="overlay" />
  <div className="stats-container">
    {stats.map((stat, index) => (
      <div key={index} className="stat-card">
        <div className="stat-number">{counts[index]}</div>
        <div className="stat-label">{stat.label}</div>
      </div>
    ))}
  </div>
</section>

  );
}
