import React, { useState } from "react";
import { motion } from "framer-motion";

// External image URLs from Google Drive
const imageUrls = {
  p1: "https://lh3.googleusercontent.com/d/1UjLW2Whs70tgO4lV6YP50ft66nUypM8G",
  p2: "https://lh3.googleusercontent.com/d/1ZEWjmr3KlV7iZmifIccoxHmLKvYZ0JMX",
  p3: "https://lh3.googleusercontent.com/d/1pCW5CXnznuJHzV9nGkSIXE37rxFPpVQq"
};

// Utility function for class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

// 3D Card Components
const MouseEnterContext = React.createContext(undefined);

const CardContainer = ({ children, className, containerClassName }) => {
  const containerRef = React.useRef(null);
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;
    containerRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };

  const handleMouseEnter = () => {
    setIsMouseEntered(true);
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;
    setIsMouseEntered(false);
    containerRef.current.style.transform = `rotateY(0deg) rotateX(0deg)`;
  };

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn("py-8 flex items-center justify-center", containerClassName)}
        style={{ perspective: "1000px" }}
      >
        <div
          ref={containerRef}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={cn("flex items-center justify-center relative transition-all duration-200 ease-linear", className)}
          style={{ transformStyle: "preserve-3d" }}
        >
          {children}
        </div>
      </div>
    </MouseEnterContext.Provider>
  );
};

const CardBody = ({ children, className }) => {
  return (
    <div className={cn("h-auto w-full [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  );
};

const CardItem = ({ as: Tag = "div", children, className, translateZ = 0, ...rest }) => {
  const ref = React.useRef(null);
  const context = React.useContext(MouseEnterContext);
  const [isMouseEntered] = context || [false];

  React.useEffect(() => {
    if (!ref.current) return;
    if (isMouseEntered) {
      ref.current.style.transform = `translateZ(${translateZ}px)`;
    } else {
      ref.current.style.transform = `translateZ(0px)`;
    }
  }, [isMouseEntered, translateZ]);

  return (
    <Tag ref={ref} className={cn("w-fit transition duration-200 ease-linear", className)} {...rest}>
      {children}
    </Tag>
  );
};

// Wobble Card Component
const WobbleCard = ({ children, containerClassName, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
        transition: "transform 0.1s ease-out",
      }}
      className={cn("mx-auto w-full relative rounded-2xl overflow-hidden", containerClassName)}
    >
      <div
        className="relative h-full sm:rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 10px 32px rgba(34, 42, 53, 0.12), 0 1px 1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <motion.div
          style={{
            transform: isHovering
              ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
              : "translate3d(0px, 0px, 0) scale3d(1, 1, 1)",
            transition: "transform 0.1s ease-out",
          }}
          className={cn("h-full px-6 py-8", className)}
        >
          {children}
        </motion.div>
      </div>
    </motion.section>
  );
};

// Main About Component
const About = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="text-center py-12 px-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
        >
          About Us
        </motion.h1>
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-semibold text-blue-900 mb-6"
        >
          Transforming Business Education
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 max-w-3xl mx-auto text-lg"
        >
          Our simulation platform is a cutting-edge educational tool designed to bridge the gap between theoretical knowledge and practical business management experience.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 space-y-16">
        {/* About Xaction Section */}
        <WobbleCard containerClassName="bg-gradient-to-br from-blue-600 to-indigo-700">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-white mb-4">About Xaction</h2>
            <p className="text-blue-100 text-lg mb-4 leading-relaxed">
              Xaction is a business vertical of Ground Up Consulting which focuses on building simulations as close to real life as possible for management students. Xaction simulations are not operating at 30,000 ft from the ground level but mimic the real challenges that any management graduate is likely to face in their first 5 years of their career.
            </p>
            <p className="text-blue-100 text-lg leading-relaxed">
              The simulations will test your decision making capability in face of the challenges and the constraints. This becomes critical because decisions in real life are always taken with constraints because the resources are minimal.
            </p>
          </div>
        </WobbleCard>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-6">
          <WobbleCard containerClassName="bg-gradient-to-br from-blue-500 to-blue-600 min-h-[280px]">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                <p className="text-blue-100 leading-relaxed">
                  To empower next generation of business leaders by providing cutting-edge experiential education that enhances critical thinking, decision-making, and leadership skills in a highly realistic business environment.
                </p>
              </div>
            </div>
          </WobbleCard>

          <WobbleCard containerClassName="bg-gradient-to-br from-indigo-600 to-purple-600 min-h-[280px]">
            <div className="flex items-start space-x-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
                <p className="text-blue-100 leading-relaxed">
                  To become the leading platform for business simulation education globally, revolutionizing how students learn management skills by providing immersive, technology-driven learning experiences.
                </p>
              </div>
            </div>
          </WobbleCard>
        </div>

        {/* What Makes Us Different */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What Makes Us Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Collaborative Learning",
                desc: "Work in teams, make collective decisions, and learn from diverse perspectives in a collaborative environment that mirrors real business dynamics."
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Real-World Scenarios",
                desc: "Experience authentic business challenges based on actual industry cases and current market conditions that cannot be simulated in conventional classrooms."
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Performance Analytics",
                desc: "Track your progress, analyze decision outcomes, and receive detailed feedback to continuously improve your management and leadership capabilities."
              }
            ].map((item, idx) => (
              <CardContainer key={idx}>
                <CardBody className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-8 border border-blue-100">
                  <CardItem translateZ={50} className="text-blue-600 mb-4">
                    {item.icon}
                  </CardItem>
                  <CardItem translateZ={60} className="text-xl font-bold text-gray-800 mb-3">
                    {item.title}
                  </CardItem>
                  <CardItem translateZ={40} className="text-gray-600 leading-relaxed">
                    {item.desc}
                  </CardItem>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>

        {/* Leadership Team */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Priyaranjan Kumar",
                img: imageUrls.p1,
                desc: "Priyaranjan Kumar is an Engineer and Management Post Graduate by Education but a Salesman by choice. He has spent 20 years in the corporate world in leadership & CXO positions with Aditya Birla Fashion & Retail (Pantaloons), Mars Wrigley India, Nivea India, Snapdeal, Iconic Fashion and Guardian Pharmacy.\n\nHe is the founder of Ground up Consulting which specialises in GTM execution, Retail Store Location Analytics and Business Transformation for D2C brands in Offline distribution and Fashion & Wellness Retail.\n\nHe is a visiting faculty at IIM Kashipur, IIM Vizag, BIM Trichy, XIM Bhubaneswar, IRMA and IMI Delhi where teaches courses on Sales & Distribution and Retail Management. He is also pursuing Executive PHD in Strategy from SP Jain Institute of Management & Research Mumbai.\n\nHe has recently turned an Author with his best seller 'Tales of Sales' written specifically for graduating students and early stage professionals as a Fun, Factual and Fundamental guide for navigating their careers.",
                linkedin: "https://www.linkedin.com/in/priyaranjan-kumar-09927220/"
              },
              {
                name: "Akshansh Vidyarthy",
                img: imageUrls.p2,
                desc: "Akshansh is a marketing enthusiast with an MBA in Marketing, bringing strong experience in sales, retail management, and brand development. He specializes in consumer insights, market research, and go-to-market execution, with a sharp focus on building strategies that resonate with evolving customer needs.\n\nHis background includes channel development projects and entrepreneurial ventures, where he learned to align strategic vision with on-ground realities. With a passion for brand storytelling and sustainable growth, he thrives at bridging strategy with execution, ensuring ideas are not only conceptualized but also effectively implemented.\n\nDriven to create impactful learning and growth experiences, he leverages business simulations and real-world problem-solving to deliver results that inspire both teams and organizations.",
                linkedin: "https://www.linkedin.com/in/akshansh-vidyarthy-845a2412a/"
              },
              {
                name: "Ayushant Khandekar",
                img: imageUrls.p3,
                desc: "Ayushant is an expert in tech development and AI-driven solutions, Founder of Atkind, a Founder Member at TrayaTech Labs, and building FairPlace.in, an AI-driven e-commerce solution for retailers in a Bengaluru-based startup.\n\nHe also serves as a Technical Advisor to a Turkey-based venture and has lead teams at peakprosys.in\n\nHis expertise spans full-stack development, UI/UX design, automation, and AI integration, enabling the creation of scalable digital products that combine creativity with engineering depth.\n\nWith experience across founder, advisor, and leadership roles, he is passionate about harnessing emerging technologies to transform bold ideas into future-ready realities.",
                linkedin: "https://www.linkedin.com/in/ayushant"
              }
            ].map((person, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg p-6 flex flex-col h-[600px]">
                <div className="flex-shrink-0 mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-200">
                    <img src={person.img} alt={person.name} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center flex-shrink-0">
                  {person.name}
                </h3>
                <div className="flex-1 overflow-y-auto mb-4 pr-2">
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line text-left">
                    {person.desc}
                  </p>
                </div>
                <div className="flex-shrink-0 text-center pt-4 border-t border-gray-200">
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm font-medium hover:text-blue-800">
                    LinkedIn Profile →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <WobbleCard containerClassName="bg-gradient-to-br from-blue-700 to-indigo-800">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Join thousands of students who've enhanced their business acumen through our innovative simulation platform.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg">
                Start Simulation
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
        </WobbleCard>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-sm text-gray-600 border-t border-gray-200 bg-white/50">
        © 2025 atkind. All rights reserved. <br />
        Powered by <a href="https://atkind.com" className="text-blue-600 font-medium hover:text-blue-800">atkind.com</a>
      </footer>
    </div>
  );
};

export default About;