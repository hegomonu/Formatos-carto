function headerkml(name){//nombre de documento kml
	return '<?xml version="1.0" encoding="UTF-8"?>'+
			'<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">'+
			'<Document>'+
			'	<name>'+name+'</name>'+
			'	<open>1</open>'
}
function schemakml(feature) { // lista de porpiedades o atributos
	var list = feature.properties
	schema = '<!-- ESQUEMA -->'+
			'<Schema name="Capa" id="Data">'
	for (var l in list){
		schema = schema +'	<SimpleField type="string" name="'+l+'"></SimpleField>'
	}
	schema = schema +'</Schema>'
	return schema;
}
function stylekml(feature,bool, urlimg) { //bool popup ballon style 
	var list = feature.properties
	var style = '<!-- ESTILO -->'+
			'<StyleMap id="estiloMapa">'+
			'<Pair>'+
			'<key>normal</key>'+
			'<styleUrl>#normalState</styleUrl>'+
			'</Pair>'+
			'<Pair>'+
			'<key>highlight</key>'+
			'<styleUrl>#highlightState</styleUrl>'+
			'</Pair>'+
			'</StyleMap>'+
			'<Style id="normalState">'+
			'<IconStyle>'+
			'<scale>1.1</scale>'+
			'</IconStyle>'+
			'<LabelStyle>'+
			'<color>ff767676</color>'+
			'<scale>5</scale>'+
			'</LabelStyle>'+
			'<LineStyle>'+
			'<color>ffff0000</color>'+
			'<width>3</width>'+
			'</LineStyle>'+
			'<PolyStyle>'+
			'<color>1900ffff</color>'+
			'</PolyStyle>'+
			'</Style>'+
			'<Style id="highlightState">'+
			'<!-- ESTILO ILUMINADO POPUP -->';
	if (bool){
		style = style + '<BalloonStyle>'+
						'	<text><![CDATA[<table cellpadding="2" cellspacing="2" style="border:0px solid #0C6304" width="400px">'+
						'	<tr><td align="center" colspan="2"><img src="'+urlimg+'" height="50"></td></tr>'+
						'	<tr><td align="center" colspan="2"><font size="2" face="verdana" color="#696969">Entidad Geografica</font></td></tr>'+
						'	<tr><td align="center" colspan="2"><b><font size="2" face="verdana" color="#2B422A">https://github.com/hegomonu</font></b></td></tr>'+
						'	</table>'+
						'	<table cellpadding="2" cellspacing="2" style="border:1px solid #0C6304" width="400px">';
		for (var l in list){
			style = style + '<tr><td align="right"><font size="2" face="verdana" color="#000000">'+l+' : </font></td><td><font size="2" face="verdana" color="#555555">$[Capa/'+l+']</font></td></tr>'
		}
		style = style + '</table>'+
						'<table cellpadding="2" cellspacing="2" style="border:0px solid #0C6304" width="400px">'+
						'<tr><td align="center"><font size="2" face="verdana" color="#696969">BDG-Montiel</font></b></td></tr>'+
						'</table>]]>'+
						'</text>'+
					'</BalloonStyle>';
	}

	style = style + '<LineStyle>'+
			'<width>3</width>'+
			'</LineStyle>'+
			'<PolyStyle>'+
			'<color>3256f5ed</color>'+
			'</PolyStyle>'+
			'</Style>';
	return style;


}
function placemarkskml(features) {
	var placemarks = '<!-- PLACEMARKS -->';
	for (var i in features){
		let prop = features[i].properties;
		let geom = features[i].geometry;
		placemarks = placemarks + '<Placemark>'+
									'<name>'+(prop.CLAVE1K ? prop.CLAVE1K : (prop.CLAVE50K ? prop.CLAVE50K : prop[Object.keys(prop)[0]]))+'</name>'+
									'<styleUrl>#estiloMapa</styleUrl>'+
									'<ExtendedData>'+
									'<SchemaData schemaUrl="#Data">';
		for (var p in prop){
			placemarks = placemarks +'<SimpleData name="'+p+'">'+prop[p]+'</SimpleData>'
		}
		placemarks = placemarks + '</SchemaData>'+
									'</ExtendedData>';
		var coord = geom.coordinates;
		//console.log(coord.length);
		//alert(geom.type)
		switch (geom.type) {
			case "Polygon":
				placemarks = placemarks + '<MultiGeometry>'+
										'<Polygon>'+
										'<outerBoundaryIs>'+
										'<LinearRing>'+
										'<coordinates>\n';
				for (var c in coord[0]){
		    		placemarks = placemarks + coord[0][c][0].toString()+','+coord[0][c][1].toString()+',0 \n'
		    	}
		    	placemarks = placemarks + '</coordinates>'+
											'</LinearRing>'+
											'</outerBoundaryIs>'+
											'</Polygon>'+
											'</MultiGeometry>';
				break;
			case "MultiPolygon":
				placemarks = placemarks + '<MultiGeometry>'+
										'<Polygon>'+
										'<outerBoundaryIs>'+
										'<LinearRing>'+
										'<coordinates>\n';
				for (var c in coord[0]){
					for (var i in coord[0][c]){
		    			placemarks = placemarks + coord[0][c][i][0].toString()+','+coord[0][c][i][1].toString()+',0 \n'

					}
		    	}
		    	placemarks = placemarks + '</coordinates>'+
											'</LinearRing>'+
											'</outerBoundaryIs>'+
											'</Polygon>'+
											'</MultiGeometry>';
				break;
		}
		placemarks = placemarks + '</Placemark>';	
	}
	return placemarks;
}
function footerkml() {
	return '</Document>'+
			'</kml>';
}
function constructorKML(name, geojson, urlimg){
	var features = geojson.features;
	var kml = headerkml(name) + 
				schemakml(features[0]) + 
				stylekml(features[0], true, urlimg) + 
				placemarkskml(features) + 
				footerkml();
	return kml;
}
