/*! geolib 1.2.8 by Manuel Bieh
* A small library to provide some basic geo functions like distance calculation,
* conversion of decimal coordinates to sexagesimal and vice versa, etc.
* WGS 84 (World Geodetic System 1984)
* 
* @author Manuel Bieh
* @url http://www.manuelbieh.com/
* @version 1.2.8
* @license LGPL 
**/
(function(e,t){var n=6378137,r=/^([0-9]{1,3})°\s*([0-9]{1,3})'\s*(([0-9]{1,3}(\.([0-9]{1,2}))?)"\s*)?([NEOSW]?)$/,i={decimal:{},sexagesimal:{},distance:0,measures:{m:1,km:.001,cm:100,mm:1e3,mi:1/1609.344,sm:1/1852.216,ft:100/30.48,"in":100/2.54,yd:1/.9144},getKeys:function(e){var t=e.hasOwnProperty("lat")?"lat":"latitude",n=(e.hasOwnProperty("lng")?"lng":!1)||(e.hasOwnProperty("long")?"long":!1)||"longitude",r=(e.hasOwnProperty("alt")?"alt":!1)||(e.hasOwnProperty("altitude")?"altitude":!1)||(e.hasOwnProperty("elev")?"elev":!1)||"elevation";return{latitude:t,longitude:n,elevation:r}},getDistance:function(e,t,n){var r=i.getKeys(e),s=r.latitude,o=r.longitude,u=r.elevation;n=Math.floor(n)||1;var a={},f={};a[s]=i.useDecimal(e[s]),a[o]=i.useDecimal(e[o]),f[s]=i.useDecimal(t[s]),f[o]=i.useDecimal(t[o]);var l=6378137,c=6356752.314245,h=1/298.257223563,p=(f[o]-a[o]).toRad(),d,v,m,g,y,b,w=Math.atan((1-h)*Math.tan(parseFloat(a[s]).toRad())),E=Math.atan((1-h)*Math.tan(parseFloat(f[s]).toRad())),S=Math.sin(w),x=Math.cos(w),T=Math.sin(E),N=Math.cos(E),C=p,k,L=100;do{var A=Math.sin(C),O=Math.cos(C);b=Math.sqrt(N*A*N*A+(x*T-S*N*O)*(x*T-S*N*O));if(b===0)return i.distance=0;d=S*T+x*N*O,v=Math.atan2(b,d),m=x*N*A/b,g=1-m*m,y=d-2*S*T/g,isNaN(y)&&(y=0);var M=h/16*g*(4+h*(4-3*g));k=C,C=p+(1-M)*h*m*(v+M*b*(y+M*d*(-1+2*y*y)))}while(Math.abs(C-k)>1e-12&&--L>0);if(L===0)return NaN;var _=g*(l*l-c*c)/(c*c),D=1+_/16384*(4096+_*(-768+_*(320-175*_))),P=_/1024*(256+_*(-128+_*(74-47*_))),H=P*b*(y+P/4*(d*(-1+2*y*y)-P/6*y*(-3+4*b*b)*(-3+4*y*y))),B=c*D*(v-H);B=B.toFixed(3);if(e.hasOwnProperty(u)&&t.hasOwnProperty(u)){var j=Math.abs(e[u]-t[u]);B=Math.sqrt(B*B+j*j)}return i.distance=Math.floor(Math.round(B/n)*n)},getDistanceSimple:function(e,t,r){var s=i.getKeys(e),o=s.latitude,u=s.longitude;r=Math.floor(r)||1;var a={},f={};a[o]=parseFloat(i.useDecimal(e[o])).toRad(),a[u]=parseFloat(i.useDecimal(e[u])).toRad(),f[o]=parseFloat(i.useDecimal(t[o])).toRad(),f[u]=parseFloat(i.useDecimal(t[u])).toRad();var l=Math.round(Math.acos(Math.sin(f[o])*Math.sin(a[o])+Math.cos(f[o])*Math.cos(a[o])*Math.cos(a[u]-f[u]))*n);return i.distance=Math.floor(Math.round(l/r)*r)},getCenter:function(e){if(!e.length)return!1;var t=i.getKeys(e[0]),n=t.latitude,r=t.longitude,s=function(e){return Math.max.apply(Math,e)},o=function(e){return Math.min.apply(Math,e)},u,a,f={lat:[],lng:[]};for(var l in e)f.lat.push(i.useDecimal(e[l][n])),f.lng.push(i.useDecimal(e[l][r]));var c=o(f.lat),h=o(f.lng),p=s(f.lat),d=s(f.lng);u=((c+p)/2).toFixed(6),a=((h+d)/2).toFixed(6);var v=i.convertUnit("km",i.getDistance({lat:c,lng:h},{lat:p,lng:d}));return{latitude:u,longitude:a,distance:v}},getBounds:function(e){if(!e.length)return!1;var t=i.getKeys(e[0]),n=t.latitude,r=t.longitude,s=t.elevation,o=e[0].hasOwnProperty(s),u={maxLat:0,minLat:Infinity,maxLng:0,minLng:Infinity};o&&(u.maxElev=0,u.minElev=Infinity);for(var a=0,f=e.length;a<f;++a)u.maxLat=Math.max(e[a][n],u.maxLat),u.minLat=Math.min(e[a][n],u.minLat),u.maxLng=Math.max(e[a][r],u.maxLng),u.minLng=Math.min(e[a][r],u.minLng),o&&(u.maxElev=Math.max(e[a][s],u.maxElev),u.minElev=Math.min(e[a][s],u.minElev));return u},isPointInside:function(e,t){var n=i.getKeys(e),r=n.latitude,s=n.longitude;for(var o=!1,u=-1,a=t.length,f=a-1;++u<a;f=u)(t[u][s]<=e[s]&&e[s]<t[f][s]||t[f][s]<=e[s]&&e[s]<t[u][s])&&e[r]<(t[f][r]-t[u][r])*(e[s]-t[u][s])/(t[f][s]-t[u][s])+t[u][r]&&(o=!o);return o},isInside:function(){return i.isPointInside.apply(i,arguments)},isPointInCircle:function(e,t,n){return i.getDistance(e,t)<n},withinRadius:function(){return i.isPointInCircle.apply(i,arguments)},getRhumbLineBearing:function(e,t){var n=i.getKeys(e),r=n.latitude,s=n.longitude,o=i.useDecimal(t[s]).toRad()-i.useDecimal(e[s]).toRad(),u=Math.log(Math.tan(i.useDecimal(t[r]).toRad()/2+Math.PI/4)/Math.tan(i.useDecimal(e[r]).toRad()/2+Math.PI/4));return Math.abs(o)>Math.PI&&(o>0?o=(2*Math.PI-o)*-1:o=2*Math.PI+o),(Math.atan2(o,u).toDeg()+360)%360},getBearing:function(e,t){var n=i.getKeys(e),r=n.latitude,s=n.longitude;t[r]=i.useDecimal(t[r]),t[s]=i.useDecimal(t[s]),e[r]=i.useDecimal(e[r]),e[s]=i.useDecimal(e[s]);var o=(Math.atan2(Math.sin(t[s].toRad()-e[s].toRad())*Math.cos(t[r].toRad()),Math.cos(e[r].toRad())*Math.sin(t[r].toRad())-Math.sin(e[r].toRad())*Math.cos(t[r].toRad())*Math.cos(t[s].toRad()-e[s].toRad())).toDeg()+360)%360;return o},getCompassDirection:function(e,t,n){var r,s;n=="circle"?s=i.getBearing(e,t):s=i.getRhumbLineBearing(e,t);switch(Math.round(s/22.5)){case 1:r={exact:"NNE",rough:"N"};break;case 2:r={exact:"NE",rough:"N"};break;case 3:r={exact:"ENE",rough:"E"};break;case 4:r={exact:"E",rough:"E"};break;case 5:r={exact:"ESE",rough:"E"};break;case 6:r={exact:"SE",rough:"E"};break;case 7:r={exact:"SSE",rough:"S"};break;case 8:r={exact:"S",rough:"S"};break;case 9:r={exact:"SSW",rough:"S"};break;case 10:r={exact:"SW",rough:"S"};break;case 11:r={exact:"WSW",rough:"W"};break;case 12:r={exact:"W",rough:"W"};break;case 13:r={exact:"WNW",rough:"W"};break;case 14:r={exact:"NW",rough:"W"};break;case 15:r={exact:"NNW",rough:"N"};break;default:r={exact:"N",rough:"N"}}return r},orderByDistance:function(e,t){var n=i.getKeys(e),r=n.latitude,s=n.longitude,o=[];for(var u in t){var a=i.getDistance(e,t[u]);o.push({key:u,latitude:t[u][r],longitude:t[u][s],distance:a})}return o.sort(function(e,t){return e.distance-t.distance})},findNearest:function(e,t,n){n=n||0;var r=i.orderByDistance(e,t);return r[n]},getPathLength:function(e){var t=0,n;for(var r=0,s=e.length;r<s;++r)n&&(t+=i.getDistance(e[r],n)),n=e[r];return t},getSpeed:function(e,t,n){var r=n&&n.unit||"km";r=="mph"?r="mi":r=="kmh"&&(r="km");var s=i.getDistance(e,t),o=t.time*1/1e3-e.time*1/1e3,u=s/o*3600,a=Math.round(u*i.measures[r]*1e4)/1e4;return a},convertUnit:function(e,t,n){if(t===0||typeof t=="undefined"){if(i.distance===0)return 0;t=i.distance}e=e||"m",n=null==n?4:n;if(typeof i.measures[e]!="undefined")return i.round(t*i.measures[e],n);throw new Error("Unknown unit for conversion.")},useDecimal:function(e){e=e.toString().replace(/\s*/,"");if(!isNaN(parseFloat(e))&&parseFloat(e).toString()==e)return parseFloat(e);if(i.isSexagesimal(e)===!0)return parseFloat(i.sexagesimal2decimal(e));throw"Unknown format."},decimal2sexagesimal:function(e){if(e in i.sexagesimal)return i.sexagesimal[e];var t=e.toString().split("."),n=Math.abs(t[0]),r=("0."+t[1])*60,s=r.toString().split(".");return r=Math.floor(r),s=(("0."+s[1])*60).toFixed(2),i.sexagesimal[e]=n+"° "+r+"' "+s+'"',i.sexagesimal[e]},sexagesimal2decimal:function(e){if(e in i.decimal)return i.decimal[e];var t=new RegExp(r),n=t.exec(e),s=0,o=0;n&&(s=parseFloat(n[2]/60),o=parseFloat(n[4]/3600)||0);var u=(parseFloat(n[1])+s+o).toFixed(8);return u=n[7]=="S"||n[7]=="W"?u*-1:u,i.decimal[e]=u,u},isSexagesimal:function(e){return r.test(e)},round:function(e,t){var n=Math.pow(10,t);return Math.round(e*n)/n}};typeof Number.prototype.toRad=="undefined"&&(Number.prototype.toRad=function(){return this*Math.PI/180}),typeof Number.prototype.toDeg=="undefined"&&(Number.prototype.toDeg=function(){return this*180/Math.PI}),e.geolib=i,typeof module!="undefined"&&(module.exports=i)})(this),function(e){var t=e.geolib;t.getElevation=function(){typeof window.navigator!="undefined"?t.getElevationClient.apply(this,arguments):t.getElevationServer.apply(this,arguments)},t.getElevationClient=function(e,n){if(!window.google)throw new Error("Google maps api not loaded");if(e.length===0)return n(null,null);if(e.length===1)return n(new Error("getElevation requires at least 2 points."));var r=[],i=t.getKeys(e[0]),s=i.latitude,o=i.longitude;for(var u=0;u<e.length;u++)r.push(new google.maps.LatLng(t.useDecimal(e[u][s]),t.useDecimal(e[u][o])));var a={path:r,samples:r.length},f=new google.maps.ElevationService;f.getElevationAlongPath(a,function(r,s){t.elevationHandler(r,s,e,i,n)})},t.getElevationServer=function(e,n){if(e.length===0)return n(null,null);if(e.length===1)return n(new Error("getElevation requires at least 2 points."));var r=require("googlemaps"),i=[],s=t.getKeys(e[0]),o=s.latitude,u=s.longitude;for(var a=0;a<e.length;a++)i.push(t.useDecimal(e[a][o])+","+t.useDecimal(e[a][u]));r.elevationFromPath(i.join("|"),i.length,function(r,i){t.elevationHandler(i.results,i.status,e,s,n)})},t.elevationHandler=function(e,t,n,r,i){var s=[],o=r.latitude,u=r.longitude;if(t=="OK"){for(var a=0;a<e.length;a++)s.push({lat:n[a][o],lng:n[a][u],elev:e[a].elevation});i(null,s)}else i(new Error("Could not get elevation using Google's API"),elevationResult.status)},t.getGrade=function(e){var n=t.getKeys(e[0]),r=n.elevation,i=Math.abs(e[e.length-1][r]-e[0][r]),s=t.getPathLength(e);return Math.floor(i/s*100)},t.getTotalElevationGainAndLoss=function(e){var n=t.getKeys(e[0]),r=n.elevation,i=0,s=0;for(var o=0;o<e.length-1;o++){var u=e[o][r]-e[o+1][r];u>0?s+=u:i+=Math.abs(u)}return{gain:i,loss:s}}}(this);
