import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorLayer from 'ol/layer/Vector';
import Icon from 'ol/style/Icon';
import { OSM, Vector as VectorSource } from 'ol/source';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';

@Component({
  selector: 'app-drastic',
  templateUrl: './drastic.component.html',
  styleUrls: ['./drastic.component.css']
})
export class DrasticComponent implements OnInit {

  map!: Map;

  geojson = {
    "type": "FeatureCollection",
    "name": "pontos",
    "crs": { 
      "type": "name",
      "properties": { 
        "name": "urn:ogc:def:crs:OGC:1.3:CRS84" 
      } 
    },
    "features": [
      { "type": "Feature", "properties": { "Name": "0", "description": null, "altitudeMode": "clampToGround", "Id": "0", "FID": "0", "Field_1": "0" }, "geometry": { "type": "Point", "coordinates": [ -53.089368615620558, -0.359176235286933 ] } },
      { "type": "Feature", "properties": { "Name": "0", "description": null, "altitudeMode": "clampToGround", "Id": "0", "FID": "1", "Field_1": "0" }, "geometry": { "type": "Point", "coordinates": [ -48.235268163726779, -2.500691140534186 ] } },
      { "type": "Feature", "properties": { "Name": "0", "description": null, "altitudeMode": "clampToGround", "Id": "0", "FID": "2", "Field_1": "0" }, "geometry": { "type": "Point", "coordinates": [ -52.518297974221291, -4.64220604578144 ] } }
    ]
  };

  circle = new CircleStyle({
    radius: 5,
    stroke: new Stroke({color: 'red', width: 1})
  });

  styles = {
    'Point': new Style({
      image: this.circle,
    })
  }

  vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(this.geojson, { featureProjection: 'EPSG:3857' }),
  });

  vectorLayer = new VectorLayer({
    source: this.vectorSource,
    style: new Style({
      image: this.circle,
    })
  })

  constructor() { }

  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }), this.vectorLayer
      ],
      view: new View({
        center: olProj.fromLonLat([-46,-2]),
        zoom: 5
      })
    });
  }

}
