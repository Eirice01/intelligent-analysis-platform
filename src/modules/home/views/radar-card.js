import React, { Component } from 'react'
import { HGroup,VGroup } from 'v-block.lite/layout'
import { observer } from 'mobx-react'

import { dashboardTitle } from '@modules/home'
import RadarChart from '@components/chart/radar'

@observer
class DashboardAbilityAnalysis extends Component {
  render() {
    const { store, title } = this.props;
    const { abilityAnalysisDatas } = store;
    const { label, value, time } = abilityAnalysisDatas;
    const center = ['50%', '50%'];
    return (
      <VGroup className="ability-info" horizontalAlign="flex-start" verticalAlign="flex-start" flex>
        <HGroup className="title" padding="0 0 10px 0" width="100%" horizontalAlign="space-between">
          { dashboardTitle(title, '100px') }
          <HGroup padding="14px 10px 0 0" style={{color: '#00F1D6'}}>{time}</HGroup>
        </HGroup>
        <HGroup width="100%" height="90%" horizontalAlign="space-around" className="radar-chart-box">
          {
            (label && label.length) && (value && value.length) ? <RadarChart height="100%" width="100%" center={ center } data={abilityAnalysisDatas} /> : null
          }
        </HGroup>
      </VGroup>
    )
  }
}
export default DashboardAbilityAnalysis;

