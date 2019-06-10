import React from 'react';
import PropTypes from 'prop-types';

 //TODO answer_time needs to be formatted correctly
    //{"type":"q","time":60,"question":"...?","pending":"Revealed soon","answer_time":"00:01:20","answer":"..."}
const SubQuestion = ({ sub: {time, question, pending, answer_time, answer}, running_time }) => {
    if (answer_time && (running_time < answer_time)) {
        return (
            <div>
                Question:
                <div>{question}</div>
                <br/>
                <div>{pending || "Answer will be revealed in "} {(answer_time - running_time) + " seconds"}</div>
            </div>
        );
    }
    else if (!answer_time && (running_time < time+10)) {
        return (
            <div>
                Question:
                <div>{question}</div>
                <br/>
                <div>{pending || "Answer will be revealed in " + (time + 10 - running_time) + " seconds"}</div>
            </div>
        );
    }

    return (
        <div>
            Question:
            <div>{question}</div>
            <br/>
            Answer:
            <div>{answer}</div>
        </div>
    );
};

SubQuestion.propTypes = {
    sub: PropTypes.object,
    running_time: PropTypes.number
};

export default SubQuestion;