import "./WellnessHub.css";

const TOPIC_GROUPS = [
  {
    title: "Meditation",
    videos: [
      {
        title: "Breath Reset",
        description: "A short guided breathing session to calm the mind.",
        embedUrl: "https://www.youtube.com/embed/ZToicYcHIOU?rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
      {
        title: "Morning Calm",
        description: "Gentle meditation for a clear start to the day.",
        embedUrl: "https://www.youtube.com/embed/Gao4-cwXUr0?si=Uor5CqyZcZrIxzW3&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
      {
        title: "Sleep Ease",
        description: "A slow meditation to help you unwind before bed.",
        embedUrl: "https://www.youtube.com/embed/-9KLB2HI9BI?si=oDSxNBOIJ-MVi0hX&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
    ],
  },
  {
    title: "Positive Affirmations",
    videos: [
      {
        title: "Self Worth",
        description: "Simple affirmations designed to help you feel grounded.",
        embedUrl: "https://www.youtube.com/embed/URw4c0O3ACM?si=qCPWyeVuozvpTFz1&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
      {
        title: "Confidence Boost",
        description: "Daily reminders that build confidence and calm.",
        embedUrl: "https://www.youtube.com/embed/sjTFjwjK56c?si=qshaf3MCa3LGEymN&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
      {
        title: "Morning Positivity",
        description: "A brighter start with encouraging self-talk.",
        embedUrl: "https://www.youtube.com/embed/uT6ASPy2Dbs?si=weHNoAZj_q2XrnPO&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
    ],
  },
  {
    title: "Life Advice",
    videos: [
      {
        title: "Mindset Shift",
        description: "Helpful guidance for overcoming everyday stress.",
        embedUrl: "https://www.youtube.com/embed/JALrWKK_jfo?si=_xFFi0YNVAcnKF-C&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
      {
        title: "Healthy Habits",
        description: "Small actions that lead to steadier routines.",
        embedUrl: "https://www.youtube.com/embed/ufQEqi4LUZ4?si=FuGDRxyXXOKLi4aK&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
      {
        title: "Better Balance",
        description: "Simple advice for managing life with less pressure.",
        embedUrl: "https://www.youtube.com/embed/Cw6xuzosn4s?si=dGqi-4Tu-ZTbY6Wp&rel=0&modestbranding=1&playsinline=1&autoplay=0&mute=1",
      },
    ],
  },
];

export default function WellnessHub() {
  return (
    <main className="wellness-support-page">
      <header className="wellness-support-header">
        <h1>Wellness Support</h1>
        <p>Join us in your pursuit of well-being.</p>
      </header>

      <section className="wellness-support-section" aria-label="Wellness video section">
        {TOPIC_GROUPS.map((topic) => (
          <div className="wellness-support-topic" key={topic.title}>
            <h2 className="wellness-support-topic__title">{topic.title}</h2>

            <div className="wellness-support-grid">
              {topic.videos.map((video) => (
                <article className="wellness-support-card" key={`${topic.title}-${video.title}`}>
                  <div className="wellness-support-card__video-wrap">
                    <iframe
                      src={video.embedUrl}
                      title={video.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>

                  <div className="wellness-support-card__content">
                    <h3>{video.title}</h3>
                    <p>{video.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
