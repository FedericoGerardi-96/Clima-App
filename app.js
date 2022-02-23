//Para guardar en process.env mis variables globales en el .env
require('dotenv').config();
const { leerInput, 
        inquirerMenu,
        Pausa,
        listadoLugares } = require("./helpers/Inquirer");
const Busquedas = require("./models/busquedas");
require('colors');

const main = async() =>{

    const busquedas = new Busquedas();
    let opt = 0;
    busquedas.leerBD();
    
     do{

        opt = await inquirerMenu();

        switch ( opt ) {
            case 1:         
                //Mostrar mensaje para buscar
                const Ubicacion = await leerInput('Ciudad: ');
                //Buscar los lugares
                const lugares = await busquedas.ciudad( Ubicacion );
                //Seleccionar un lugar
                const id = await listadoLugares( lugares );    

                if( id.id === '0' ) continue;
                
                const lugarSeleccionado = lugares.find( l => l.id === id.id )
                
                busquedas.agregarHistorial( lugarSeleccionado.nombre );

                //Clima
                const datoclima = await busquedas.Clima(lugarSeleccionado.latitud, lugarSeleccionado.longitud);
                //Mostrar Resultados
                console.log("\nInformacion de la ciudad: \n".green);
                console.log("Ciudad: ", lugarSeleccionado.nombre);
                console.log("Latitud: ", lugarSeleccionado.latitud);
                console.log("Longitud: ", lugarSeleccionado.longitud);
                console.log("Temperatura: ", datoclima.temp, "°C");
                console.log("Maxima: ", datoclima.temp_max, "°C");
                console.log("Minima: ", datoclima.temp_min, "°C");
                console.log("Descripcion del Clima: ", datoclima.desc);

                break;
        
            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ (i + 1 + '.')}`.green; 
                    console.log(`${ idx } ${ lugar }`);
                })
                break;
            case 0:
                break;
        }

        await Pausa();
        
     }while( opt !== 0);
    

}

main();
