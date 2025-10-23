const MONGO_URL = process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to database");
    initDB(); 
}).catch((err)=>{
    console.log("error connecting to database", err.message);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj) =>({
       ...obj,
       owner: "66ea7e29b6f47663da6dbf7e"
   }));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
};

