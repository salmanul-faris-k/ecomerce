import React from "react";
import Kurti from "../../assets/kurthis.jpg";
import Pants from "../../assets/Pants.jpg";
import saree from "../../assets/saree.jpg";
import Blouses from "../../assets/Blouses.jpg";
import coord from "../../assets/coord.jpg";
import fabrics from "../../assets/Fb.jpg";
import bestseller from "../../assets/bestseller.jpg";

import { Link } from "react-router-dom";

const cards = [
  {
    image: bestseller,
    label: "Best Sellers",
  },
  { image: saree, label: "Saree" },
  { image: Kurti, label: "Kurti" },
  { image: fabrics, label: "Fabrics" },
  { image: Pants, label: "Pants" },
  { image: Blouses, label: "Blouses" },
  { image: coord, label: "Co-ord Set" },
];

const handleScrollTop = () => window.scrollTo(0, 0);

const Homecard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 py-12 max-w-[1280px] mx-auto">
      {cards.map((card, index) => {
        const toPath =
          card.label === "Best Sellers"
            ? "/bestseller"
            : `/Product?ProductType=${card.label}`;

        return (
          <Link key={index} onClick={handleScrollTop} to={toPath}>
            <div className="relative overflow-hidden group transition-all duration-500 aspect-[3/2.8] cursor-pointer rounded-lg shadow-md hover:shadow-xl">
              <img
                src={card.image}
                alt={card.label}
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all duration-500 group-hover:from-black/40"></div>

              {/* Label */}
              <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center">
                <span className="text-sm md:text-md tracking-widest uppercase text-white drop-shadow-md transition-colors duration-300">
                  {card.label}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default Homecard;
