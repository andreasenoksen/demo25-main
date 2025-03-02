import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongodb-session';
import HTTP_CODES from './utils/httpCodes.mjs';
import DeckManager from './utils/deckManager.mjs';

const server = express();
const port = process.env.PORT || 8000;

const MongoDBStore = MongoStore(session);
let store;

try {
    store = new MongoDBStore({
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/sessions',
        collection: 'sessions'
    });

    store.on('error', function (error) {
        console.error('⚠️  Session store error:', error);
    });

    console.log('Connected to MongoDB session store.');
} catch (err) {
    console.error('Could not connect to MongoDB. Sessions will not persist.');
    store = null;
}

server.use(session({
    secret: process.env.SESSION_SECRET || 'mySecretKey',
    resave: false,
    saveUninitialized: false,
    store: store || new session.MemoryStore(),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

server.set('port', port);
server.use(express.static('public'));

function handleRootRequest(req, res) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function handlePoemRequest(req, res) {
    const poem = `
        Roses are red,
        Violets are blue,
        Sugar is sweet,
        And so are you.
    `;
    res.status(HTTP_CODES.SUCCESS.OK).send(poem).end();
}

function handleQuoteRequest(req, res) {
    const quotes = [
        "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
        "In the middle of every difficulty lies opportunity. - Albert Einstein",
        "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment. - Buddha",
        "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

server.get('/session', (req, res) => {
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views++;
    }
    res.send(`Session views: ${req.session.views}`);
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
