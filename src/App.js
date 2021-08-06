import { Route, Switch } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import Home from './Pages/Home/Home';
import About from './Pages/About/About';
import Profile from './Pages/Profile/Profile';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import { useStateValue } from './components/ContextAPI/StateProvider';
import { useEffect, useRef, /*useState*/ } from 'react';
import { actionTypes } from './components/ContextAPI/Reducer';
import QuestionPage from './Pages/QuestionPage/QuestionPage';

function App() {
  // const [{ user } , dispatch] = useStateValue();
    const stateVal = useStateValue();
    
    // const chk = stateVal[0].user;
    // console.log('chk : ' , JSON.stringify(chk));
    /*for(var property in chk) {
      console.log(property + "=" + chk[property]);
    }*/
    // chk.map( val => console.log(val));
    // const [user, setUser] = useState(stateVal[0].user);
    const userRef = useRef(stateVal);
    // const [isUserPresent, setIsUserPresent] = useState(chk != null);


    useEffect(() => {
      const loggedInUser = localStorage.getItem("user");
      // console.log('log user : ' , loggedInUser);
      if (loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        // const foundUser = loggedInUser;
        // console.log('found user : ' , foundUser);
        // setUser(foundUser);
        userRef.current[1]({
          type : actionTypes.SET_USER,
          user : foundUser
        });
        // console.log("setted user");
        // setIsUserPresent(true);
      }
    }, []);

    /*useEffect( () => {
      console.log(user);
    } , [user] );

    /*useEffect(() => {
      
      if(user)
      {
        stateVal[1]({
          type : actionTypes.SET_USER,
          user : user
        });
      }
    }, [user]);*/

    /*function setUser(foundUser) {
        stateVal[1]({
          type : actionTypes.SET_USER,
          user : foundUser
        });
    }*/



  return (
    <div>

      {!stateVal[0].user ? (
        <Switch>
          <Route path="/signup" exact component={SignUp}/>
          <Route path="/" component={SignIn}/>
        </Switch>
      ) : (
        <div>
          <NavBar />
    
          <Switch>
              <Route path="/" exact component={Home}/>
              <Route path="/about" component={About}/>
              <Route path="/profile/:profileId" component={Profile}/>
              <Route path="/question/:questionId" component={QuestionPage}/>
          </Switch>
          </div>
  
      )}
    </div>
  );
}

export default App;
