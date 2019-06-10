import React, {useState} from 'react';
import PropTypes from 'prop-types';

//{"type":"p","id":"1","time":860,"question":"...?","options":["R2-D2","C-3PO"]}
const SubPoll = ({ sub: {type, id, time, question, options} }) => {
    const [voted, setVoted] = useState(false);
    const [results, setResults] = useState([]);

    const optionsList = options.map((op, i) =>
        <li key={i} onClick={() => vote(i)} className={"clickable"}>
            {op}
        </li>
    );

    const resultsList = results.map((res, i) =>
        <li key={i}>
            {options[i]} - {res} votes
        </li>
    );

    const vote = (i) => {
        axios.post('/api/polls/'+id+'/'+i)
            .then(response => {
                if (response.data && response.data.success) {
                    Toast.showSuccess("Vote Saved")

                    setResults(response.data.results);
                    setVoted(true);
                }
                else {
                    //TODO handle this error
                    console.log('Error');
                    console.log(response);
                    console.log(response.data);
                    Toast.showError("Failed to save your vote");
                }
            })
            .catch(error => {
                console.log(error);
                Toast.showError("Failed to save your vote");
            });
    };

    if (!voted) {
        return (
            <div>
                Poll:
                <div>{question}</div>

                <ul>{optionsList}</ul>
            </div>
        );
    }

    return (
        <div>
            Poll:
            <div>{question}</div>

            <ul>{resultsList}</ul>
        </div>
    );
}

SubPoll.propTypes = {
    sub: PropTypes.object
};

export default SubPoll;