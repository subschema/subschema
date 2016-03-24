"use strict";

import {validators, ValueManager, loaderFactory} from "Subschema";
import validateFactory from "./validateFactory";

const loader = loaderFactory();
loader.addValidator(validators);


module.exports = {
    loader,
    loaderFactory,
    validators,
    ValueManager,
    validateFactory
};
