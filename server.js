const express = require('express');
const flash = require('express-flash');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: "supersecret"
}));
app.use(flash());
app.use(express.static(__dirname + '/static'));

mongoose.connect('mongodb://localhost/quotingapp');

//generate schema w/ validations
const QuoteSchema = new mongoose.Schema({
  name: {type: "String", required: true, minlength: 3},
  quote: {type: "String", required: true, minlength: 2},
  },
    {timestamps: true}
);

//add model w/schema
mongoose.model('Quote', QuoteSchema);

//retreive model
const Quote = mongoose.model('Quote');

//setup routes
app.get('/', (req, res)=>{
  res.render('index');
});

app.get('/quotes', (req, res)=>{
  let quotes = Quote.find({}, (err, quotes)=>{

    if(!err){
      console.log('DB queried successfully!');
    }
    else{
      //console.log(err);
    }

    res.render('quotes', {'quotes': quotes});
  });

});

app.post('/quotes', (req, res)=>{
  let quote = new Quote({
    name: req.body.name,
    quote: req.body.quote
  });

  quote.save(err=>{

    if(!err){
      console.log('Quote successfully added to DB!');
    }
    else{
      //console.log(err);
      for(var error in err.errors){
        // res.flash[err.errors[error]];
        console.log(err.errors[error].message);
        req.flash('quote_submission', err.errors[error].message);
      }
    }

    res.redirect('/');
  });
});

//start server
app.listen(7777, function(){
  console.log('Express app listening on port 7777');
});