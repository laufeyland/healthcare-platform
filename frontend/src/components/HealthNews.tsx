
const HealthNews = () => {
  const articles = [
    {
      id: 1,
      title: 'Boost Your Immunity with These Superfoods',
      image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      categories: ['Nutrition', 'Wellness', 'Prevention'],
      excerpt: 'Discover the power of superfoods that can naturally enhance your immune system and overall health.'
    },
    {
      id: 2,
      title: 'The Benefits of Regular Exercise for Mental Health',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      categories: ['Fitness', 'Mental Health', 'Lifestyle'],
      excerpt: 'Learn how consistent physical activity can significantly improve your mental wellbeing and reduce stress.'
    },
    {
      id: 3,
      title: 'Healthy Sleep Habits: Tips for a Restful Night',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2060&q=80',
      categories: ['Sleep', 'Wellness', 'Health Tips'],
      excerpt: 'Explore effective strategies to improve your sleep quality and wake up feeling refreshed and energized.'
    }
  ];

  return (
    <section id="healthnews" className="py-16 bg-white overflow-hidden " data-aos="fade-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Latest Health News and Tips
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Stay informed with the latest updates, expert advice, and practical tips to keep you healthy and well.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <div 
              key={article.id} 
              className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1" 
              data-aos="fade-up" 
              data-aos-delay={index * 100}
            >
              <div className="flex-shrink-0">
                <img className="h-48 w-full object-cover" src={article.image} alt={article.title} />
              </div>
              <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {article.categories.map((category, idx) => (
                      <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {category}
                      </span>
                    ))}
                  </div>
                  <a href="#" className="block">
                    <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
                    <p className="mt-3 text-base text-gray-500">{article.excerpt}</p>
                  </a>
                </div>
                <div className="mt-6">
                  <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                    Read more <span aria-hidden="true" className="transition-transform duration-200 inline-block hover:translate-x-1">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center" data-aos="fade-up">
          <a 
            href="#wellness"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('wellness')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:scale-105"
          >
            View all articles
          </a>
        </div>
      </div>
    </section>
  );
};

export default HealthNews;