import React, { useEffect, useState } from 'react';
import FeedBox from '../../components/FeedBox/FeedBox';

import { IoReloadCircleOutline } from "react-icons/io5";

import { CircularProgress } from '@material-ui/core';

import db from '../../components/Firebase/firebase';
import './Home.css';

function Home() {

    const [feedContent, setFeedContent] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        let isMounted = true;               // note mutable flag

        db.collection('Questions')
            .orderBy('timestamp' , 'desc')
            .onSnapshot(snapshot => {
                
                if(isMounted)
                {
                    setFeedContent(
                        snapshot.docs.map( (doc) => ({
                            id : doc.id,
                            question : doc.data()
                        })
                        )
                    )
                    setIsLoading(false);
                }

            });

            return () => { isMounted = false }; // cleanup toggles value, if unmounted
    }, []);



    return (
        <>
        {
            navigator.onLine ? (


                isLoading ? (
                    <CircularProgress style = {{ marginLeft : "50%" , marginTop : "10%"}}/>
                ) : (

                <div className="main-content">
                    <div className="dummy-area"
                        style = {{
                            // background : "linear-gradient( 90deg , black 0% , var(--primary) 100%)"
                        }}
                    ></div>
                    <div className="que-feed"
                        style = {{
                            // background : "linear-gradient( 90deg , var(--primary) 0% , var(--secondary) 100%)"
                        }}
                    >
                        {
                            feedContent.map( ({ id , question }) => (
                                // <p>{`${id} question : ${JSON.stringify(question)}`}</p>
                                <FeedBox 
                                    key = {id}
                                    qid={id}
                                    question = {question.question}
                                    timestamp = {question.timestamp}
                                    quser = {question.user}
                                />
                            ))
                        }

                        <p
                            style = {{
                                    textAlign: "center",
                                    fontWeight: "100",
                                    color: "#5f5f5f",
                                    marginBottom: "15px"
                            }}
                        >No more Questions !!!</p>

                    </div>
                    <div className="dummy-area"
                        style = {{
                            // background : "linear-gradient( 90deg , var(--secondary) 0% , black 100%)"
                        }}
                    ></div>
                </div>

            )

            ) : (
                <div className = "net-error">
                    <IoReloadCircleOutline
                        style = {{

                                fontSize: "1.8em",
                                strokeWidth: "0.01em",
                                marginBottom: "20px",
                                cursor: "pointer"

                        }}
                        onClick = {() => window.location.reload()}
                    />
                    <p>
                        It seems you are Offline. Kindly check your network connection and Try again !!
                    </p>
                </div>
            )
        }
        </>
    )
}

export default Home
