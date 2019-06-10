import Icon from '@material-ui/core/Icon/index';

import React, {useGlobal, useState} from 'reactn/build/index';
import { makeStyles } from '@material-ui/core/styles/index';
import Drawer from '@material-ui/core/Drawer/index';
import List from '@material-ui/core/List/index';
import Divider from '@material-ui/core/Divider/index';
import ListItem from '@material-ui/core/ListItem/index';
import ListItemIcon from '@material-ui/core/ListItemIcon/index';
import ListItemText from '@material-ui/core/ListItemText/index';
import PropTypes from "prop-types";

import {EventBus} from "../components/utilities/EventBus";
import {NavLink} from "react-router-dom";

const useStyles = makeStyles({
	list: {
		width: 250,
	}
});


//Make sure we only listen once
let listening = false;

function Nav(props) {
	const [user] = useGlobal("user");
	const [redirectUrl, setRedirectUrl] = useState(false);

	const classes = useStyles();
	const [state, setState] = React.useState({
		top: false,
		left: false,
		bottom: false,
		right: false,
		showIcon: true
	});


	if (!listening) {
		EventBus.listen('toggleNavDrawer', () => toggleNavDrawerListener());
		listening=true;
	}

	const onLinkClick = function() {
		setRedirectUrl(props.currPath);
	};

	const toggleNavDrawerListener = function() {
		setState({...state, left: !state.left});
	};

	const toggleDrawer = (side, open) => event => {
		if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
			return;
		}

		setState({ ...state, [side]: open });
	};

	let lower_links = (
		<List>
			<NavLink onClick={() => onLinkClick()} to="/login" activeClassName="nav-active">
				<ListItem button>
					<ListItemIcon><Icon>power_settings_new</Icon></ListItemIcon>
					<ListItemText primary={"Login"} />
				</ListItem>
			</NavLink>
			<NavLink onClick={() => onLinkClick()} to="/register" activeClassName="nav-active">
				<ListItem button>
					<ListItemIcon><Icon>person_add</Icon></ListItemIcon>
					<ListItemText primary={"Register"} />
				</ListItem>
			</NavLink>
		</List>
	);

	if (user) {
		lower_links = (
			<List>
				<NavLink onClick={() => onLinkClick()} to="/account" activeClassName="nav-active">
					<ListItem button>
						<ListItemIcon><Icon>person</Icon></ListItemIcon>
						<ListItemText primary={"My Account"} />
					</ListItem>
				</NavLink>
				<NavLink onClick={() => onLinkClick()} to="/logout" activeClassName="nav-active">
					<ListItem button>
						<ListItemIcon><Icon>logout</Icon></ListItemIcon>
						<ListItemText primary={"Logout"} />
					</ListItem>
				</NavLink>
			</List>
		);
	}



	const sideList = side => (
		<div
			className={classes.list}
			role="presentation"
			onClick={toggleDrawer(side, false)}
			onKeyDown={toggleDrawer(side, false)}
		>
			<List>
				<NavLink to="/" exact activeClassName="nav-active">
				<ListItem button>
					<div className="nav-img-container"><img src={"/img/socialsubs_logo.svg"} /></div>
					<ListItemText primary={"SocialSubs"} />
				</ListItem>
				</NavLink>
				<NavLink to="/movies" activeClassName="nav-active">
					<ListItem button>
						<ListItemIcon><Icon>movie</Icon></ListItemIcon>
						<ListItemText primary={"Movies"} />
					</ListItem>
				</NavLink>
				<NavLink to="/about" activeClassName="nav-active">
				<ListItem button>
					<ListItemIcon><Icon>label</Icon></ListItemIcon>
					<ListItemText primary={"About"} />
				</ListItem>
				</NavLink>
			</List>
			<Divider />
			{lower_links}
		</div>
	);

	return (
		<nav>
			<Drawer open={state.left} onClose={toggleDrawer('left', false)}>
				{sideList('left')}
			</Drawer>
			{ props.currPath.substr(0,6) === "/watch" ?
				''
				:
				<div id="navToggle" onClick={toggleDrawer('left', true)}><Icon id="menu-button">menu</Icon></div>
			}

		</nav>
	);
}

Nav.propTypes = {
	currPath: PropTypes.string
};

export default Nav;
