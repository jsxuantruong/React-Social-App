import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./index.scss";

const Carousel = ({ children, length }) => {
  const setup = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(5, length),
    slidesToScroll: 1,
    lazyLoad: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(3, length),
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(2, length),
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: Math.min(1, length),
          slidesToScroll: 1,
        },
      },
    ],
  };
  return <Slider {...setup}>{children}</Slider>;
};

export default Carousel;
