import mongoose from "mongoose";
    interface ConnectionsParams{
        useNewUrlParser: boolean,
        useUnifiedTopology: boolean
    }
    const connectionParams: ConnectionsParams={
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }
    
    mongoose.set("strictQuery", false);
    
    mongoose.connect(process.env.mongo_uri as string);
    
    
    const db = mongoose.connection;
    
    db.on('error', console.error.bind(console, "Error connecting to MongoDB"));
    
    
    db.once('open', function(){
        console.log('Connected to Database :: MongoDB');
    });
    
    
    export = db;
