import { useState } from "react";
import ContextConfirm from "./context";

function ProviderConfirm( {children} ){
    const confirm = useState("");
    return (
        <ContextConfirm.Provider value = {confirm}>
            {children}
        </ContextConfirm.Provider>
    )
}

export default ProviderConfirm