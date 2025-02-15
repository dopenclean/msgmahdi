import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 2500;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let messages = [];

app.get('/', (req, res) => {
    const perPage = 3;
    const page = parseInt(req.query.page) || 1;

    const totalMessages = messages.length;
    const totalPages = Math.ceil(totalMessages / perPage);

    const paginatedMessages = messages.slice((page - 1) * perPage, page * perPage);

    res.render('index', { 
        msg: paginatedMessages,
        currentPage: page,
        totalPages: totalPages
    });
});

app.get('/new', (req, res) => {
    res.render('new');
});

app.post('/add', (req, res) => {
    const { ctitle, content} = req.body;
    const id = messages.length + 1;
    messages.push({id, ctitle, content});
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const message = messages.find( p => p.id == req.params.id);
    if (!message) return res.redirect('/');
    res.render('edit', { message });
    
});

app.post('/update/:id', (req, res) => {
    const message = messages.find( p => p.id == req.params.id);
    if (message){
        message.ctitle = req.body.ctitle;
        message.content = req.body.content;
    }
    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    messages = messages.filter(p => p.id != req.params.id);
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Your website running at http://localhost:${port}`);
});