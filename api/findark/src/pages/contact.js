import Header from '../components/Header';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <div>
      <Header />
      <main>
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

export default Contact;