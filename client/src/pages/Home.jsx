import { Carousel } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import { API_CONFIG } from "../config/api";

import "../styles/Home.css";

const carouselImages = Object.entries(
  import.meta.glob("../assets/main_imgs/CarouselImg*.png", {
    eager: true,
    import: "default",
  }),
)
  .map(([path, src]) => {
    const fileName =
      path.match(/CarouselImg\d+\.png$/)?.[0] ?? "Carousel image";
    const order = Number(path.match(/CarouselImg(\d+)\.png$/)?.[1] ?? 0);

    return {
      alt: fileName.replace(".png", ""),
      order,
      src,
    };
  })
  .sort((a, b) => a.order - b.order);

export default function Home() {
  const navigate = useNavigate();
  const autoplaySpeed = 3500;
  const [newsData, setNewsData] = useState([]);

  const imageStyle = {
    height: "280px", // 고정 높이로 설정
    width: "100%",
    objectFit: "contain",
    borderRadius: "8px", // 이미지 자체에만 테두리 둥글기 적용
  };

  // 페이지 이동 시 스크롤을 최상단으로 올리는 함수 (Header와 동일)
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const fetchNewsData = useCallback(async () => {
    try {
      const res = await fetch(`${API_CONFIG.BASE_URL}/api/news?limit=6`);
      const data = await res.json();
      if (data.success) {
        setNewsData(data.data);
      }
    } catch {
      console.error("Failed to load news data");
    }
  }, []);

  useEffect(() => {
    fetchNewsData();
  }, [fetchNewsData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase();
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const handleNewsClick = () => {
    navigate("/news");
    // Header의 News 네비게이션과 동일하게 맨 위로 스크롤
    scrollToTop();
  };

  return (
    <>
      {/* Hero Section - 첫 페이지 크기 */}
      <HeroSection />

      {/* Main Content - carousel과 news를 직접 배치 */}
      <div className="content-sections">
        {/* Carousel - 좌측 */}
        <Carousel
          autoplay={{ dotDuration: true }}
          autoplaySpeed={autoplaySpeed}
          arrows
          dots={false}
          effect="fade"
          className="carousel-component"
        >
          {carouselImages.map((image) => (
            <div key={image.alt}>
              <img src={image.src} alt={image.alt} style={imageStyle} />
            </div>
          ))}
        </Carousel>

        {/* News Section - 우측 */}
        <div className="home-news-container">
          <div className="home-news-title">NEWS</div>
          <div className="home-news-header">
            <span className="home-news-header-title">제목</span>
            <span className="home-news-header-date">작성일</span>
          </div>
          <div className="home-news-divider"></div>
          <div className="home-news-list">
            {newsData.map((news) => (
              <div
                key={news._id}
                className="home-news-item"
                onClick={handleNewsClick}
                style={{ cursor: "pointer" }}
              >
                <span className="home-news-title-text">{news.title}</span>
                <span className="home-news-date">{formatDate(news.date)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
