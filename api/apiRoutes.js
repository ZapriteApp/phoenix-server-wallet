const express = require('express');
const router = express.Router();
const apService = require('./apiService');

router.get('/get-balance', async (req, res) => {
    try  {
        const data = await apService.getBalance();
        res.json(data);
    }
    catch(error) {
        res.status(500).json({ message: 'Error retreving data'});
    }
})

router.post('/pay-invoice', async(req, res) => {
    const { amountSat, invoice } = req.body;
    try {
        const data = await apService.payInvoice(amountSat, invoice);
        res.json(data);
    }catch(error) {
        res.status(500).json({message: 'Error paying invoice'});
    }
})

module.exports = router;