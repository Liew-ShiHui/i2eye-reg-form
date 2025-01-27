import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import HealingIcon from "@material-ui/icons/Healing";
import { Link } from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";

class NavBar extends Component {
  render() {
    const { className: classes } = this.props;
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.root}>
            i2Eye
          </Typography>
          <Link to="/registration">
            <Tooltip title="Registration">
              <IconButton className={classes.icon}>
                <HealingIcon />
              </IconButton>
            </Tooltip>
          </Link>
        </Toolbar>
      </AppBar>
    );
  }
}

export default NavBar;
