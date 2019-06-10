import React from 'react';
import PropTypes from 'prop-types';

//{"type":"f","time":45,"text":"...","cat":"Release","src":"https:www..."}
    //Sometimes has "img"
const SubFact = ({ sub: {type, cat, time, text, src, img} }) => {
    let imgTag = "";
    if (img) {
        let style = {
            backgroundImage: 'url(' + img + ')'
        };
        imgTag = <div className="img" style={style}></div>;
    }
    return (
        <div className={"subfact-container"}>
            {imgTag}
            <div>{text}</div>
        </div>
    );
};

SubFact.propTypes = {
    sub: PropTypes.object
};

export default SubFact;