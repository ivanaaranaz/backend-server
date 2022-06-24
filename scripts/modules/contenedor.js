module.exports = class Contenedor {
    static #fs = require('fs');
    static #idObjeto = 0;
    #file;

    //constructor que recibe el nombre del archivo
    constructor(file) {
        this.#file = file;
    }

    //save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
    async save(object) {
        if (object != undefined) {
            try {
                const datosArchivo = await this.getAll();
                if (datosArchivo.length > 0) {//si el array no esta vacio
                    Contenedor.#idObjeto = datosArchivo.reduce((acum, proximo) => acum > proximo.id ? acum : proximo.id, 0);
                }
                Contenedor.#idObjeto++;//le asigno el id mas alto mas 1
                object.id = Contenedor.#idObjeto;
                datosArchivo.push(object); //agrego el objeto al array

                await Contenedor.#fs.promises.writeFile(this.#file, JSON.stringify(datosArchivo), "utf-8");//vuelvo a guardar el array en el archivo
                return Promise.resolve(object.id);
            }
            catch (error) {
                //throw Error(`Error en el método "save 22222": ${error.message}`);
                throw Error(`error en el metodo save ${error.message}`);
            }
        } else {
            Promise.reject(new Error(`No se recibio el objeto correspondiente`));
        }
    }

    //getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo
    async getAll() {
        try {
            //si el archivo no existe lo creo vacio
            if (!Contenedor.#fs.existsSync(this.#file)) {
                await Contenedor.#fs.promises.writeFile(this.#file, "", "utf-8");
            }
            //leo el archivo y lo asigno a una variable
            const contenido = await Contenedor.#fs.promises.readFile(this.#file, "utf-8");
            return Promise.resolve(contenido.length > 0 ? JSON.parse(contenido) : []);
        }
        //throw Error(`Error en el método "getAll": ${error.message}`);
        catch (error) {
            throw Error(`error en el metodo getAll ${error.message}`);
        }
    }
    //getById(Number): Object - Recibe un id y devuelve el objeto con ese id.
    async getById(id) {
        try {
            if (id !== undefined && typeof (id) === "number") {//valido el valor ingresado
                const datosArchivo = await this.getAll();//obtengo todo el array de objetos del archivo
                const obj = datosArchivo.find(element => element.id === id);
                return obj === undefined ? Promise.reject(Error("El ID buscado no existe")) : Promise.resolve(obj);//busco y obtengo el objeto con el id ingresado
            } else {
                //throw Error(`Error en el método "getById": El id ingresado es inválido`);
                throw Error("Tipo de ID invalido");
            }
        }
        catch (error) {
            //throw Error(`Error en el método "getById": ${error.message}`);
            throw Error(`error en el metodo getById ${error.message}`);
        }
    }

    //deleteById(Number): void - Elimina del archivo el objeto con el id buscado.
    async deleteById(id) {
        try {
            if (id !== undefined && typeof (id) === "number") {//valido el valor ingresado
                const datosArchivo = await this.getAll();//obtengo todo el array de objetos del archivo
                let indice = datosArchivo.findIndex(element => element.id === id);//busco y obtengo el indice del objeto con el id ingresado
                if (indice > -1) {
                    datosArchivo.splice(indice, 1);//reemplaza(1) por vacio (3er parametro), la posicion del index, o sea elimina objeto
                    await Contenedor.#fs.promises.writeFile(this.#file, JSON.stringify(datosArchivo), "utf-8"); //vuelve a guardar en el archivo el array modificado
                }
                else {//no se encuentra en el archivo el id que se busca
                    return Promise.reject(Error("Sin conincidencia para la eliminacion del producto"));
                }
            } else {
                 //throw Error(`Error en el método "deleteById": El id ingresado es inválido`);
                throw Error("Tipo de ID invalido");
            }
        }
        catch (error) {
             //throw Error(`Error en el método "deleteById": ${error.message}`);
            throw Error(`error en el metodo deleteById ${error.message}`);
        }

    }
    //deleteAll(): void - Elimina todos los objetos presentes en el archivo.
    async deleteAll() {
        try {

            await Contenedor.#fs.promises.writeFile(this.#file, "", "utf-8");//reemplazo el contenido del archivo por un vacio = eliminar todo lo que habia 
        }
        catch (error) {
            //throw Error(`Error en el método "deleteAll": ${error.message}`);
            throw Error(`error en el metodo deleteAll ${error.message}`);
        }
    }
}