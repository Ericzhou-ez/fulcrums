import Footer from "../components/footer";
import Hero from "../components/hero";
import Nav from "../components/nav";
import '../styles/home.css';

interface HomeProps {
   theme: string;
   handleToggleTheme: () => void;
}

const Home: React.FC<HomeProps> = ({ theme, handleToggleTheme }) => {
   return (
      <div className="home">
         <Nav 
            signedIn={false} 
            user={{name: "", photo: ""}} 
            handleSignOut={() => {}} 
            isModalOpen={false} 
            toggleModal={() => {}} 
         />

         <Hero />
         
         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </div>
   );
};

export default Home;