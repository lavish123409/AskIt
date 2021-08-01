import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './Profile.css';

import { Avatar, Button, CircularProgress } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import db from '../../components/Firebase/firebase';


import { useStateValue } from '../../components/ContextAPI/StateProvider';
import { actionTypes } from '../../components/ContextAPI/Reducer';



function Profile() {

    const { profileId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    // var curr_user_stats = {};
    const [given_user_stats, setGiven_user_stats] = useState({});
    const stateVal = useStateValue();
    const user = stateVal[0].user;

    useEffect(() => {
        // console.log('profileId : ' , profileId , 'type : ' , profileId.type);

        db.collection('Users').doc(profileId).get()
        .then( (doc) => {
            // given_user_stats = JSON.parse(JSON.stringify(doc.data()))
            setGiven_user_stats({
                id : doc.id,
                data : doc.data()
            });
            setIsLoading(false);
        });

    }, [profileId]);


    const handleLogout = () => {
        // setUser({});
        stateVal[1]({
            type : actionTypes.LOGOUT_USER
        });
        localStorage.clear();
        window.location.replace('/');
      };

    return (
        <>
            {isLoading ? (
                <CircularProgress style = {{ marginLeft : "50%" , marginTop : "10%"}}/>
            ) : (
                <div className = "profile">
                    <h1>User Profile</h1>
                    <div className="user-info">
                        <Avatar src = {given_user_stats.data.photoUrl}/>
                        <h2>{given_user_stats.data.name}</h2>
                    </div>
                    <div className="stats">
                        <h3>Number of Questions asked : <span>{given_user_stats.data.noOfQuestions}</span></h3>
                        <h3>Number of Answers given : <span>{given_user_stats.data.noOfAnswers}</span></h3>
                    </div>
                    {
                        user.uid === given_user_stats.id && (
                            <Button variant = "contained" color = "secondary" size = "large"
                                style ={{ marginLeft : "20%" , marginTop : "40px"}}
                                endIcon = {<ExitToAppIcon/> }
                                onClick = {handleLogout}
                            >
                                Log Out
                            </Button>
                        )
                    }
                    {/* We are on profie page!!
                    My name is {given_user_stats.name}
                    I have asked {given_user_stats.noOfQuestions} questions and
                    I have given {given_user_stats.noOfAnswers} answers. */}
                </div>
            )}
        </>
    )
}

export default Profile
