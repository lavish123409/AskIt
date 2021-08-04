import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Avatar , CircularProgress } from '@material-ui/core';

import { BsPencilSquare } from 'react-icons/bs';
import { AiOutlineClose } from "react-icons/ai";

import AnswerBox from '../../components/AnswerBox/AnswerBox';

import Modal from 'react-modal';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from 'ckeditor5-custom-build/build/ckeditor';

import db from '../../components/Firebase/firebase';
import firebase from 'firebase';

import './QuestionPage.css';

import { useStateValue } from '../../components/ContextAPI/StateProvider';

import MyUploadAdapter from '../../components/MyUploadAdapter/MyUploadAdapter'

function QuestionPage() {

    const { questionId } = useParams();
    const [questionObj, setQuestionObj] = useState({});
    const [answerList, setAnswerList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [data, setData] = useState("");

    const stateVal = useStateValue();
    const user = stateVal[0].user;

    
    useEffect(() => {
        // console.log('profileId : ' , questionId , 'type : ' , questionId.type);

        const questionRef = db.collection('Questions').doc(questionId);
        
        
        questionRef.get().then( (doc) => {

            setQuestionObj({
                id : doc.id,
                data : doc.data()
            });
            setIsLoading(false);
            
        });

        questionRef.collection('Answers')
        // .orderBy('noOfUpvotes' , 'desc')
        .orderBy('timestamp' , 'desc')
        .onSnapshot( snapshot => {

            setAnswerList(
                snapshot.docs.map( (doc) => ({
                    id : doc.id,
                    answerObj : doc.data()
                }))
            );

        });


    }, [questionId]);


    function handleChange(e,editor) {
        setData(editor.getData());
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

        db.collection('Questions').doc(questionId).collection('Answers').add({
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



    return (
        <div>

            <div className="main-content">
            <div className="qdummy-area"></div>
            <div className="ans-feed">
                {/* {console.log(questionId)} */}
                {/* {console.log(JSON.stringify(questionObj)) } */}
                {/* {console.log(answerList)} */}
                
                {
                    isLoading ? (
                        <CircularProgress style = {{ marginLeft : "50%" , marginTop : "10%"}}/>
                    ) : (
                            <div className="question-box">


                                <div className="user-area">
                                    <Link to={`/profile/${questionObj?.data?.user?.uid}`} className="ua--link">
                                        <div className="ua--avatar">
                                            <Avatar src = {questionObj?.data?.user?.photoUrl}/>
                                        </div>
                                        <h4 style = {{marginLeft : "30px"}}>{questionObj?.data?.user?.name}</h4>
                                    </Link>
                                    <small>{new Date(questionObj?.data?.timestamp?.toDate())?.toLocaleString()}</small>
                                </div>


                                <div className="question-area"
                                    style = {{fontSize : "0.9em" , cursor : "default"}}
                                >
                                    <h3>
                                        {'Question : '}
                                        {questionObj?.data?.question}
                                    </h3>
                                </div>



                                <div className="options">
                                    
                                    <div className="ans-icon"
                                    onClick = {() => {
                                        setOpenModal(true);
                                        // console.log("button clicked",openModal);
                                    }}
                                    >
                                        <BsPencilSquare />
                                        <p style={{marginLeft : "10px"}}>Answer</p>
                                    </div>

                                </div>



                            </div>

                    )
                }

                {/* {
                    db.collection('Questions').doc("V1h4CCE3OEi41q34yMgL").collection('Answers').doc("YE0ZoSQJUps9dSo7E5F3")
                    .get().then( (doc) => (
                        <AnswerBox
                        key = {doc.id}
                        qid = {"V1h4CCE3OEi41q34yMgL"}
                        anid = {"YE0ZoSQJUps9dSo7E5F3"}
                        // answer = {JSON.stringify(answerObj.answer)}
                        answer = {doc.data().answer}
                        timestamp = {doc.data().timestamp}
                        Upvotes = {doc.data().upVotes}
                        // Downvotes = {answerObj.downVotes}
                        auser = {doc.data().user}
                        />
                    ))
                } */}

                {
                    answerList.map( ({ id , answerObj}) => 
                    // id === "YE0ZoSQJUps9dSo7E5F3" &&
                    (
                        <AnswerBox
                            key = {id}
                            qid = {questionId}
                            anid = {id}
                            answer = {answerObj?.answer}
                            timestamp = {answerObj?.timestamp}
                            Upvotes = {answerObj?.upVotes}
                            Downvotes = {answerObj?.downVotes}
                            noOfUpvotes = {answerObj?.noOfUpvotes}
                            noOfDownvotes = {answerObj?.noOfDownvotes}
                            auser = {answerObj?.user}
                        />
                        // <div>
                        //     {parse(answerObj.answer)}
                        // </div>
                    ))
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
                                <h3>{questionObj?.data?.question}</h3>
                                <small>
                                    asked by &nbsp;
                                    <Link 
                                        to={`/profile/${questionObj?.data?.user?.uid}`}
                                        className="ua--link"
                                        onClick = {() => setOpenModal(false)}
                                    >
                                    <h4>{questionObj?.data?.user?.name}</h4>
                                    </Link>
                                    &nbsp; on {new Date(questionObj?.data?.timestamp?.toDate())?.toLocaleString()}
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
                                    // removePlugins : 'htmlwriter'
                                    // ckfinder: {
                                    //     // Upload the images to the server using the CKFinder QuickUpload command.
                                    //     uploadUrl: 'http://localhost:3000/test/upload/image'
                                    // },
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
            <div className="qdummy-area"></div>
        </div>
        </div>
    )
}

export default QuestionPage
