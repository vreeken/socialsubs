import React from 'react';
import PropTypes from 'prop-types';

//{"type":"m","cat":"Continuity mistake","time":390,"text":"..."}
const SubMistake = ({ sub: {type, cat, time, text} }) => {
    return (
        <div>
            Mistake: {text}
        </div>
    );
}

SubMistake.propTypes = {
    sub: PropTypes.object
};

export default SubMistake;