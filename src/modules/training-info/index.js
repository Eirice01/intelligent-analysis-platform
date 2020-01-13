import React from "react";
import { Switch, Route } from "react-router-dom";

import { TrainingViewRoute } from "./trainingView.index";
import { AddTrainingRoute } from './addTraining.index'
import { TrainDetailRoute } from './trainDetail'
import trainingDirctStore from './trainingDirct.store'

function TrainingInfo() {
  trainingDirctStore.fetchTrainingDirct();
  return (
    <>
      <Switch>
        {TrainingViewRoute}
        {AddTrainingRoute}
        {TrainDetailRoute}
      </Switch>
    </>
  );
}
export default TrainingInfo;
export const TrainingInfoRoute = (
  <Route path="/entryInfo/trainingInfo" component={TrainingInfo} />
);
