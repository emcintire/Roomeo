import './App.css';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Home from './components/pages/HomePage/Home';
import Footer from './components/pages/Footer/Footer';
import AboutUs from './components/pages/AboutUs/about-us';
import SignIn from './components/pages/SignIn/sign-in';
import SignUp from './components/pages/SignUp/sign-up';
import Terms from './components/pages/Terms/terms';


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
      <Footer />
      <Switch>
        <Route path='/terms/' component={Terms}  />
      </Switch>
    </Router>   
  );
}

export default App;
