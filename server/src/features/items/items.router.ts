import express from "express";
import { getItems, getItemDetail, upsertItem, deleteItem } from "./items.service";
import { itemPOSTRequestSchema , idNumberRequestSchema, itemPUTRequestSchema} from "../types"
import { validate } from "../../middleware/validation.middleware"
export const itemsRouter = express.Router();


itemsRouter.get('/', async (req,res) => {
  const items = await getItems();
  items.forEach((item) => {
    item.imageUrl = buildImageUrl(req,item.id)
  })
  return res.json(items)
})


itemsRouter.get('/:id', async (req,res) => {
  const id = parseInt(req.params.id);
  const itemDetial = await getItemDetail(id)
  if (itemDetial != null){
    itemDetial.imageUrl = buildImageUrl(req,id)
    res.json(itemDetial)
  } else {
    res.send(404).json({message: "Item Not Found"})
  }
})


itemsRouter.post('/', validate(itemPOSTRequestSchema), async(req, res) => {
  const data = itemPOSTRequestSchema.parse(req)
  const item = await upsertItem(data.body)
  console.log("item ", item)

  if (item != null) {
    res.status(2001).json(item)
  } else {
    res.status(500).json({message: "Creation failed"})
  }
})

itemsRouter.delete('/:id', validate(idNumberRequestSchema), async(req, res) =>{
  const data = idNumberRequestSchema.parse(req)
  const item = await deleteItem(data.params.id)

  if (item != null) {
    res.json(item)
  } else{
    res.status(400).json({message: "Item Not Found"})
  }

})

itemsRouter.put("/", validate(itemPUTRequestSchema), async(req,res) => {
  const data = itemPUTRequestSchema.parse(req)
  const item = await upsertItem(data.body, data.params.id)

  if (item != null ){
    res.json(item)
  }else {
    res.status(404).json(({message: "Item Not Found"}))
  }
})


// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
function buildImageUrl(req: any, id: number): string {
  return `${req.protocol}://${req.get("host")}/images/${id}.jpg`;
}
