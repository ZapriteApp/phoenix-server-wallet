import express from 'express';
import * as apiService from './apiService.js';
import * as utils from '../utils/utils.js'
import db from '../utils/db.js'
import bcrypt from 'bcrypt'
import path from 'path'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const httpPassword = process.env.HTTP_PASSWORD;

router.get('/getbalance', async (req, res) => {
    try {
        const data = await apiService.getBalance();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retreving balance' });
    }
});

router.post('/payinvoice', async (req, res) => {
    const { amountSat, invoice } = req.body;
    try {
        const data = await apiService.payInvoice(amountSat, invoice);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error paying invoice' });
    }
});

router.get('/getinfo', async (req, res) => {
    try {
        const data = await apiService.getNodeInfo();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error paying getting node information' });
    }
});

router.post('/createinvoice', async (req, res) => {
    const { description, amountSat, externalId, webhookUrl } = req.body;
    try {
        const data = await apiService.createInvoice(description, amountSat, externalId, webhookUrl);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error paying invoice' });
    }
});

router.get('/outgoingpayments', async (req, res) => {
    const { from, to, limit, offset, all } = req.body;
    try {
        const data = await apiService.getOutgoingPayments(from, to, limit, offset, all);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments' });
    }
});

router.get('/incomingpayments', async (req, res) => {
    const { from, to, limit, offset, all } = req.body;
    try {
        const data = await apiService.getIncomingPayments(from, to, limit, offset, all);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching payments' });
    }
});

router.post('/payoffer', async (req, res) => {
    const { amountSat, offer, message } = req.body;
    try {
        const data = await apiService.payOffer(amountSat, offer, message);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error paying offer' });
    }
});

router.post('/paylnaddress', async (req, res) => {
    const { amountSat, lnAddress, message } = req.body;
    try {
        const data = await apiService.payLnAddress(amountSat, lnAddress, message);
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error paying LN address' });
    }
});


router.get('/getoffer', async (req, res) => {
    try {
        const data = await apiService.getOffer();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retreving offer' });
    }
});

router.get('/listincomingandoutgoing', async (req, res) => {
    try {
        const data = await apiService.listIncomingAndOutgoing();
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retreving transactions' });
    }
});

router.post('/decodeoffer', async (req, res) => {
    const { offer } = req.body;
    try {
        const data = await apiService.decodeOffer(offer);
        res.json(data);
    }
    catch (error) {
        if (error.res && error.res.status === 400) {
            res.json({ message: 'Invalid offer data. Please check and try again.' });
        } else {
            res.status(500).json({ message: 'An error occurred while decoding the offer.' });
        }

    }
});

router.post('/decodeinvoice', async (req, res) => {
    const { invoice } = req.body;
    try {
        const data = await apiService.decodeInvoice(invoice);
        res.json(data);
    }
    catch (error) {
        res.status(500).json({ message: 'Error decoding invoice' });
    }
});

router.post('/savecontact', async (req, res) => {
    const { name, offer, address } = req.body;
    const newContactsId = utils.getId();
    try {
        db.data.contacts.push({ id: newContactsId, name: name, offer: offer, address: address, dateAdded: Date.now() })
        await db.write()
        res.json({ message: "Contact saved successfully" });
    }
    catch (error) {
        res.status(500).json({ "message": error });
    }
});

router.get('/getcontacts', async (req, res) => {
    try {
        const { contacts } = db.data
        res.json({ contacts });
    }
    catch (error) {
        res.status(500).json({ "message": error });
    }
});


router.post('/savepassword', async (req, res) => {
    const { password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (db.data.password.length === 0) {
            db.data.password.push({ password: hashedPassword, timeStamp: Date.now() });
        } else {
            db.data.password[0].password = hashedPassword;
            db.data.password[0].timeStamp = Date.now();
        }
        await db.write()
        res.json({ message: "Password saved successfully" });
    }
    catch (error) {
        res.status(500).json({ "message": error });
    }
});

router.post('/ispasswordset', async (req, res) => {
    try {
        const storedPassword = db.data?.password?.[0]?.password;
        if (storedPassword) {
            return res.json({ success: true, message: 'Password' });
        } else {
            return res.json({ success: false, message: 'Password is not set' });
        }

    } catch (error) {
        console.error('Error checking password:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});


router.post('/login', async (req, res) => {
    const { password } = req.body;
    const storedPassword = db.data.password?.[0]?.password || null;
    if (storedPassword == null) {
        return res.json({ success: true, message: 'Login successful' });
    }

    try {

        const match = await bcrypt.compare(password, storedPassword);
        if (match) {
            db.data.password[0].timeStamp = Date.now()
            await db.write()

            return res.json({ success: true, message: 'Login successful' });
        } else {
            return res.json({ success: false, message: 'Invalid password' });
        }

    } catch (error) {
        console.error('Error comparing passwords:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }

});

router.post('/logout', async (req, res) => {
    try {
        db.data.password[0].timeStamp = ''
        await db.write()
        return res.json({ success: true, message: 'Logut successful' });

    } catch (error) {
        console.error('Error loging out:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }

});



router.get('/getbtcprice', async (req, res) => {
    try {
        const btcPrice = await utils.getBitconPrice();
        return res.json({ btcPrice: btcPrice })
    }
    catch (error) {
        const btcPrice = await utils.getBitconPrice();
        return res.status(500).json({ btcPrice: btcPrice });
    }
});

router.get('/getconfiginfo', async (req, res) => {
    try {
        const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.phoenix', 'phoenix.conf');
        const config = utils.readConfigFile(configPath);
        res.json({ config: config })
    }
    catch (error) {
        res.status(500).json({ "message": error });
    }
});

router.get('/getseedphrase', (req, res) => {
    try {
        const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.phoenix', 'seed.dat');
        const seed = utils.readSeedWords(configPath);

        return res.json({ seed });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


router.get('/ispasswordset', (req, res) => {
    try {
        const storedPassword = db.data?.password?.[0]?.password || null;
        if (storedPassword == null) {
            return res.status(200).json({ success: false });

        }
        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(401).json({ success: false });
    }
});

router.get('/authenticate', async (req, res) => {
    const storedPassword = db.data?.password?.[0]?.password || null;
    if(storedPassword == null){
        return res.status(200).json({ success: true });

    }
    const timeStamp = db.data?.password?.[0]?.timeStamp || null;

    const isSessionExpired = utils.checkIsSessionExpired(timeStamp)

    try {
        if (storedPassword !== null && !isSessionExpired) {
            return res.status(200).json({ success: true });
        } else {
            return res.status(401).json({});
        }
    } catch (error) {
        return res.status(401).json({ success: false });
    }
});

export default router;