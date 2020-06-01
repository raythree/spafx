import React, {useRef} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function ButtonAppBar(props) {
  const classes = useStyles();
  const anchor = useRef();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
  
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <span id="menu-anchor" ref={anchor}>
            <IconButton
              edge="start" 
              className={classes.menuButton} 
              color="inherit" 
              aria-label="menu"
              onClick={handleClick}
            >
              <MenuIcon />
            </IconButton>
          </span>
          <Typography variant="h6" className={classes.title}>
            {props.name || "No Name"}
          </Typography>
        </Toolbar>         
      </AppBar>
      <Menu
        id="main-nav"
        anchorEl={anchor.current}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}><Link href="/spa1">SPA One</Link></MenuItem>
        <MenuItem onClick={handleClose}><Link href="/spa2">SPA Two</Link></MenuItem>
      </Menu>      
    </div>
  );
}
