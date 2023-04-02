(function(){
    const mongoose = require('mongoose');
    const connectionParams={
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
    
    mongoose.set("strictQuery", false);
    
    mongoose.connect(process.env.mongo_uri);
    
    
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
    
    
    db.once('open', function(){
        console.log('Connected to Database :: MongoDB');
    });
    
    
    module.exports = db;
})();
