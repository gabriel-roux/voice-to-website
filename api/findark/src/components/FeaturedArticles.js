import Image from 'next/image';

const FeaturedArticles = () => {
  return (
    <section className="featured-articles">
      <div>
        <h2>Featured Articles</h2>
        <p>Check out our latest and most popular articles on investments, economics, and financial planning.</p>
      </div>
      <div>
        <div>
          <Image src="/article1.jpg" alt="Article 1" width={300} height={200} />
          <h3>Article 1</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna ut bibendum bibendum, nisi elit lacinia eros, vel aliquet sapien quam vel odio.</p>
        </div>
        <div>
          <Image src="/article2.jpg" alt="Article 2" width={300} height={200} />
          <h3>Article 2</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna ut bibendum bibendum, nisi elit lacinia eros, vel aliquet sapien quam vel odio.</p>
        </div>
        <div>
          <Image src="/article3.jpg" alt="Article 3" width={300} height={200} />
          <h3>Article 3</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna ut bibendum bibendum, nisi elit lacinia eros, vel aliquet sapien quam vel odio.</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticles;