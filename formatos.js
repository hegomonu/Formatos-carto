function deg_to_dms(deg, tipCoord){
    n = Math.abs(deg)
    d = parseInt(n)
    m = parseInt((n-d) * 60)
    s = (n - d - m/60.0) * 3600.0
    compass = {
        'lat': ['N','S'],
        'lon': ['E','W']
    }
    cardinal = 0
    if (0 >= deg){
        cardinal = 1
    }
    compass_str = compass[tipCoord][cardinal]
    return d.toString()+"d"+m.toString()+"m"+s.toFixed(3).toString()+'s '+compass_str;//#'{}°{}\'{:.3f}" {}'.format(d, m, s, compass_str)
}
function formatos50(){
    faja = ["I","H","G","F","E","D"]
    zona = [11,12,13,14,15,16]
    letra = ["A","B","C","D"]




    cred="GenNomV4 - ROLZ"
    desc = "Cobertura de cartas escala 1:50,000 de la totalidad del territorio mexicano"
    geom_type = "Polygon"




    var geoJSON = {
                    "type": "FeatureCollection",
                    "name": "FORMATOS REGULARES PARA CARTAS ESCALA 1:50000 (INEGI)",
                    "crs": { 
                        "type": "name", 
                        "properties": { 
                            "name": "EPSG:4326",
                            "Unit": "degree",
                            "Geodetic_CRS": "WGS 84",
                            "Datum": "World Geodetic System 1984",
                            "Ellipsoid": "WGS 84",
                            "Prime_meridian": "Greenwich",
                            "Area_of_use": "World",
                            "Data_source": "OGP",
                            "esri_wkt" : "GEOGCS['GCS_WGS_1984',DATUM['D_WGS_1984',SPHEROID['WGS_1984',6378137,298.257223563]],PRIMEM['Greenwich',0],UNIT['Degree',0.017453292519943295]]"
                        },
                    },
                    "features": [

                    ]
                };

    for (const f in faja) {
        for (const z in zona) {
            for (const l in letra) {
                var dictLon = Array()
                var dictLat = Array()
                let dictLonGMS = Array()
                let dictLatGMS = Array()
                let lnV1 = faja[f].charCodeAt(0)-64
                let lnV2 = parseInt(zona[z]) - 31
                let lnV3 = letra[l].charCodeAt(0) - 65
                //console.log(lnV1,lnV2,lnV3)
                //Latitud en MINUTOS del paralelo superior
                let AnguloMin = (60 * (4 * lnV1 - 2 * parseInt(lnV3 / 2)))
                
                for (var i = 0; i < 9; i++) {
                    dictLat[i] = AnguloMin/60.0
                    dictLatGMS[i] = deg_to_dms(dictLat[i],"lat")
                    AnguloMin = AnguloMin - 15.0
                }
                    
                //#Longitud en MINUTOS del meridiano izquierdo
                AnguloMin = (60 * (6 * lnV2 + 3 * (lnV3 % 2)))
                for (var i = 0; i < 10; i++) {
                    dictLon[i] = AnguloMin/60.0
                    dictLonGMS[i] = deg_to_dms(dictLon[i],"lon")
                    AnguloMin = AnguloMin + 20.0
                }
                for (var v = 0; v < 72; v++) {
                    let lo = (v % 9)
                    let la = parseInt(v/9)

                    let nom50k = faja[f] + (zona[z]).toString() + letra[l] + (la+1).toString() + (lo+1).toString() //Nomenclatura

                    let feature = { 
                                  "type": "Feature",                    
                                  "properties": {                   
                                        "CLAVE50K": "",                   
                                        "LONG_MIN": "",                  
                                        "LONG_MAX": "",                  
                                        "LATI_MIN": "",                   
                                        "LATI_MAX": ""                  
                                    },                  
                                  "geometry": {                     
                                        "type": "Polygon",                     
                                        "coordinates": null                  
                                    }                   
                                } 
                    feature.properties.CLAVE50K = nom50k
                    feature.properties.LONG_MIN = dictLonGMS[lo]
                    feature.properties.LONG_MAX = dictLonGMS[lo + 1]
                    feature.properties.LATI_MIN = dictLatGMS[la + 1]
                    feature.properties.LATI_MAX = dictLatGMS[la]
                    feature.geometry.coordinates = [[[dictLon[lo], dictLat[la]],[dictLon[lo + 1], dictLat[la]],[dictLon[lo + 1], dictLat[la + 1]],[dictLon[lo], dictLat[la + 1]],[dictLon[lo], dictLat[la]]]]
                    
                    geoJSON.features.push(feature);
                }
            }
        }
    }


    return geoJSON;
}

function formatos1(carta) {
    let lsCarta = carta.toUpperCase();
    
    var geoJSON = {
                    "type": "FeatureCollection",
                    "name": "FORMATOS REGULARES PARA CARTAS ESCALA 1:1000 (INEGI)",
                    "crs": { 
                        "type": "name", 
                        "properties": { 
                            "name": "EPSG:4326",
                            "Unit": "degree",
                            "Geodetic_CRS": "WGS 84",
                            "Datum": "World Geodetic System 1984",
                            "Ellipsoid": "WGS 84",
                            "Prime_meridian": "Greenwich",
                            "Area_of_use": "World",
                            "Data_source": "OGP",
                            "esri_wkt" : "GEOGCS['GCS_WGS_1984',DATUM['D_WGS_1984',SPHEROID['WGS_1984',6378137,298.257223563]],PRIMEM['Greenwich',0],UNIT['Degree',0.017453292519943295]]"
                        }
                    },
                    "features": [

                    ]
                };

    let lnV1 = (lsCarta.substring(0,1)).charCodeAt(0)-64//ord(lsCarta[0]) - 64
    let lnV2 = parseInt(lsCarta.substring(1,3))-31//int(lsCarta[1:3]) - 31
    let lnV3 = (lsCarta.substring(3,4)).charCodeAt(0)-65//ord(lsCarta[3]) - 65
    let lnV4 = parseInt(lsCarta.substring(4,5))-1//int(lsCarta[4]) - 1
    let lnV5 = parseInt(lsCarta.substring(5,6))-1//int(lsCarta[5]) - 1


    var dictLon = Array()
    var dictLat = Array()
    let dictLonGMS = Array()
    let dictLatGMS = Array()




    //Longitud en segundos del meridiano izquierdo
    let llAnguloSeg = 60 * (60 * (6 * lnV2 + 3 * (lnV3 % 2)) + 20 * lnV5);
    for (var i = 0; i < 49; i++) {
        dictLon[i] = llAnguloSeg/3600.0
        
        dictLonGMS[i] = deg_to_dms(dictLon[i],"lon")
        llAnguloSeg += 25
    }
    //Latitud en segundos del paralelo superior
    llAnguloSeg = 60 * (60 * (4 * lnV1 - 2 * parseInt(lnV3 / 2)) - 15 * lnV4)
    for (var i = 0; i < 33; i++) {
        dictLat[i] = llAnguloSeg/3600.0
        
        dictLatGMS[i] = deg_to_dms(dictLat[i],"lat")
        llAnguloSeg -= 28.125
    }

    for (var lnV6 = 0; lnV6 < 6; lnV6++) {
        for (var lnV7 = 0; lnV7 < 4; lnV7++) {
            for (var lnV8 = 0; lnV8 < 4; lnV8++) {
                for (var lnV9 = 0; lnV9 < 4; lnV9++) {
                    for (var lnV10 = 0; lnV10 < 4; lnV10++) {
                        let j = 16 * (lnV6 % 3) + 8 * (lnV7 % 2) + 4 * (lnV8 % 2) + 2 * (lnV9 % 2) + (lnV10 % 2);
                        let k = 16 * parseInt(lnV6 / 3) + 8 * parseInt(lnV7 / 2) + 4 * parseInt(lnV8 / 2) + 2 * parseInt(lnV9 / 2) + parseInt(lnV10 / 2);

                        
                        let nom1k = lsCarta + String.fromCharCode(97 + lnV6) + String.fromCharCode(49 + lnV7) + String.fromCharCode(97 + lnV8) + String.fromCharCode(49 + lnV9) + String.fromCharCode(97 + lnV10);
                        let nom2k = lsCarta + String.fromCharCode(97 + lnV6) + String.fromCharCode(49 + lnV7) + String.fromCharCode(97 + lnV8) + String.fromCharCode(49 + lnV9);
                        let nom5k = lsCarta + String.fromCharCode(97 + lnV6) + String.fromCharCode(49 + lnV7) + String.fromCharCode(97 + lnV8);
                        let nom10k = lsCarta + String.fromCharCode(97 + lnV6) + String.fromCharCode(49 + lnV7);
                        let nom20k = lsCarta + String.fromCharCode(97 + lnV6);

                        let feature = { 
                                  "type": "Feature",                    
                                  "properties": {                   
                                        "CLAVE1K": "",                   
                                        "LONG_MIN": "",                  
                                        "LONG_MAX": "",                  
                                        "LATI_MIN": "",                   
                                        "LATI_MAX": "",
                                        "CLAVE2K": "",
                                        "CLAVE5K": "",
                                        "CLAVE10K": "",
                                        "CLAVE20K": ""                  
                                    },                  
                                  "geometry": {                     
                                        "type": "Polygon",                     
                                        "coordinates": null                  
                                    }                   
                                };
                        feature.properties.CLAVE1K = nom1k;
                        feature.properties.LONG_MIN = dictLonGMS[j];
                        feature.properties.LONG_MAX = dictLonGMS[j + 1];
                        feature.properties.LATI_MIN = dictLatGMS[k + 1];
                        feature.properties.LATI_MAX = dictLatGMS[k];
                        feature.properties.CLAVE2K = nom2k;
                        feature.properties.CLAVE5K = nom5k;
                        feature.properties.CLAVE10K = nom10k;
                        feature.properties.CLAVE20K = nom20k;
                        feature.geometry.coordinates = [[[dictLon[j], dictLat[k]],[dictLon[j + 1], dictLat[k]],[dictLon[j + 1], dictLat[k + 1]],[dictLon[j], dictLat[k + 1]],[dictLon[j], dictLat[k]]]];
                        
                        geoJSON.features.push(feature);
                    }
                }
            }
        }
    }
    return geoJSON
}
