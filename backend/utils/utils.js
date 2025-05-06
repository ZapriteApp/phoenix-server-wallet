import dotenv from 'dotenv';
dotenv.config();
import * as apiService from '../api/apiService.js';
import fs from 'fs'
import db from './db.js'
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid'

export function saveToEnvFile(key, value) {
  const envVar = `${key}=${value}\n`;
  const envFilePath = path.resolve(__dirname, '.env');

  fs.appendFile(envFilePath, envVar, (err) => {
    if (err) {
      console.error('Error writing to .env file:', err);
    } 
  });
}

export function isBolt11(value) {
  if (typeof offer !== 'string') {
    return False;
  }

  fetch('/api/decodeinvoice')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('Error decoding invoice:', error);
    });
}

export function isBolt12(value) {
  if (typeof offer !== 'string') {
    return False;
  }

  fetch('/api/decodeoffer')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      return data
    })
    .catch(error => {
      console.error('Error decoding offer:', error);
    });
}

export async function getBitconPrice() {
  try {
    //Check if the btcPrice is saved
    if (db?.data?.btcPrice?.[0]?.timeStamp) {
      const timeDifference = Date.now() - db.data.btcPrice[0].timeStamp;
      const thirtyMinutes = 30 * 60 * 1000;

      if (timeDifference <= thirtyMinutes) {
        return db.data.btcPrice[0].btcPrice;
      }
    }

    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const bitcoinPrice = response.data.bitcoin.usd;
    db.data.btcPrice = []
    db.data.btcPrice.push({ btcPrice: bitcoinPrice, timeStamp: Date.now() });
    await db.write()
    return bitcoinPrice;

  } catch (error) {
    console.error(`Error fetching Bitcoin price: ${error.message}`);
    return db.data.btcPrice[0].btcPrice;
  }
}

export function readConfigFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    const config = {};
    fileContents.split('\n').forEach(line => {
      const cleanedLine = line.split('#')[0].trim();
      if (cleanedLine) {
        const [key, value] = cleanedLine.split('=').map(item => item.trim());
        if (key && value) {
          config[key] = value;
        }
      }
    });

    return config;
  } catch (err) {
    console.error('Error reading config file:', err);
  }
}

export function checkIsSessionExpired(timestamp) {
  if (timestamp == '') {
    return false;
  }

  const currentTime = Date.now();

  const timestampValue = Number(timestamp);

  if (isNaN(timestampValue)) {
    return true;
  }
  const timeDifference = currentTime - timestampValue;

  if (timeDifference > 3600000) {
    return true;
  }

  return false;
}

export function readSeedWords(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    const firstLine = lines[0];
    return firstLine;
  } catch (err) {
    console.error('Error reading file:', err);
    return null;
  }
}

export function getId() {
  return uuidv4();
}