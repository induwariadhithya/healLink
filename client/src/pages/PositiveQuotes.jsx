import { useState } from "react";
import "./positiveQuotes.css";

// Quote Images
import quote1 from "../assets/positive-quotes/positive-quote1.jpg";
import quote2 from "../assets/positive-quotes/positive-quote2.jpg";
import quote3 from "../assets/positive-quotes/positive-quote3.jpg";
import quote4 from "../assets/positive-quotes/positive-quote4.jpg";
import quote5 from "../assets/positive-quotes/positive-quote5.jpg";
import quote6 from "../assets/positive-quotes/positive-quote6.jpg";
import quote7 from "../assets/positive-quotes/positive-quote7.jpg";
import quote8 from "../assets/positive-quotes/positive-quote8.jpg";
import quote9 from "../assets/positive-quotes/positive-quote9.jpg";
import quote10 from "../assets/positive-quotes/positive-quote10.jpg";
import quote11 from "../assets/positive-quotes/positive-quote11.jpg";
import quote12 from "../assets/positive-quotes/positive-quote12.jpg";
import quote13 from "../assets/positive-quotes/positive-quote13.jpg";
import quote14 from "../assets/positive-quotes/positive-quote14.jpg";
import quote15 from "../assets/positive-quotes/positive-quote15.jpg";
import quote16 from "../assets/positive-quotes/positive-quote16.jpg";
import quote17 from "../assets/positive-quotes/positive-quote17.jpg";
import quote18 from "../assets/positive-quotes/positive-quote18.jpg";
import quote19 from "../assets/positive-quotes/positive-quote19.jpg";
import quote20 from "../assets/positive-quotes/positive-quote20.jpg";

const quotes = [
  {
    text: "You are doing better than you think.",
    category: "Self Care",
    image: quote1,
  },
  {
    text: "Small steps every day can create meaningful change.",
    category: "Growth",
    image: quote2,
  },
  {
    text: "Take a moment to breathe and be kind to yourself.",
    category: "Mindfulness",
    image: quote3,
  },
  {
    text: "It is okay to take a break when you need one.",
    category: "Self Care",
    image: quote4,
  },
  {
    text: "Your feelings matter, and it is okay to talk about them.",
    category: "Emotions",
    image: quote5,
  },
  {
    text: "Focus on what you can do today, one step at a time.",
    category: "Growth",
    image: quote6,
  },
  {
    text: "You don't have to have everything figured out today.",
    category: "Mindfulness",
    image: quote7,
  },
  {
    text: "Rest is not giving up. Rest is taking care of yourself.",
    category: "Self Care",
    image: quote8,
  },
  {
    text: "Be patient with yourself. Growth takes time.",
    category: "Growth",
    image: quote9,
  },
  {
    text: "A difficult day does not mean you have a difficult life.",
    category: "Hope",
    image: quote10,
  },
  {
    text: "There is always a reason to take another small step forward.",
    category: "Hope",
    image: quote11,
  },
  {
    text: "Give yourself the same kindness you give to others.",
    category: "Self Care",
    image: quote12,
  },
  {
    text: "Breathe in calm. Breathe out tension.",
    category: "Mindfulness",
    image: quote13,
  },
  {
    text: "You are allowed to grow at your own pace.",
    category: "Growth",
    image: quote14,
  },
  {
    text: "Even small moments of peace are worth appreciating.",
    category: "Mindfulness",
    image: quote15,
  },
  {
    text: "Tomorrow gives you another opportunity to begin again.",
    category: "Hope",
    image: quote16,
  },
  {
    text: "You deserve time to relax, recharge, and care for yourself.",
    category: "Self Care",
    image: quote17,
  },
  {
    text: "You have made it through difficult moments before.",
    category: "Hope",
    image: quote18,
  },
  {
    text: "Believe in the progress you cannot always see.",
    category: "Growth",
    image: quote19,
  },
  {
    text: "One peaceful moment can change the feeling of an entire day.",
    category: "Mindfulness",
    image: quote20,
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

    const matchesSearch = quote.text
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setFeaturedQuote(randomIndex);
  };

  return (
    <div className="quotes-page">
      <div className="quotes-container">

        {/* HEADER */}
        <section className="quotes-header">
          <p className="quotes-eyebrow">
            DAILY WELLNESS
          </p>

          <h1>Positive Quotes</h1>

          <p>
            Take a moment to pause, breathe, and find a little
            positivity for your day.
          </p>
        </section>


        {/* FEATURED QUOTE */}
        <section
          className="featured-quote"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255, 255, 255, 0.35),
                rgba(48, 43, 99, 0.30)
              ),
              url(${quotes[featuredQuote].image})
            `,
          }}
        >
          <div className="featured-content">

            <span className="featured-label">
              QUOTE FOR YOU
            </span>

            <div className="featured-mark">
              “
            </div>

            <p className="featured-text">
              {quotes[featuredQuote].text}
            </p>

            <span className="featured-category">
              {quotes[featuredQuote].category}
            </span>

            <button
              className="random-btn"
              onClick={showRandomQuote}
            >
              Show Me Another
              <span>→</span>
            </button>

          </div>
        </section>


        {/* SEARCH */}
        <div className="quote-search">
          <span className="search-icon">
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search positive quotes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>


        {/* CATEGORY FILTER */}
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


        {/* LIBRARY HEADING */}
        <div className="library-heading">

          <div>
            <p className="section-eyebrow">
              FIND YOUR MOMENT
            </p>

            <h2>
              Daily Inspiration
            </h2>

            <p>
              Find something that speaks to you.
            </p>
          </div>

          <span className="quote-count">
            {filteredQuotes.length} Quotes
          </span>

        </div>


        {/* QUOTE CARDS */}
        <div className="quotes-grid">

          {filteredQuotes.map((quote) => {

            const originalIndex = quotes.indexOf(quote);

            return (
              <article
                className="quote-card"
                key={quote.text}
                style={{
                  backgroundImage: `
                    linear-gradient(
                      rgba(255, 255, 255, 0.52),
                      rgba(48, 43, 99, 0.52)
                    ),
                    url(${quote.image})
                  `,
                }}
              >

                <div className="card-top">

                  <span className="card-category">
                    {quote.category}
                  </span>

                  <span className="card-number">
                    {String(originalIndex + 1).padStart(2, "0")}
                  </span>

                </div>


                <div className="small-quote-mark">
                  “
                </div>


                <p className="quote-text">
                  {quote.text}
                </p>


                <div className="card-bottom">

                  <span>
                    HEALLINK
                  </span>

                  <span className="heart">
                    ♡
                  </span>

                </div>

              </article>
            );
          })}

        </div>


        {/* NO RESULTS */}
        {filteredQuotes.length === 0 && (
          <div className="no-quotes">

            <div className="no-quotes-mark">
              “
            </div>

            <h3>
              No quotes found
            </h3>

            <p>
              Try another search or category.
            </p>

          </div>
        )}


        {/* BOTTOM REMINDER */}
        <section className="quotes-tip">

          <div className="tip-line"></div>

          <div>
            <div className="tip-heart">♥</div>
            <p className="tip-eyebrow">
              A LITTLE REMINDER
            </p>

            <h3>
              Your mental well-being matters.
            </h3>

            <p>
              Take things one day at a time and remember
              to give yourself kindness and patience.
            </p>

          </div>

        </section>

      </div>
    </div>
  );
}

export default PositiveQuotes;