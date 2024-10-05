import express from "express";
import { getOrderDetail, getOrders, addOrderItems, deleteOrderItem } from './orders.service'
import {validate} from "../../middleware/validation.middleware"
import {pagingRequestSchema, idUUIDRequestSchema, orderItemsDTORequestSchema, idItemIdUUIDRequestSchema} from "../types"
export const ordersRouter = express.Router();

ordersRouter.get('/', validate(pagingRequestSchema), async(req,res) => {
    const data = pagingRequestSchema.parse(req);
    const orders = await getOrders(data.query.skip, data.query.take)
    res.json(orders)
});


ordersRouter.get('/:id', validate(idUUIDRequestSchema),async(req, res) => {
    const data = idUUIDRequestSchema.parse(req)
    const order = await getOrderDetail(data.params.id);
    res.json(order)
})

ordersRouter.post('/:id/items', validate(orderItemsDTORequestSchema), async(req, res) =>{
    const data = orderItemsDTORequestSchema.parse(req)
    const order = await addOrderItems(data.params.id, data.body)

    if (order != null ){
        res.status(201).json(order)
    }else {
        res.status(500).json({message: "Additional Failed"})
    }
})

//order id and item id that we want to delete 
ordersRouter.delete("/:id/items/:itemId", validate(idItemIdUUIDRequestSchema), async(req, res) => {
    const data = idItemIdUUIDRequestSchema.parse(req)
    const order = await deleteOrderItem(data.params.id, data.params.itemId)

    if (order != null){
        res.json(order)
    } else {
        res.status(400).json({message: "Can't delete"})
    }
})



