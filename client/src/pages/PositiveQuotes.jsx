import { useState } from "react";
import "./positiveQuotes.css";

const quotes = [
  {
    text: "You are doing better than you think.",
    category: "Self Care",
    emoji: "🌿",
  },
  {
    text: "Small steps every day can create meaningful change.",
    category: "Growth",
    emoji: "🌱",
  },
  {
    text: "Take a moment to breathe and be kind to yourself.",
    category: "Mindfulness",
    emoji: "🧘",
  },
  {
    text: "It is okay to take a break when you need one.",
    category: "Self Care",
    emoji: "☕",
  },
  {
    text: "Your feelings matter, and it is okay to talk about them.",
    category: "Emotions",
    emoji: "💚",
  },
  {
    text: "Focus on what you can do today, one step at a time.",
    category: "Growth",
    emoji: "🌸",
  },
  {
    text: "You don't have to have everything figured out today.",
    category: "Mindfulness",
    emoji: "🌤️",
  },
  {
    text: "Rest is not giving up. Rest is taking care of yourself.",
    category: "Self Care",
    emoji: "🌙",
  },
  {
    text: "Be patient with yourself. Growth takes time.",
    category: "Growth",
    emoji: "🌻",
  },
  {
    text: "A difficult day does not mean you have a difficult life.",
    category: "Hope",
    emoji: "🌈",
  },
  {
    text: "There is always a reason to take another small step forward.",
    category: "Hope",
    emoji: "✨",
  },
  {
    text: "Give yourself the same kindness you give to others.",
    category: "Self Care",
    emoji: "💗",
  },
  {
    text: "Breathe in calm. Breathe out tension.",
    category: "Mindfulness",
    emoji: "🍃",
  },
  {
    text: "You are allowed to grow at your own pace.",
    category: "Growth",
    emoji: "🌿",
  },
  {
    text: "Even small moments of peace are worth appreciating.",
    category: "Mindfulness",
    emoji: "🕊️",
  },
  {
    text: "Tomorrow gives you another opportunity to begin again.",
    category: "Hope",
    emoji: "🌅",
  },
  {
    text: "You deserve time to relax, recharge, and care for yourself.",
    category: "Self Care",
    emoji: "🫶",
  },
  {
    text: "You have made it through difficult moments before.",
    category: "Hope",
    emoji: "💙",
  },
  {
    text: "Believe in the progress you cannot always see.",
    category: "Growth",
    emoji: "🌼",
  },
  {
    text: "One peaceful moment can change the feeling of an entire day.",
    category: "Mindfulness",
    emoji: "🌸",
  },
];

function PositiveQuotes() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [featuredQuote, setFeaturedQuote] = useState(0);

  const categories = [
    "All",
    "Self Care",
    "Mindfulness",
    "Growth",
    "Hope",
    "Emotions",
  ];

  const filteredQuotes = quotes.filter((quote) => {
    const matchesCategory =
      selectedCategory === "All" ||
      quote.category === selectedCategory;

    const matchesSearch =
      quote.text.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setFeaturedQuote(randomIndex);
  };

  return (
    <div className="quotes-page">

      <div className="quotes-container">

        {/* Header */}
        <section className="quotes-header">
          <div className="quotes-icon">🌿</div>

          <p className="quotes-eyebrow">
            DAILY WELLNESS
          </p>

          <h1>Positive Quotes</h1>

          <p>
            Take a moment to pause, breathe, and find a little
            positivity for your day.
          </p>
        </section>

        {/* Featured Quote */}
        <section className="featured-quote">

          <div className="featured-decoration">
            ✨
          </div>

          <span className="featured-label">
            ✨ Quote for You
          </span>

          <div className="featured-emoji">
            {quotes[featuredQuote].emoji}
          </div>

          <p className="featured-text">
            “{quotes[featuredQuote].text}”
          </p>

          <span className="featured-category">
            {quotes[featuredQuote].category}
          </span>

          <button
            className="random-btn"
            onClick={showRandomQuote}
          >
            ✨ Show Me Another
          </button>

        </section>

        {/* Search */}
        <div className="quote-search">
          <span>🔍</span>

          <input
            type="text"
            placeholder="Search positive quotes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="category-filter">

          {categories.map((category) => (
            <button
              key={category}
              className={
                selectedCategory === category
                  ? "category-btn active"
                  : "category-btn"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}

        </div>

        {/* Quote Count */}
        <div className="library-heading">
          <div>
            <h2>Daily Inspiration</h2>
            <p>
              Find something that speaks to you.
            </p>
          </div>

          <span className="quote-count">
            {filteredQuotes.length} Quotes
          </span>
        </div>

        {/* Quote Cards */}
        <div className="quotes-grid">

          {filteredQuotes.map((quote, index) => (

            <article
              className="quote-card"
              key={`${quote.text}-${index}`}
            >

              <div className="card-top">
                <span className="card-emoji">
                  {quote.emoji}
                </span>

                <span className="card-category">
                  {quote.category}
                </span>
              </div>

              <div className="small-quote-mark">
                “
              </div>

              <p className="quote-text">
                {quote.text}
              </p>

              <div className="card-bottom">
                <span>MindConnect</span>
                <span>♡</span>
              </div>

            </article>

          ))}

        </div>

        {/* No Results */}
        {filteredQuotes.length === 0 && (
          <div className="no-quotes">
            <span>🌱</span>

            <h3>No quotes found</h3>

            <p>
              Try another search or category.
            </p>
          </div>
        )}

        {/* Wellness Tip */}
        <section className="quotes-tip">

          <div className="tip-icon">
            💚
          </div>

          <div>
            <h3>A little reminder</h3>

            <p>
              Your mental well-being matters. Take things one
              day at a time and remember to give yourself
              kindness and patience.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}

export default PositiveQuotes;