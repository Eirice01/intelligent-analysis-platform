import React, { Component } from 'react'
import ReactMapboxGl, { Layer, Source, Popup } from 'react-mapbox-gl';
import styled from 'styled-components';
import { block } from 'v-block.lite/common'
import { svg } from './cycle';

import {iconMark} from './icon-mark';
import styles from './style.json'

let mapbox;

const Map = ReactMapboxGl({
  accessToken: '',
  minZoom: window.__private_URL.mapZoom.minZoom,
  maxZoom: window.__private_URL.mapZoom.maxZoom
});

// Define layout to use in Layer component
const layoutLayer_defalut = {
  'icon-image': 'defalut_img',
  "text-size": [ "interpolate", ["linear"],["zoom"], 13.5, 12, 16.5, 14 ],
};
const layoutLayer_active = {
  'icon-image': 'active_img',
  "text-field": "{name}",
  "text-size": [ "interpolate", ["linear"],["zoom"], 13.5, 16, 16.5, 18 ],
  "text-ignore-placement": true,
  "text-allow-overlap": true,
  "text-font": [ "PingFang PC" ],
  "text-offset": [ 0, 2.5 ],
  "text-anchor": "top"
};

const paint = {
  "text-color": "#00F1D6",
  "text-halo-color": "rgba(0, 0, 0, 1)",
  "text-halo-width": 1,
  "text-halo-blur": 1
};

// Create an image for the Layer
const image = new Image();
image.src = 'data:image/svg+xml;charset=utf-8;base64,' + btoa(svg);
// eslint-disable-next-line no-unused-vars
const images= ['londonCycle', image];

const StyledPopup = styled.div`
  background: white;
  color: #3f618c;
  font-weight: 400;
  padding: 5px;
  border-radius: 2px;
`;

// 绘制圆形marker

const flyToOptions = { speed: 0.8 };

const mapConfig= {
  fitBounds: undefined,
  center: window.__private_URL.mapCenter,
  zoom: [8],
  station: undefined,
  bearing: [-10],
  pitch: [20],
  animationOptions:{animate:true, duration:6000},
  flyToOptions:{speed:1}
};

@block.box_model
class ReactMapBox extends Component {
  constructor(props) {
    super(props);
    this.state = { mapConfig: mapConfig }
  }

  onStyleLoad = (map) => {
    mapbox = map;
    // map.addImage('defalut_img', image);
    map.addImage('defalut_img', iconMark.default(map));
    map.addImage('active_img', iconMark.active(map));
    const { coordinates } = this.props;
    const center = coordinates ? coordinates : window.__private_URL.mapCenter;
    setTimeout(() => {
      this.setState({ mapConfig:{...this.state.mapConfig, pitch:[50], bearing:[-31.6], center } })
    },1200)
  }

  onDrag = (e) => console.log('drag on map', e)

  onToggleHover(cursor, target) {
    const { map } = target || {};
    map && (map.getCanvas().style.cursor = cursor);
  }

  markerClick = (target) => {
    const { markerClickFuc } = this.props;
    markerClickFuc(target)
  }

  onMapClick=(_e, e) => {
    const { mapClickFuc } = this.props;
    mapClickFuc(_e, e)
  }

  markHadle= evt => {
    const bbox = [
      [evt.point.x - 5, evt.point.y - 5],
      [evt.point.x + 5, evt.point.y + 5]
    ];
    const features = mapbox.queryRenderedFeatures(bbox, { layers: ['marker_default'] });

    if(features.length) {
      const { markerClickFuc } = this.props;
      markerClickFuc(features[0])
    }
  }
  render() {
    const { mapConfig } = this.state;
    const station= this.state.mapConfig.station;
    const { stations } = this.props;
    const activeMark = this.props.activeMark || '';
    return (
      <>
      <Map
        style={ styles }
        movingMethod="easeTo"
        { ...mapConfig }
        containerStyle={{ height: '100%', width: '100%' }}
        onStyleLoad={this.onStyleLoad}
        onDrag={this.onDrag}
        flyToOptions={flyToOptions}
        onClick={this.onMapClick}
        >
          <Source id="marker_sourceID" geoJsonSource={{type: 'geojson', data: stations}}/>
          {/* <Layer type="symbol" id="marker_default" sourceId="marker_sourceID" layout={layoutLayer_defalut} onClick={this.markHadle} filter={['all', ['!=', 'name', activeMark]]}/> */}
          <Layer type="symbol" id="marker_default" sourceId="marker_sourceID" layout={layoutLayer_defalut} onClick={this.markHadle} />
          <Layer type="symbol" id="marker_active" paint={paint}  sourceId="marker_sourceID" layout={layoutLayer_active} filter={['all', ['==', 'name', activeMark]]}/>
          {station && (
            <Popup key={station.id} coordinates={station.position}>
              <StyledPopup>
                <div>{station.name}</div>
              </StyledPopup>
            </Popup>
          )}
        </Map>
      </>
    )
  }
}

export default ReactMapBox;
