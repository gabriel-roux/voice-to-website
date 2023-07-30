import Header from '../components/Header';
import Introduction from '../components/Introduction';
import FeaturedArticles from '../components/FeaturedArticles';
import ToolsResources from '../components/ToolsResources';
import AboutUs from '../components/AboutUs';
import ContactForm from '../components/ContactForm';

const Index = () => {
  return (
    <div>
      <Header />
      <main>
        <Introduction />
        <FeaturedArticles />
        <ToolsResources />
        <AboutUs />
        <ContactForm />
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

export default Index;