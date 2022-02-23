const inquirer = require('inquirer');
require('colors');

const inquirerMenu = async() =>{

    const Preguntas = [
        {
            type: 'list',
            name: 'opcion',
            message: 'Que desea hacer ?',
            choices: [
                {
                    value: 1,
                    name: `${ '1.'.green } Buscar Ciudad`
                },
                {
                    value: 2,
                    name: `${ '2.'.green } Historial`
                },
                {
                    value: 0,
                    name: `${ '0.'.green } Salir`
                }
            ]
        }
    ]; 
    
    console.clear();
    console.log("=====================================".blue);
    console.log("------- Seleccione una opcion -------".white);    
    console.log("=====================================".blue);

    const { opcion }  = await inquirer.prompt(Preguntas)
    return opcion;
}

const Pausa = async() =>{

    const PreguntaPausa = [
        {
            type: 'input',
            name: 'pausa',
            message: `\n\nPrecione ${ 'ENTER'.blue } para continuar`,
        }
    ]
    await inquirer.prompt(PreguntaPausa)
}

const leerInput = async( mensaje) =>{
    const Pregunta = [
        {
            type: 'input',
            name: 'desc',
            message: mensaje,
            validate (value){
                if (value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(Pregunta);
    return desc;
}

const listadoLugares = async ( Lugares = [] ) => {

    const choices = Lugares.map( (Lugares, i) => {

        const idx = `${ (i + 1 + '.')}`.green;

        return{
            value: Lugares.id,
            name: `${ idx } ${ Lugares.nombre }`
        }
    });    

    choices.unshift({
        value: '0',
        name: '0.'.green + ' Cancelar'
    })

    const preguntas =[
        {
        type: 'list',
        name: 'id',
        message: 'Seleccione lugar: ',
        choices
    }]

    const id  = await inquirer.prompt(preguntas);

    return id;
}

const mostrarListadoCheckList = async ( tareas = [] ) => {

    const choices = tareas.map( (tarea, i) => {

        const idx = `${ (i + 1 + '.')}`.green;

        return{
            value: tarea.id,
            name: `${ idx } ${ tarea.desc }`,
            checked: ( tarea.completadoEn ) ? true : false 
        }
    });

    const pregunta =[
        {
        type: 'checkbox',
        name: 'ids',
        message: 'Selecciones',
        choices
    }]

    const id  = await inquirer.prompt(pregunta);

    return id;
}

const confirmar = async(mensaje) => {

    const pregunta = [
        {
            type: 'confirm',
            name: 'ok',
            message: mensaje
        }
    ]


    const { ok }  = await inquirer.prompt(pregunta);
    return ok;
}

module.exports = {
    inquirerMenu,
    Pausa,
    leerInput,
    listadoLugares,
    confirmar,
    mostrarListadoCheckList
};
