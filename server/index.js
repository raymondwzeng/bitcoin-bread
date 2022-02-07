import 'dotenv/config'
import fetch, { Request } from 'node-fetch'
import express from 'express'
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

//Grab Redis
import {createClient} from 'redis'
let client; //Null client variable to use later on, as our client is declared in an asynchronous function after Express loads (for Express reasons)

//Global File Consts
const __dirname = path.resolve(path.dirname(fileURLToPath(import.meta.url)));

//Express Setup, including declaring app, port and using CORS.
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: ['https://bitcoin-bread.herokuapp.com']
}));

//TODO: Add GET request from specific domain (bitcoin-break.heroku or whatever)
//MAYBE: Add mongoDB and mongoose packages (or maybe we could try SQL :think:) for previous-day data.
//Edit 02/05/2022: Decided to try out Redis! 

//The objective is to have the the server ping API every day at midnight (well, configurable), send to the database, and report back/update.

//https://www.bls.gov/charts/consumer-price-index/consumer-price-index-average-price-data.htm
//The price of bread in the US is approximately $1.53 per pound. As per internet sources, the average weight of a loaf of bread is ~1lb.
const breadPrice = 1.53;
//For now, this will be a constant until I figure out how to deal with the BLS data >:(

//BTC Data!
let recentBTCPrice = 0;
let yesterdayBTCPrice = 0;

const clientSideStuff = path.join(__dirname, "..", process.env['CLIENT_PATH']); //Required filepathing join to get the client path due to how I set this up initially.

//Serve default page.
app.get('/', (req, res) => {
    return res.sendFile(clientSideStuff); //This only works due to the use of the middleware in later lines. Also because of Express shennanigans, the middleware must be defined after this.
});

//API endpoint. This returns the price of bread, bitcoin, and also yesterday's price of bitcoin.
app.get('/api/', (_, res) => {
    return res.json({
        breadPrice: breadPrice,
        price: recentBTCPrice,
        yesterdayPrice: yesterdayBTCPrice
    });
})

//apiHeaders
//Default API headers to submit.
const apiHeaders = {
    method: "POST",
    headers: {
        "content-type": "application/json",
        "x-api-key": process.env["API_KEY"],
    },
    body: JSON.stringify({
        currency: "USD",
        code: "BTC",
        meta: true,
    }),
};

app.use(express.static(clientSideStuff)); //This line in particular makes express actually serve the client-side stuff. Could probably also filter it further to make it not everything, but /shrug

//pingAPI -> void
//Pings our API endpoint for the data. Eventually will send to DB, for now just console log.
let pingAPI = async () => {
    let today = new Date();
    let yesterday = new Date(today.getTime() - 24*3600*1000); //Get yesterday's date using millisecond timestamp
    let todayString = today.toDateString();
    let price = await client.get(todayString);
    if(price == null) {
        fetch(new Request(process.env['API_HOST']), apiHeaders)
            .then(response => response.json())
            .then(data => {
                if(data.rate == null) { //Something happened to the API, fallback to what we had before. Not sure if this is necessary, will come back to this.
                    let DBYesterdayPrice = client.get(yesterday.toDateString());
                    if(DBYesterdayPrice != null) { //Check to make sure that
                        recentBTCPrice = client.get(yesterday.toDateString()); //Hopefully we have yesterday's time lol
                    }
                } else {
                    yesterdayBTCPrice = recentBTCPrice; //Set previous to (now stale) data.
                    recentBTCPrice = data.rate;
                    client.set(todayString, recentBTCPrice);
                }
            })
            .catch((error) => {
                console.warn("Error while handling data:", error);
        });
    } else {
        recentBTCPrice = price;
    }

    //Set yesterday's amount to either one from the DB, or to current price.
    //Suggestion: Change this to it simply sets it to the most recent price? It sort of already does that assuming the server doesn't turn off, but...
    let yesterdayPrice = await client.get(yesterday.toDateString());
    if(yesterdayPrice == null) {
        yesterdayBTCPrice = recentBTCPrice; //Set price to day.
    } else {
        yesterdayBTCPrice = yesterdayPrice;
    }
}

//connectToDB -> void
//Connects to our actual server to retrieve and grab data.
let connectToDB = async () => {
    client = createClient({
        url: `redis://${process.env['DB_USER']}:${process.env['DB_PASSWORD']}@${process.env['DB_URL']}:${process.env['DB_PORT']}`
    });
    
    await client.connect();
}

//Initialize Express! Also set up a delay to ping the API every 24 hours.
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`);
    connectToDB();
    setInterval(pingAPI, 86400000); //Call to pingAPI every day.
});