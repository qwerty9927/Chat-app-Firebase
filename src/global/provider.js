import { useState } from "react";
import Context from "./context";

function Provider( {children} ){
    const arrGlobal = useState("");
    return (
        <Context.Provider value = {arrGlobal}>
            {children}
        </Context.Provider>
    )
}

export default Provider