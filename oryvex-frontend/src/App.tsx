import './styles/globals.css';
import Navbar from './components/Navbar';
import Hero from './sections/Hero';
import Problem from './sections/Problem';
import Solution from './sections/Solution';
import HowItWorks from './sections/HowItWorks';
import Demo from './sections/Demo';
import Technology from './sections/Technology';
import Impact from './sections/Impact';
import WhyOryvex from './sections/WhyOryvex';
import Footer from './sections/Footer';

function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Problem />
        <Solution />
        <HowItWorks />
        <Demo />
        <Technology />
        <Impact />
        <WhyOryvex />
      </main>
      <Footer />
    </>
  );
}

export default App;
