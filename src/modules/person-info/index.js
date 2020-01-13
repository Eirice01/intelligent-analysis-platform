import React from "react";
import { Switch, Route } from "react-router-dom";

import { PersonnelViewRoute } from "./personnelView.index";
import { AddPersonRoute } from "./addPerson.index";
import {PersonDetailRoute} from './personDetail'
import personDirctStore from './personDirct.store';



function PersonInfo() {
  personDirctStore.fetchPersonDirct();
  return (
    <>
      <Switch>
        {PersonnelViewRoute}
        {AddPersonRoute}
        {PersonDetailRoute}
      </Switch>
    </>
  );
}
export default PersonInfo;
export const PersonInfoRoute = (
  <Route path="/entryInfo/personInfo" component={PersonInfo} />
);
