import React from 'react';
import { Link, withRouter } from 'react-router-dom'
import { FormattedMessage } from 'react-intl';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import LayersIcon from '@material-ui/icons/Layers';

export function Menu() {
  return (
    <div>
      <Link to="/subscribers">
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Subscribers" />
        </ListItem>
      </Link>
      <Link to="/services">
        <ListItem button>
          <ListItemIcon>
            <LayersIcon />
          </ListItemIcon>
          <ListItemText primary="Services" />
        </ListItem>
      </Link>
    </div>
  );
}

export default withRouter(Menu)
