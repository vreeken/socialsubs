import React from 'react';
import {withRouter} from "react-router";
import PropTypes from "prop-types";

import Nav from "./Nav";

//simple pass-through component that allows us to use multiple top level jsx elements/components
import Aux from '../components/utilities/_Aux';

//Adding our ToastComponent here in the layout prevents us from having to insert it into each jsx render
import ToastComponent from "../components/toast/ToastComponent";

//We need to be able to access the url from our Nav component, so wrap it withRouter
const NavWithRouter = withRouter(props => (
	<Nav currPath={props.location.pathname} />
));

function Layout(props) {
    return (
        <Aux>
            <NavWithRouter />
            <main className="content">
                {props.children}
            </main>

            <div className="toast">
                <ToastComponent />
            </div>
        </Aux>
    )
}

NavWithRouter.propTypes = {
    props: PropTypes.node
};
Layout.propTypes = {
    children: PropTypes.node
};

export default Layout;