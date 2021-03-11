import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/pages/HomePage/Home';
import Footer from './components/pages/Footer/Footer';
import AboutUs from './components/pages/AboutUs/about-us';
import SignIn from './components/pages/SignIn/sign-in';
import SignUp from './components/pages/SignUp/sign-up';
import Terms from './components/pages/Terms/terms';
import Privacy from './components/pages/Privacy/privacy';


function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path='/' exact component={Home} />
        <Route path='/about-us/' component={AboutUs}  />
        <Route path='/sign-up/' component={SignUp}  />
        <Route path='/sign-in/' component={SignIn}  />
      </Switch>
      <Route path='/terms/' component={Terms}  />
      <Route path='/privacy/' component={Privacy}  />
      <Footer />
    </Router>   
  );
}

export default App;
