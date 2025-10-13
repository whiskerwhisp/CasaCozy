const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/CasaCozy";
main()
.then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async ()=>{
   await Listing.deleteMany({});
   
   // Get or create a default user for the sample data
   const User = require("../models/user.js");
   let user = await User.findOne({});
   
   if (!user) {
     console.log("No users found. Creating a default user for sample data...");
     // Create a default user for the sample data
     user = new User({ 
       email: "demo@casacozy.com", 
       username: "demo_host" 
     });
     await User.register(user, "demo123");
     console.log("Default user created: demo@casacozy.com / demo123");
   }
   
   initData.data = initData.data.map((obj) =>({
   ...obj, owner: user._id
   }));
   await Listing.insertMany(initData.data);
   console.log("Sample data was initialized successfully!");

};

initDB();