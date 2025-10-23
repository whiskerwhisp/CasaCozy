const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const { search } = req.query; // extract search query
    let allListings;

    if (search) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
            ],
        });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, search });
};

module.exports.new = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.show = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path:"reviews", populate:{path:"author"},})
    .populate("owner");
    if(!listing){
        req.flash("err", "Your requested stay does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.create = (async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const listing=req.body.Listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};

    
    await newListing.save()
    req.flash("success", "Your new addition is ready and cozy!");
    res.redirect("/listings");
});

module.exports.edit= async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("err", "Your requested stay does not exist!");
        res.redirect("/listings");
    }
    let originalImage = listing.image.url;
    res.render("listings/edit.ejs", { listing, originalImage});
};

 module.exports.update= async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.Listing });

   if(typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
   }
    req.flash("success", "Your update is complete and cozy!!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroy = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "listing deleted!");
    res.redirect("/listings");
};