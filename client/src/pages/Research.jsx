import { useEffect, useState } from "react";
import { Carousel } from "antd";
import RESEARCH_IMAGE from "../assets/RESEARCH_IMAGE_1.png";
import RESEARCH_IMAGE_2 from "../assets/RESEARCH_IMAGE_2.jpg";
import "../styles/Research.css";

const researchSlides = [
  {
    src: RESEARCH_IMAGE,
    alt: "Research Application Fields Diagram",
  },
  {
    src: RESEARCH_IMAGE_2,
    alt: "Data and Business Intelligence Diagram",
  },
];

export default function Research() {
  const autoplaySpeed = 4000;
  const [imagesReady, setImagesReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const preloadImage = (src) =>
      new Promise((resolve) => {
        const image = new Image();

        image.onload = resolve;
        image.onerror = resolve;
        image.src = src;

        if (image.complete) {
          resolve();
        }
      });

    Promise.all(researchSlides.map(({ src }) => preloadImage(src))).then(() => {
      if (isMounted) {
        setImagesReady(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Research Areas Section */}
      <section className="research-areas">
        <div className="container">
          <h2 className="section-title">Research Areas</h2>

          <div className="research-cards">
            {/* Card 1: AI Applications */}
            <div className="research-card">
              <h3 className="card-title">
                Artificial Intelligence (AI) <br />
                Applications
              </h3>
              <p className="card-description">
                Our objective is to solve specific industrial and business
                problems through the application of AI. We utilize prediction
                modeling and quantitative big data analytics to achieve these
                goals.
              </p>
            </div>

            {/* Card 2: Core AI Technology */}
            <div className="research-card">
              <h3 className="card-title">Core AI Technology</h3>
              <p className="card-description">
                We focus on developing solutions for different types of datasets
                (e.g. tabular, text, image, etc.). This involves algorithm
                development and architecture modification to improve performance
                and applicability.
              </p>
            </div>

            {/* Card 3: Other Related Works */}
            <div className="research-card">
              <h3 className="card-title">
                Other Related Works
                <br />
                <span className="card-subtitle">
                  (Technology Adoption, Digital Policy, <br />
                  Green Finance, Etc.)
                </span>
              </h3>
              <p className="card-description">
                Our goal is to extract industrial and business implications
                through comprehensive studies, including data analytics, user
                surveys, interviews, and case studies. These efforts help inform
                governmental policy and business strategies.
              </p>
            </div>

            {/* Card 4: Research Objectives */}
            <div className="research-card">
              <h3 className="card-title">
                Research Objectives
                <br />
                in Common
              </h3>
              <p className="card-description">
                Our common research objective is to find solutions and derive
                implications for various business problems through methodical
                research and analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      {/* <div className="section-divider"></div> */}

      {/* Research Application Fields Section */}
      <section className="research-application-fields">
        <div className="container">
          <h2 className="section-title">Research Application Fields</h2>

          <div className="application-content">
            <div className="application-text">
              <h3 className="application-title">
                Field by Field, Cross-Pollinate If Feasible
              </h3>
              <p className="application-description">
                We focus sophisticated business challenges within the Finance,
                Healthcare, and Network/Security sectors, while also addressing
                complex interdisciplinary problems that arise at the
                intersection of these industries.
              </p>
            </div>

            <div className="application-diagram">
              {imagesReady ? (
                <Carousel
                  key="research-carousel-ready"
                  autoplay={{ dotDuration: true }}
                  autoplaySpeed={autoplaySpeed}
                  arrows
                  dots={false}
                  effect="fade"
                  className="research-carousel"
                >
                  {researchSlides.map(({ src, alt }) => (
                    <div className="research-carousel-slide" key={alt}>
                      <img
                        src={src}
                        alt={alt}
                        className="research-carousel-image"
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div
                  className="research-carousel research-carousel-placeholder"
                  aria-hidden="true"
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
