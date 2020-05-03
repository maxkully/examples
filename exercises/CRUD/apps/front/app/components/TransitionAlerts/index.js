import React from 'react';
import Collapse from '@material-ui/core/Collapse';
import Alert from '@material-ui/lab/Alert';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function TransitionAlerts({ items, severity }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  console.log('TransitionAlerts items =>', items);

  return (
    <React.Fragment>
      {items.map(item => (
        <div
          key={`alert_${severity}#${item.toString()}`}
          className={classes.root}
        >
          <Collapse in={open}>
            <Alert
              severity={severity}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {item.message}
            </Alert>
          </Collapse>
        </div>
      ))}
    </React.Fragment>
  );
}

TransitionAlerts.propTypes = {
  severity: PropTypes.string,
  items: PropTypes.array,
};
