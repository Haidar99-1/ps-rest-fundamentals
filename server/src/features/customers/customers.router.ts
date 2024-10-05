import express from "express";
import { getCustomers, getCustomerDetail, searchCustomers, upsertCustomer, deleteCustomer} from './customers.service'
import { getOrdersForCustomer } from '../orders/orders.service'
import { validate } from "../../middleware/validation.middleware";
import {idUUIDRequestSchema , searchRequestSchema, customerPOSTRequestSchema, idStringRequestSchema} from "../types"
export const customersRouter = express.Router();


customersRouter.get('/', async(req,res) => {
    const customers = await getCustomers()
    res.json(customers)
})

customersRouter.get('/:id', validate(idUUIDRequestSchema), async(req,res) => {
    const data = idUUIDRequestSchema.parse(req)
    const customersDetail = await getCustomerDetail(data.params.id)
    if (customersDetail != null) {
        res.json(customersDetail)
    }else{
        res.status(404).json({message: "Customer Not Found"})
    }
})


customersRouter.get('/:id/orders',validate(idUUIDRequestSchema) ,async(req,res) => {
    const data = idUUIDRequestSchema.parse(req)
    const orders = await getOrdersForCustomer(data.params.id);
    res.json(orders)
})

customersRouter.get('/search/:query', validate(searchRequestSchema), async(req,res) => {
    const data = searchRequestSchema.parse(req)
    const customers =  await searchCustomers(data.params.query)
    res.json(customers)
})


customersRouter.post('/', validate(customerPOSTRequestSchema), async(req, res) => {
    const data = customerPOSTRequestSchema.parse(req)
    const customer = await upsertCustomer(data.body)

    if (customer != null) {
        res.status(201).json(customer)
    } else {
        res.status(500).json({message: "Creation Failed"})
    }

})


customersRouter.delete('/:id', validate(idStringRequestSchema), async(req,res) => {
    const data = idStringRequestSchema.parse(req)
    const customer = await deleteCustomer(data.params.id)

    if (customer != null){
        res.json(customer)
    } else  {
        res.status(400).json({message: "Item Not Found"})
    }
})