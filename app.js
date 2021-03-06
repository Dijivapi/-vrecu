const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/mongo-1', { useNewUrlParser: true });

const VisitorSchema = new mongoose.Schema({
    name: { type: String },
    count: { type: Number, default: 0 }
});
const Visitor = mongoose.model("Visitor", VisitorSchema);

app.set('view engine', 'pug');
app.set('views', 'views');

app.get("/", async(req, res) => {
    const name = req.query.name;
    let visitor = new Visitor({ name: "Anónimo", count: 1 });
    if (name) {
        visitor = await Visitor.findOne({ name });
        if (!visitor) {
            visitor = new Visitor({ name, count: 1 });
        } else {
            visitor.count += 1;
        }
    }
    await visitor.save();
    const visitors = await Visitor.find();
    res.render("index", { visitors: visitors })
});

app.listen(3000, () => {
    return console.log('Listening on port 3000!');
});