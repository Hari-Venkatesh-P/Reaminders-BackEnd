const router = require('express').Router()
// const MiddlewareService = require('../Middleware/Tokencheck')

const RemainderService = require('../Services/RemainderService')

router.post("/",RemainderService.addRemainder)
router.get("/:userId",RemainderService.getRemaindersByUserId)
router.put("/",RemainderService.updateRemainder)
router.delete("/",RemainderService.deleteRemainder)

 
module.exports = router;