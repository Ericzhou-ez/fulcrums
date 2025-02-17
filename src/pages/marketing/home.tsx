import React from "react";
import Footer from "../../components/core/footer";
import Hero from "../../components/marketing/hero";
import Nav from "../../components/core/nav";
import "../../styles/home.css";
import BottomCTA from "../../components/marketing/bottomCta";
import { Faqs } from "../../components/marketing/faqs";
import { useEffect } from "react";

interface HomeProps {
   theme: string;
   handleToggleTheme: () => void;
}

const Home: React.FC<HomeProps> = ({ theme, handleToggleTheme }) => {
   useEffect(() => {
      const starContainer = document.querySelector(".star-container");
      if (!starContainer) return;

      const numStars = 100; 
      const stars: HTMLDivElement[] = [];

      for (let i = 0; i < numStars; i++) {
         const star = document.createElement("div");
         star.className = "star";

         star.style.top = `${Math.random() * 100}%`;
         star.style.left = `${Math.random() * 100}%`;

         const size = Math.random() * 3 + 1;
         star.style.width = `${size}px`;
         star.style.height = `${size}px`;
         const duration = Math.random() * 5 + 3; 
         star.style.animationDuration = `${duration}s`;

         starContainer.appendChild(star);
         stars.push(star);
      }

      return () => {
         stars.forEach((star) => star.remove()); 
      };
   }, []);

   return (
      <React.Fragment>
         <div className="home">
            <div className="star-container"></div>

            <Nav
               signedIn={false}
               user={{ name: "", photo: "" }}
               handleSignOut={() => {}}
               isModalOpen={false}
               toggleModal={() => {}}
            />

            <div className="custome">
               <Hero />
            </div>
         </div>

         <Faqs />

         <BottomCTA theme={theme} />

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </React.Fragment>
   );
};

export default Home;
