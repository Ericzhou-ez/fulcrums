import React from "react";
import Footer from "../../components/core/footer";
import Hero from "../../components/marketing/hero";
import Nav from "../../components/core/nav";
import "../../styles/home.css";
import BottomCTA from "../../components/marketing/bottomCta";
import { Faqs } from "../../components/marketing/faqs";

interface HomeProps {
   theme: string;
   handleToggleTheme: () => void;
}

const Home: React.FC<HomeProps> = ({ theme, handleToggleTheme }) => {
   return (
      <React.Fragment>
         <div className="home">
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
