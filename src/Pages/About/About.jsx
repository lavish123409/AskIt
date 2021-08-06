import React from 'react';

import './About.css';

function About() {
    return (
        <div className = "about">
            <h1>About</h1>
            <br/>
            <h4>Hello Everyone ,</h4>
            <br/>
            <p>
                My name is Lavish. I am currently studying in Third year of Bachelor of Technology in 
                Computer Science from IIT Bhilai. I have made this small QnA website to , surprise , have Question and Answer discussion
                among people. It has been made using <strong>React</strong> and <strong>Firebase</strong>.
                <br/>
            </p>
            <br/>
                <h2>Shortcomings</h2>
                <br/>
                <p>As of now , I have noticed following shortcomings :
                <br/>
            </p>
                <ol>
                    <li>The search feature is currently not working as I have not much knowledge about it.</li>
                    <li>It is not completely mobile responsive , so if you are using it through mobile kindly switch to Desktop Mode.</li>
                    <li>The Comments feature is not in working condition.</li>
                </ol>
                <br/>
            <p>
                If you find any bug or problem, you can report it <a href = "https://github.com/lavish123409/AskIt/issues">here</a>.
                I will try to overcome these shortcomings in near future. So, till then you can explore it and have fun.
                <br/><br/>
                <a href = "https://youtu.be/dQw4w9WgXcQ">An Important message !!</a>
            </p>
                <p
                    style = {{
                        fontSize : "0.7em",
                        textAlign : "center",
                        color : "gray"
                    }}
                >Copyright &copy; Lavish</p>

        </div>
    )
}

export default About
