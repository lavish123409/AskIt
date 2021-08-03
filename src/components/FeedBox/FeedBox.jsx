import React , {useEffect, useRef, useState} from 'react';
import { Link } from "react-router-dom";

import './FeedBox.css';

import { Avatar } from "@material-ui/core";

import {FaArrowUp} from 'react-icons/fa';
import {FaArrowDown} from 'react-icons/fa';
import {FaRegComments} from 'react-icons/fa';
import { BsPencilSquare } from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import Modal from 'react-modal';

import parse from "html-react-parser";

import { useStateValue } from '../ContextAPI/StateProvider';

import firebase from 'firebase';
import db from '../Firebase/firebase';
import MyUploadAdapter from '../MyUploadAdapter/MyUploadAdapter';



function FeedBox({ qid , question , timestamp , quser }) {

    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState("");
    const [haveAnswer, setHaveAnswer] = useState(false);
    const [getAnswer, setgetAnswer] = useState([]);

    const [hasUpvoted, setHasUpvoted] = useState(false);
    const [hasDownvoted, setHasDownvoted] = useState(false);

    const answerRef = useRef();

    const stateVal = useStateValue();
    const user = stateVal[0].user;

    // const dummyAnswer = "Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
    // const dummyQuestion = "What is Lorem Ipsum?Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ?";


    useEffect(() => {
        db.collection('Questions').doc(qid).collection('Answers')
        .orderBy('noOfUpvotes' , 'desc')
        .orderBy('timestamp' , 'desc')
        .limit(1)
        .onSnapshot( snapshot => {

            if(snapshot.docs.length > 0)
            {
                setgetAnswer(
                    snapshot.docs.map( (doc) => ({
                        id : doc.id,
                        obj : doc.data()
                    }))
                );
                // answerRef.current = snapshot.docs[0];
                // console.log(answerRef.current);
                setHaveAnswer(true);
            }

            /*snapshot.docs.map( (doc) => {
            if(doc.exists())
            {
                setgetAnswer( {
                    id : doc.id,
                    obj : doc.data()
                } );
                setHaveAnswer(true);
            }
            else
            setHaveAnswer(false);                 
            } )*/
        }
        );


    }, [qid]);


    useEffect( () => {
        answerRef.current = db.collection('Questions').doc(qid).collection('Answers').doc(getAnswer[0]?.id);
    } , [qid,getAnswer] );


    useEffect(() => {

        setHasUpvoted(getAnswer[0]?.obj?.upVotes?.includes(user.uid));
        setHasDownvoted(getAnswer[0]?.obj?.downVotes?.includes(user.uid));
        // setHasUpvoted(answerRef?.current?.data()?.upVotes?.includes(user.uid));
        // setHasDownvoted(answerRef?.current?.data()?.downVotes?.includes(user.uid));
    }, [user,getAnswer]);



    function handleChange(e,editor) {
        setData(editor.getData());
        // setData(data.replace(/&nbsp;/g , " "));
        // console.log(data);
        // console.log(data.replace(/&nbsp;/g , " ") , data);
    }


    function addAnswer() {
        if(data === "")
        {
            alert('Kindly write your brief Answer !!!');
            return;
        }

        /*if( user.uid === quser.uid)
        {
            alert('You cannot write answers on your own questions !!!');
            return;
        }*/

        db.collection('Questions').doc(qid).collection('Answers').add({
            answer : data.replace(/&nbsp;/g , " "),
            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
            upVotes : [],
            downVotes : [],
            noOfUpvotes : 0,
            noOfDownvotes : 0,
            user : user
        });

        const userRef = db.collection('Users').doc(user.uid);
        const increment = firebase.firestore.FieldValue.increment(+1);

        userRef.update({ noOfAnswers: increment });

        setOpenModal(false);
        setData("");
    }


    function upvote() {

        if(hasDownvoted)
        {
            alert('You have to first remove the downvote from the answer !!!');
            return ;
        }

        if(hasUpvoted)
        {
            answerRef?.current?.update({
                upVotes: firebase.firestore.FieldValue.arrayRemove(user.uid)
            });
            
            answerRef?.current?.update({
                noOfUpvotes: firebase.firestore.FieldValue.increment(-1)
            });
        }
        else
        {
            answerRef?.current?.update({
                upVotes: firebase.firestore.FieldValue.arrayUnion(user.uid)
            });

            answerRef?.current?.update({
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
        <div className="feed-box">
            {/* In feed box!! */}
            {/* <p>{getAnswer.map(valu => <p>{valu}</p>)}</p> */}
            {/* {console.log(getAnswer , qid)} */}
            {/* {console.log('hasUpvoted' , hasUpvoted)}
            {console.log('hasDownvoted' , hasDownvoted)} */}
            
            {/* User Area */}
            
            <div className="user-area">
                <Link to={`/profile/${quser.uid}`} className="ua--link">
                    <div className="ua--avatar">
                        <Avatar src = {quser.photoUrl}/>
                    </div>
                    <h4>{quser.name}</h4>
                </Link>
                <small>{new Date(timestamp?.toDate()).toLocaleString()}</small>
            </div>


            {/* Question Area */}


            <div className="question-area">
                <h3>{'Question : '}
                    <Link to = {`/question/${qid}`} className = "ans-user-link" style = {{color : "#363c38"}}>{question}</Link>
                </h3>
            </div>
            {haveAnswer && (
                <div className="answer-area">
                    <div className="answer"><strong>Top Answer :  </strong>{parse(getAnswer[0].obj.answer)}</div>
                    <small>Answered by { ' ' }
                        <Link to={`/profile/${getAnswer[0].obj.user.uid}`} className = "ans-user-link">{getAnswer[0].obj.user.name}</Link>
                        {' on ' + new Date(getAnswer[0].obj.timestamp?.toDate()).toLocaleString()}
                    </small>
                </div>
            )}


            {/* Options Area */}



            <div className="options">
                {haveAnswer ? (
                    <div style = {{display : "flex"}}>
                        <span className = "opt-icon-container"><FaArrowUp className="opt-icon" onClick = {() => upvote()}/> {getAnswer[0].obj.noOfUpvotes}</span>
                        <span className = "opt-icon-container"><FaArrowDown className="opt-icon" onClick = {() => downvote()}/> {getAnswer[0].obj.noOfDownvotes}</span>
                        <span className = "opt-icon-container" style = {{width : "30px"}}><FaRegComments className="opt-icon" style = {{margin : "auto"}}/></span>
                    </div>
                    ) : (
                        <div className="ans-icon"
                        onClick = {() => {
                            setOpenModal(true);
                            console.log("button clicked",openModal);
                        }}
                        >
                            <BsPencilSquare />
                            <p style={{marginLeft : "10px"}}>Answer</p>
                        </div>
                    )
                }




                    <Modal 
                        isOpen={openModal}
                        onRequestClose = {() => setOpenModal(false)}
                        center
                        appElement={document.getElementById('root')}
                        className = "modal"
                    >
                        
                        
                        
                        <div className="mcontent">
                            <div className="modal--title">
                                <h1>Answering to question </h1>
                                <AiOutlineClose 
                                    className = "icon mclose"
                                    onClick = {() => setOpenModal(false)}
                                />
                            </div>
                            <div className="qarea">
                                <h3>{question}</h3>
                                <small>
                                    asked by &nbsp;
                                    <Link 
                                        to={`/profile/${quser.uid}`}
                                        className="ua--link"
                                        onClick = {() => setOpenModal(false)}
                                    >
                                    <h4>{quser.name}</h4>
                                    </Link>
                                    &nbsp; on {new Date(timestamp?.toDate()).toLocaleString()}
                                </small>
                            </div>
                            <div className="editor">
                                <CKEditor
                                editor={ Editor }
                                data = {data}
                                onChange = {handleChange}
                                onReady = {editor => {
                                    // console.log(editor);
                                    editor.plugins.get("FileRepository").isEnabled = true ;
                                    editor.plugins.get("FileRepository").createUploadAdapter = loader => {
                                      return new MyUploadAdapter(loader);
                                    };
                                }}
                                config = {{
                                    toolbar: {
                                        items: [
                                            'heading',
                                            '|',
                                            'bold',
                                            'italic',
                                            'link',
                                            'bulletedList',
                                            'numberedList',
                                            '|',
                                            'outdent',
                                            'indent',
                                            '|',
                                            'imageUpload',
                                            'blockQuote',
                                            'codeBlock',
                                            'insertTable',
                                            'mediaEmbed',
                                            'findAndReplace',
                                            'undo',
                                            'redo'
                                        ]
                                    },
                                    language: 'en',
                                    image: {
                                        toolbar: [
                                            'imageTextAlternative',
                                            'imageStyle:inline',
                                            'imageStyle:block',
                                            'imageStyle:side'
                                        ]
                                    },
                                    table: {
                                        contentToolbar: [
                                            'tableColumn',
                                            'tableRow',
                                            'mergeTableCells'
                                        ]
                                    },
                                    licenseKey: '',                                
                                    // fillEmptyBlocks : false
                                }}
                            />

                            </div>
                            <div className="action-buttons">
                                <button onClick = {() => setOpenModal(false)} className = "act-buttons">Cancel</button>
                                <button onClick = {addAnswer} className = "act-buttons adq-button">Post Answer</button>
                            </div>
                        </div>
                    </Modal>
            </div>
        </div>
    )
}

export default FeedBox
