const fs = require('fs');

const axios = require('axios');
 

class Busquedas{

    Historial = [ ]
    dbPath = './db/database.json'

    constructor(){
       this.leerBD();
    }

    get historialCapitalizado(){
        return this.Historial.map( lugar =>{
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
            
            return palabras.join(' ');
        });
    }

    get paramsMapBox( ) {
        return {
            'access_token' : process.env.MAPBOX_KEY,
            'limit' : 5,
            'language' : 'es'
        }
    }

    get paramsWeather() {
        return {
            'appid' : process.env.OPENWEATHER_KEY,            
            'units' : 'metric',
            'lang' : 'es'
        }
    }

    async ciudad ( Lugar = "" ){
        try{
            //Peticion HTTP
            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ Lugar }.json`,
                params: this.paramsMapBox  
            });

            const resp = await intance.get();

            //Devolver lugares que se encontro en la busqueda
            // Los parentesis en el map es para de forma implicita decir que voy a retornar un objeto 
            return resp.data.features.map( lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                longitud: lugar.center[0],
                latitud: lugar.center[1]
            }))
        }
        catch (error){
            console.error(error)
        }

    }

    async Clima( lat,lon ){

        try {
            const intance = axios.create({
                baseURL : `http://api.openweathermap.org/data/2.5/weather`,
                params : {...this.paramsWeather, 
                            'lat' : lat,
                            'lon' : lon }
            });

            const resp = await intance.get();
            const { weather, main } = resp.data;

            return {
                temp: main.temp,
                temp_max: main.temp_max,
                temp_min: main.temp_min,
                desc: weather[0].description
            };


        } catch (error) {
            console.error(error)
        }
    }

    agregarHistorial ( lugar = '' ){

        if ( this.Historial.includes( lugar.toLocaleLowerCase() )){
            return;
        }
        //Splice elimina los elementos que indique
        this.Historial = this.Historial.splice(0,5);

        this.Historial.unshift( lugar.toLocaleLowerCase() );
        this.guardarBD();
    }

    guardarBD(){

        const payload = {
            historial: this.Historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    }

    leerBD(){

        if ( !fs.existsSync( this.dbPath )) return null;
        
    
        // PARA LEER EL ARCHIVO Y QUE NO LO TRAIGA EN BYTE.
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } );
        const { historial } = JSON.parse( info );
        this.Historial = historial;
    } 

}

module.exports = Busquedas;