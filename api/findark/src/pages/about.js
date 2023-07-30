import Header from '../components/Header';
import AboutUs from '../components/AboutUs';

const About = () => {
  return (
    <div>
      <Header />
      <main>
        <AboutUs />
      </main>
      <footer>
        <div>&copy; 2021 FinDark</div>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
        </div>
      </footer>
    </div>
  );
};

export default About;