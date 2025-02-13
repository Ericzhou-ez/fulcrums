import Footer from "../components/footer";
import Nav from "../components/nav";
import '../styles/home.css';

export default function Home({ theme, handleToggleTheme }) {
   return (
      <div className="home">
         <Nav />

         <Footer theme={theme} handleToggleTheme={handleToggleTheme} />
      </div>
   );
}