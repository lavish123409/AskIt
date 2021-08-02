import React , {useState} from 'react';
import { NavItems } from "./NavItems";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineAlignRight } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi"; 
import "./NavBar.css";
import { Link } from "react-router-dom";
import Modal from 'react-modal';
import { Avatar, Input } from '@material-ui/core'
import { useStateValue } from '../ContextAPI/StateProvider';
import db from '../Firebase/firebase';
import firebase from "firebase";

function NavBar() {
    const [click, setClick] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [question, setQuestion] = useState("");

    const stateVal = useStateValue();
    const user = stateVal[0].user;


    const menuIconClicked = () => {
        setClick( !click );
    }

    const closeMobileMenu = () => {
        // localStorage.clear();
        setClick( false );
    }


    const addQuestion = () => {
        
        if(question === "")
        {
            alert('Kindly write your Question !!!');
            return;
        }

        db.collection('Questions').add({
            question : question,
            timestamp : firebase.firestore.FieldValue.serverTimestamp(),
            downVotes : [],
            noOfDownvotes : 0,
            user : user
        });

        const userRef = db.collection('Users').doc(user.uid);
        const increment = firebase.firestore.FieldValue.increment(+1);

        userRef.update({ noOfQuestions: increment });

        setOpenModal(false);
        setQuestion("");
    }



    return (
        <>
            <nav className="navbar">
                <div className="main-section">
                    <div className="navbar-container">
                        <Link to="/" className="navbar-logo" onClick = {closeMobileMenu}>
                            Ask-IT
                        </Link>
                        
                        <div className="menu-icon" onClick = {menuIconClicked}>
                            { click ? (<AiOutlineClose className = "icon"/>) : (<AiOutlineAlignRight className = "icon"/>)}
                        </div>
                        
                        <ul className = { click ? "nav-menu active" : "nav-menu" }>
                            {NavItems.map( (item , index) => {
                                return (
                                    <li key = {index} className='nav-item'>
                                        <Link 
                                            className = {item.cName} 
                                            to = {item.title === 'Profile' ? item.to + `/${user.uid}` : item.to} 
                                            onClick = {closeMobileMenu}
                                        >
                                            {item.title}
                                        </Link>
                                    </li>
                                )
                            } )}
                        </ul>
                        {/* <Button btnSize="btn--medium" btnStyle = "btn--rounded">Make A Team</Button> */}
                        <div className="search-box">
                            <BiSearchAlt className = "icon" />
                            <input type="text" placeholder="Search the Question..." />
                        </div>
                    </div>

                    <div className="askQuestion">
                        <button /*className="askQuestion"*/
                            onClick = {() => {
                                setOpenModal(true);
                                console.log("button clicked",openModal);
                            }}
                        >Ask Question</button>
                    </div>

            <Modal 
                isOpen={openModal}
                onRequestClose = {() => setOpenModal(false)}
                center
                appElement={document.getElementById('root')}
                className = "modal"
            >
                <div className="mcontent">
                    <div className="modal--title">
                        <h1>Add Question</h1>
                        <AiOutlineClose 
                            className = "icon mclose"
                            onClick = {() => setOpenModal(false)}
                        />
                    </div>
                    <div className="user--area">
                        <Link 
                            to="/profile/:profileId"
                            className="ua--link"
                            onClick = {() => setOpenModal(false)}
                        >
                            <div className="ua--avatar">
                                <Avatar src = {user.photoUrl}/>
                            </div>
                            <h4>{user.name}</h4>
                        </Link>
                        <h4>{"   asked :"}</h4>
                    </div>
                    <div className="qinput--wrapper">
                        <Input 
                            required
                            type = "text"
                            placeholder = "Start your question with 'What' , 'Why' , 'How' etc...."
                            className = "question-input"
                            value = {question}
                            onChange = {(e) => setQuestion(e.target.value)}
                        />
                    </div>
                    <div className="action-buttons">
                        <button onClick = {() => setOpenModal(false)} className = "act-buttons">Cancel</button>
                        <button onClick = {addQuestion} className = "act-buttons adq-button">Add Question</button>
                    </div>
                </div>
            </Modal>

                </div>
                
            </nav>
        </>
    )
}

export default NavBar
