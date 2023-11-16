import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import GroupList from "./components/Groups/GroupList";
import GroupIndex from "./components/Groups";
import Splash from "./components/Splash";
import GroupDetails from "./components/Groups/GroupDetails";
import EventList from "./components/Events/EventList";
import EventDetail from "./components/Events/EventDetail";
import CreateGroup from "./components/Groups/CreateGroup";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&<Switch>
        <Route exact path='/'>
          <Splash />
        </Route>
        <Route exact path="/groups">
          <GroupIndex />
        </Route>
        <Route exact path="/groups/new">
          <CreateGroup />
        </Route>
        <Route path ="/groups/:groupId">
         <GroupDetails />
         </Route>
         <Route exact path="/events">
          <EventList />
        </Route>
        <Route exact path="/events/:eventId">
          <EventDetail />
        </Route>
        </Switch>}
    </>
  );
}

export default App;
