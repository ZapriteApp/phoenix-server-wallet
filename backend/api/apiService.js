import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path'
import { response } from 'express';
import * as utils from '../utils/utils.js'
dotenv.config();

let baseUrl = process.env.PHOENIX_API_URL
const username = '';
const configPath = path.join(process.env.HOME || process.env.USERPROFILE, '.phoenix', 'phoenix.conf');
const configs = utils.readConfigFile(configPath)
const httpPassword = configs["http-password"];
const headers = {
  'Authorization': 'Basic ' + Buffer.from(`${username}:${httpPassword}`).toString('base64')
};

export const getBalance = async () => {
  const path = '/getbalance';
  const url = new URL(path, baseUrl).href;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}

export const payInvoice = async (amountSat, invoice) => {
  const path = '/payinvoice';
  const url = new URL(path, baseUrl).href;

  const data = new URLSearchParams();
  if (amountSat) {
    data.append('amountSat', amountSat);
  }
  data.append('invoice', invoice);


  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;

  } catch (error) {
    console.error("Error paying invoice", error)
    throw error
  }
}

export const getNodeInfo = async () => {
  const path = '/getinfo';
  const url = new URL(path, baseUrl).href;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching data', error);
    throw error;
  }
}

export const createInvoice = async (description, amountSat, externalId, webhookUrl) => {
  const path = '/createinvoice';
  const url = new URL(path, baseUrl).href;

  const data = new URLSearchParams();
  data.append('description', description);
  data.append('amountSat', amountSat);
  data.append('extranlID', externalId);
  data.append('webhookUrl', webhookUrl);

  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data
  } catch (error) {
    console.error('Error creating invoice:', error);
  }
}

export const getIncomingPayments = async (from, to, limit, offset, all) => {
  const path = '/payments/incoming';
  const url = new URL(path, baseUrl).href;

  const params = {
    from: from,
    to: to,
    limit: limit,
    offset: offset,
    all: all
  }

  try {
    const response = await axios.get(url, {  params, headers });
    return response.data
  } catch (error) {
    console.error('Error fetching payments:', error);
  }
}


export const getOutgoingPayments = async (from, to, limit, offset, all) => {
  const path = '/payments/outgoing';
  const url = new URL(path, baseUrl).href;
  const params = {
    from: from,
    to: to,
    limit: limit,
    offset: offset,
    all: all
  }

  try {
    const response = await axios.get(url, {  params, headers });
    return response.data
  } catch (error) {
    console.error('Error fetching payments:', error);
  }

}

export const payOffer = async (amountSat, offer, message) => {
  const path = '/payoffer';
  const url = new URL(path, baseUrl).href;

  let data = new URLSearchParams();
  data.append('amountSat', amountSat);
  data.append('offer', offer);
  data.append('message', message);

  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error('Error paying offer:', error);
  }
};

export const payLnAddress = async (amountSat, lnAddress, message) => {
  const path = '/paylnaddress';
  const url = new URL(path, baseUrl).href;

  let data = new URLSearchParams();
  data.append('amountSat', amountSat);
  data.append('address', lnAddress);
  data.append('message', message);

  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error('Error paying LN address:', error);
  }
};


export const getOffer = async () => {
  const path = '/getoffer';
  const url = new URL(path, baseUrl).href;
  try {
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error getting data', error);
    throw error;
  }
}

export const listIncomingAndOutgoing = async () => {
  const path1 = '/payments/incoming?all=true&limit=1000000';
  const path2 = '/payments/outgoing?all=true&limit=1000000';

  const url1 = new URL(path1, baseUrl).href;
  const url2 = new URL(path2, baseUrl).href;

  try {
    const response1 = await axios.get(url1, { headers });
    const response2 = await axios.get(url2, { headers });
    // const date = new Date(response1.data[0].createdAt);
    // return date.toString();
    
    // return [ ...response1.data, ...response2.data ]

    let data = [ ...response1.data, ...response2.data ];

    return data.sort((a,b) => b.createdAt - a.createdAt)
    // return response1.data;
  } catch (error) {
    console.error('Error getting data', error);
    throw error;
  }

}

export const decodeOffer = async (offer) => {
  const path = '/decodeoffer';
  const url = new URL(path, baseUrl).href;
  let data = new URLSearchParams();
  data.append('offer', offer);
  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error('Error decoding offer', error);
    return response.data;
  }
}

export const decodeInvoice = async (invoice) => {
  const path = '/decodeinvoice';
  const url = new URL(path, baseUrl).href;
  let data = new URLSearchParams();
  data.append('invoice', invoice);
  try {
    const response = await axios.post(url, data.toString(), { headers });
    return response.data;
  } catch (error) {
    console.error('Error decoding offer', error);
    throw error;
  }
}