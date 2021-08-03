import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import './Profile.css';

import { Avatar, Button, CircularProgress } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';

import db from '../../components/Firebase/firebase';

import firebase from 'firebase';


import { useStateValue } from '../../components/ContextAPI/StateProvider';
import { actionTypes } from '../../components/ContextAPI/Reducer';



function Profile() {

    const { profileId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(false);
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




    function changeProfilePic() {
        var files = [];
        var imgInput = document.createElement('input');
        imgInput.type = 'file';

        imgInput.onchange = (e) => {
            files = e.target.files;
            // console.log(files);
            // console.log(files[0].type.includes('image'));
            if(!files[0]?.type?.includes('image'))
            {
                alert('Kindly select an image !!!');
                return;
            }
            else
            uploadImage(files[0]);
        }

        imgInput.click();

        // console.log(document.childNodes);
        // console.log('parent : ' + imgInput.parentElement);
    }


    function uploadImage(file) {
        // console.log('running');
        setProgress(true);
    
        let storage = firebase.storage().ref();
        let uploadTask = storage
            .child("ProfileImages/" + file?.name)
            .put(file, file?.metadata);

            uploadTask.on(
                firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function(snapshot) {
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                    var progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                function(error) {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    // eslint-disable-next-line default-case
                    switch (error.code) {
                    case "storage/unauthorized":
                        alert(" User doesn't have permission to access the object");
                        break;
    
                    case "storage/canceled":
                        alert("User canceled the upload");
                        break;
    
                    case "storage/unknown":
                        alert(
                        "Unknown error occurred, inspect error.serverResponse"
                        );
                        break;
                    }
                },
                function() {
                    // Upload completed successfully, now we can get the download URL
                    uploadTask.snapshot.ref
                    .getDownloadURL()
                    .then(async function(downloadURL) {
                        console.log("File available at", downloadURL);
                        stateVal[1]({
                            type : actionTypes.SET_USER,
                            user : {
                                uid : user.uid,
                                name : user.name,
                                photoUrl : downloadURL
                            }
                        });
                        
                        await syncWithdb(downloadURL);

                        window.location.reload();
                    });
                }
                );
    }




    async function syncWithdb(photoURL) {

        const useRef = db.collection('Users').doc(user.uid);
        console.log(useRef);

        await useRef.update({
            photoUrl : photoURL
        });

        const questionRef = await db.collection('Questions').where('user.uid' , '==' , user.uid).get();

        questionRef.docs.map( doc => {
            const docRef = db.collection('Questions').doc(doc.id);

            return docRef.update({
                    'user.photoUrl' : photoURL
            });
        });


        const allQuestions = await db.collection('Questions').get();

        if(allQuestions.docs.length > 0)
        {
            // allQuestions.docs.map( async (qdoc) => {
            //     console.log('qdoc : ' , qdoc.id , qdoc.data());
            //     const answerRef =  await db.collection('Questions').doc(qdoc.id).collection('Answers').where('user.uid' , '==' , user.uid).get();
            //     console.log(qdoc.id , answerRef.docs);
    
            //     /*const returnedVal = */return answerRef.docs.map( adoc => {
            //         const docRef = db.collection('Questions').doc(qdoc.id).collection('Answers').doc(adoc.id);
            //         console.log('ans id : ' , adoc.id);
            //         return docRef.update({
            //                 'user.photoUrl' : photoURL
            //         });
            //     });
            //     /*return returnedVal;*/
            // });
            for(const quesDoc in allQuestions.docs)
            {
                
                const answerRef =  await db.collection('Questions').doc(allQuestions.docs[quesDoc].id).collection('Answers').where('user.uid' , '==' , user.uid).get();
                // console.log(allQuestions.docs[quesDoc].id , answerRef.docs);
    
                answerRef.docs.map( adoc => {
                    const docRef = db.collection('Questions').doc(allQuestions.docs[quesDoc].id).collection('Answers').doc(adoc.id);

                    return docRef.update({
                            'user.photoUrl' : photoURL
                    });
                });
            }
        }

    }






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
                        <Avatar src = {given_user_stats.data.photoUrl} />
                        {
                        user.uid === given_user_stats.id && (                        
                        <CreateOutlinedIcon
                                style ={{
                                    background : "#3166f7",
                                    marginLeft : "-18px",
                                    zIndex : "3",
                                    color : "#e2e2e2",
                                    fontSize : "1.7rem",
                                    borderRadius : "50%",
                                    boxShadow: "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
                                    padding : "5px",
                                    cursor : "pointer"
                                }}

                                onClick = {changeProfilePic}
                            />
                        )}
                        <h2>{given_user_stats.data.name}</h2>
                        {
                            progress && (
                                <CircularProgress 
                                    style = {{
                                        marginLeft : "100px"
                                    }}
                                />
                            )
                        }
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
