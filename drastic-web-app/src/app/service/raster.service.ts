import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Statistics } from '../model/statistics.model';
import { Symbology } from '../model/symbology.model';

@Injectable({
  providedIn: 'root'
})
export class RasterService {

  constructor(private httpClient: HttpClient) { }

  getStatistics(algorithm: string, variable: string): Promise<Statistics>{
    return new Promise((resolve, reject) => {
      const url = "http://127.0.0.1:5000/gvtool/raster/statistcs/${algorithm}/${variable}"
      this.httpClient.get<any>(url).subscribe(
        (res) =>{
          resolve(res.data);
        },
        (erro) =>{
          console.log("Erro: ", erro);
          reject(erro);
        }
      );
    });
  }

  getSld(layerName: string, symbologyList: Symbology[]){
    let colorMap = '';
    symbologyList.forEach(symbology => {
      colorMap += '<se:ColorMapEntry color="${symbology.color}" quantity="' + symbology.min + '" label="' + symbology.min + '"/>';
      console.log(colorMap)
    })
    return '<?xml version="1.0" encoding="UTF-8"?><StyledLayerDescriptor version="1.1.0"xmlns="http://www.opengis.net/sld"xmlns:se="http://www.opengis.net/se"xmlns:ogc="http://www.opengis.net/ogc"xmlns:xlink="http://www.w3.org/1999/xlink"xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xsi:schemaLocation="http://www.opengis.net/sldhttp://schemas.opengis.net/sld/1.1.0/StyledLayerDescriptor.xsd"><NamedLayer><se:Name>' + layerName + '</se:Name><UserStyle><se:Name>xxx</se:Name><se:FeatureTypeStyle><se:Rule><se:RasterSymbolizer><se:ChannelSelection><se:GrayChannel><se:SourceChannelName>1</se:SourceChannelName></se:GrayChannel></se:ChannelSelection><se:ColorMap type="ramp">${colorMap}</se:ColorMap></se:RasterSymbolizer></se:Rule></se:FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>'
  }
}
