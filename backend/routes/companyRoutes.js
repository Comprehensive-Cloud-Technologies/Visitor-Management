import express from "express";

import {

getCompanies,

getCompanyById,

createCompany,

updateCompany,

deleteCompany


}
from "../controllers/companyController.js";

const router =
express.Router();

/* GET ALL COMPANIES */

router.get(
"/",
getCompanies
);

/* GET COMPANY BY ID */

router.get(
"/:id",
getCompanyById
);

/* CREATE COMPANY */

router.post(
"/",
createCompany
);

/* UPDATE COMPANY */

router.put(
"/:id",
updateCompany
);

/* DELETE COMPANY */

router.delete(
"/:id",
deleteCompany
);

export default router;
