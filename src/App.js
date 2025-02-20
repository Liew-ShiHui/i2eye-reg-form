import React, { Suspense, lazy } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./Components/AppLayouts/NavBar";

const RegForm = lazy(() => import("./RegForm"));

export default function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Router>
        <NavBar className={classes} />
        <div className={classes.content}>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route exact path="/" component={RegForm} />
              <Route exact path="/registration" component={RegForm} />
            </Switch>
          </Suspense>
        </div>
      </Router>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  icon: {
    color: "white",
  },
  content: {
    marginLeft: 80,
    marginRight: 80,
    marginTop: 30,
  },
}));
