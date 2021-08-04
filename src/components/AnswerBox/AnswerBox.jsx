import { Avatar } from '@material-ui/core';
import React, { /*useEffect,*/ useRef, useState } from 'react';
import { FaArrowDown, FaArrowUp, FaRegComments } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import parse from "html-react-parser";
import db from '../Firebase/firebase';
import firebase from "firebase";
import { useStateValue } from '../ContextAPI/StateProvider';

function AnswerBox({ qid , anid , answer , timestamp , Upvotes , Downvotes , noOfUpvotes , noOfDownvotes , auser }) {

    const stateVal = useStateValue();
    const user = stateVal[0].user;

    const [hasUpvoted, setHasUpvoted] = useState(Upvotes.includes(user.uid));
    // console.log(Upvotes.includes(user.uid));
    const [hasDownvoted, setHasDownvoted] = useState(Downvotes.includes(user.uid));

    const answerRef = useRef(db.collection('Questions').doc(qid).collection('Answers').doc(anid));

    // useEffect(() => {
    //     answerRef.current.
    // }, []);

    // function upvote() {
    //     ;
    // }


    function upvote() {

        if(hasDownvoted)
        {
            alert('You have to first remove the downvote from the answer !!!');
            return ;
        }

        if(hasUpvoted)
        {
            answerRef.current.update({
                upVotes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
            
            answerRef.current.update({
                noOfUpvotes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        else
        {
            answerRef.current.update({
                upVotes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });

            answerRef.current.update({
                noOfUpvotes: firebase.firestore.FieldValue.increment(+1)
            });
        }


        setHasUpvoted(!hasUpvoted);

    }



    function downvote() {

        if(hasUpvoted)
        {
            alert('You have to first remove the upvote from the answer !!!');
            return ;
        }

        if(hasDownvoted)
        {
            answerRef.current.update({
                downVotes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
            
            answerRef.current.update({
                noOfDownvotes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        else
        {
            answerRef.current.update({
                downVotes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });

            answerRef.current.update({
                noOfDownvotes: firebase.firestore.FieldValue.increment(+1)
            });
        }


        setHasDownvoted(!hasDownvoted);

    }



    return (
        <div>

            <div className="feed-box">
                {/* {console.log(hasUpvoted)} */}


                    <div className="user-area">
                        <Link to={`/profile/${auser?.uid}`} className="ua--link">
                            <div className="ua--avatar">
                                <Avatar src = {auser?.photoUrl}/>
                            </div>
                            <h4 style = {{marginLeft : "30px"}}>{auser?.name}</h4>
                        </Link>
                        <small>{new Date(timestamp?.toDate()).toLocaleString()}</small>
                    </div>

                    { /* --------------Answer Area---------------- */ }

                    <div className="question-area" 
                        style = {{ cursor : "default" , fontWeight : "lighter" , padding : "1.5em 2em"}}
                    >
                        <p><strong>Answer :</strong></p>
                            {/* { ' ' + parse(JSON.parse(answer))} */}
                            {/* {console.log(typeof answer)} */}
                            {parse(answer)}
                            {/* {htmlspecialchars(answer, ENT_QUOTES, "UTF-8")} */}

                    </div>



                    <div className="options">
                        
                        <div style = {{display : "flex"}}>
                            <span className = "opt-icon-container"><FaArrowUp className="opt-icon" onClick = {() => upvote()}/>{noOfUpvotes}</span>
                            <span className = "opt-icon-container"><FaArrowDown className="opt-icon" onClick = {() => downvote()}/> {noOfDownvotes} </span>
                            <span className = "opt-icon-container" style = {{width : "30px"}}><FaRegComments className="opt-icon" style = {{margin : "auto"}}/></span>
                        </div>

                    </div>



                </div>


        </div>
    )
}

export default AnswerBox
