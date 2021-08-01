import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import db, { auth, provider } from '../components/Firebase/firebase';
import { useStateValue } from '../components/ContextAPI/StateProvider';
import { actionTypes } from '../components/ContextAPI/Reducer';
// import { Alert } from '@material-ui/lab';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      {/* <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '} */}
      <strong>AskIt</strong>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignInSide() {

  /*---------My Code--------------*/
//   const [{user} , dispatch] = useStateValue();
    const stateVal = useStateValue();
    // const [email, setEmail] = useState("");

  function signInWithGoogle() {
    auth.signInWithPopup(provider)
    .then((result) => {

        const curr_user = {
          uid : result.user.uid,
          name : result.user.displayName,
          photoUrl : result.user.photoURL
        };

        stateVal[1]({
            type : actionTypes.SET_USER,
            user : curr_user
        });

        // console.log('curr_user : ' , curr_user);

        localStorage.setItem('user', JSON.stringify(curr_user));

        if(result.additionalUserInfo.isNewUser)
        {
          db.collection('Users')
          .doc(result.user.uid)
          .set({
            name : result.user.displayName,
            email : result.user.email,
            photoUrl : result.user.photoURL,
            noOfQuestions : 0,
            noOfAnswers : 0
          });
        }
    }).catch(error => {
        console.log(error);
    });
  }

  function handleSignIn(e) {
    e.preventDefault();

    const email = document.getElementById("email");
    const password = document.getElementById("password");

    auth.signInWithEmailAndPassword(email.value , password.value)
    .then( (res) => {
      // console.log(res);
      // console.log(auth.currentUser);

      db.collection('Users').doc(auth.currentUser.uid)
      .get().then(doc => {

        const curr_user = {
          uid : auth.currentUser.uid,
          name : doc.data().name,
          photoUrl : doc.data().photoUrl
        };

        stateVal[1]({
          type : actionTypes.SET_USER,
          user : curr_user
        });

        localStorage.setItem('user', JSON.stringify(curr_user));
        // console.log(stateVal[0].user);

        email.value = "";
        password.value = "";

      });

    }).catch( error => {

      var errorCode = error.code;
        if (errorCode === 'auth/user-not-found') {
          /*<Alert variant="outlined" severity="error">
            {'No user have been registered to this Email. Have you Signed Up or maybe you can try logging in with Google !!!'}
          </Alert>*/
          alert('No user have been registered to this Email. Have you Signed Up or maybe you can try logging in with Google !!!');
        }
        else if (errorCode === 'auth/invalid-email'){
          alert('Kindly write your correct Email !!');
        } 
        else if(errorCode === 'auth/wrong-password') {
          alert('You have entered the wrong password or maybe you had signed up using Google !!')
        }
        else {
        alert(error.message);
        }

        console.log(error);

        // console.log(e);
        // alert(e.message);
        password.value = "";

    });

    

  }


  function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById("email");

    auth.sendPasswordResetEmail(email.value)
    .then(() => {
      alert('The Password reset mail has been sent to your mail. Kindly check and confirm !!!')
    })
    .catch((error) => {
      alert(error.message);
      // ..
    });
  }



  /*---------Copied Code--------------*/
  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick = {handleSignIn}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick = {handleForgotPassword}>
                  Forgot password?
                </Link>
              </Grid>
              <Grid item /*align="center"*/>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
              <Box mt={2}>
              <Typography variant="body2" color="textSecondary" align="center">
                  {" or "}
              </Typography>
              </Box>
              <Box mt={2}>
                  <div style = {{
                      backgroundColor : 'rgb(37, 150, 190)',
                      height : "50px",
                      display : "flex",
                      alignItems : "center",
                      border : "2px solid rgb(37, 150, 190)",
                      borderRadius : "3px",
                      cursor : "pointer"
                      }} 
                      onClick = {signInWithGoogle}>
                      <img 
                      src = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png"
                      alt = "Google Logo"
                      style = {{
                          height : "45px",
                          width : "45px",
                        //   marginLeft : "1px",
                          padding : "10px",
                          backgroundColor : "white",
                          borderRight : "1px solid gray"
                      }}
                      />
                      <h5 style = {{
                          color : "white",
                          fontSize : "1.2em",
                          marginLeft : "auto",
                          marginRight : "auto"
                      }}>
                          {'Log In With Google'}
                      </h5>
                  </div>
              </Box>
            {/* </Grid> */}
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}