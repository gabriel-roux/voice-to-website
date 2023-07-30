import Link from 'next/link';

const Header = () => {
  return (
    <header>
      <div className="logo">FinDark</div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
