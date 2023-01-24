"use strict";

/**
 * Declaracion de dependencias
 */
require('dotenv').config();

async function Main() {

    const PORT = process.env.PORT || 3500;
    const api = require("./server/api");
    const app = await api.buildApi();
    
    app.listen(PORT, () => console.log(`Escuchando en puerto ${PORT}`));

}

Main();