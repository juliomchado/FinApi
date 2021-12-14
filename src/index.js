const { response } = require('express');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

/** 
 * cpf - string
 * name - string
 * id - uuid
 * statement []
 */

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
    const { cpf } = req.headers;

    const customer = customers
        .find((customer) => customer.cpf === cpf);

    if (!customer) {
        return res.status(400).json({ error: "Customer does not exists" });
    }

    req.customer = customer;

    return next();

}

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

    if (customerAlreadyExists) {
        return res.status(400).json({ error: "Customer already exists." });
    }

    customers.push({
        id: uuidv4(),
        cpf,
        name,
        statement: []
    });

    return res.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {

    const { customer } = req;

    return res.status(200).json(customer.statement);

});


app.listen(3333, () => {
    console.log('Server running !');
});