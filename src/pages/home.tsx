import React from "react";
import Footer from "../components/footer";
import Hero from "../components/hero";
import Nav from "../components/nav";
import '../styles/home.css';
import BottomCTA from "../components/bottomCta";

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

            <Hero />
         </div>

         <BottomCTA theme={theme} />

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </React.Fragment>
   );
};

export default Home;