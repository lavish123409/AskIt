import React, { useEffect, useState } from 'react';
import FeedBox from '../../components/FeedBox/FeedBox';
import db from '../../components/Firebase/firebase';
import './Home.css';

function Home() {

    const [feedContent, setFeedContent] = useState([]);

    useEffect(() => {
        db.collection('Questions')
            .orderBy('timestamp' , 'desc')
            .onSnapshot(snapshot => 
                setFeedContent(
                    snapshot.docs.map( (doc) => ({
                        id : doc.id,
                        question : doc.data()
                    })
                    )
                )
            );
    }, []);



    return (
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

            </div>
            <div className="dummy-area"
                style = {{
                    // background : "linear-gradient( 90deg , var(--secondary) 0% , black 100%)"
                }}
            ></div>
        </div>
    )
}

export default Home
