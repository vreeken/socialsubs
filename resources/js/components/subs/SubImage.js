import React from 'react';
import PropTypes from 'prop-types';

/*
img {
    width: 100%;
    height: auto;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
 */

//{"type":"i","time":140,"url":"https:...","caption":"...","cat":"concept"}
const SubImage = ({ sub: {type, time, url, caption, cat} }) => {
    let style = {
        backgroundImage: 'url(' + url + ')'
    };
    const imgTag = <div className="img" style={style}></div>;

    return (
        <div className={"subimage-container"}>
            {imgTag}
            <div className="caption">
                {caption}
            </div>
        </div>
    );
};

SubImage.propTypes = {
    sub: PropTypes.object
};

export default SubImage;