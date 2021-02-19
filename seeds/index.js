const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Hike = require("../models/hike");

mongoose.connect("mongodb://localhost:27017/hike-trail",
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

// Randomizing attributes

// const randImg = () => {
//     const
// }

// const imageF = (randImg) => {

// }

const gradeF = () => {
    if (Math.random() * 10 >= 7) {
        const grade = "Easy";
        return grade;
    } else if (Math.random() * 10 >= 3) {
        const grade = "Medium";
        return grade;
    } else if (Math.random() * 10 >= 0) {
        const grade = "Hard";
        return grade;
    }
};

const distanceF = () => {
    if (Math.random() * 10 >= 8) {
        const distance = "15 KMs";
        return distance;
    } else if (Math.random() * 10 >= 6) {
        const distance = "10 KMs";
        return distance;
    } else if (Math.random() * 10 >= 4) {
        const distance = "8 KMs";
        return distance;
    }
    else if (Math.random() * 10 >= 2) {
        const distance = "7 KMs";
        return distance;
    }
    else if (Math.random() * 10 >= 0) {
        const distance = "4 KMs";
        return distance;
    }
};

const isGuidedF = () => {
    if (Math.random() * 10 > 6) {
        return true
    } else {
        return false
    }
};

// Seeding the Database

const seedDb = async () => {
    await Hike.deleteMany({});
    for (let i = 0; i < 90; i++) {
        const random92 = Math.floor(Math.random() * 91);
        const hike = new Hike({
            author: "602c045958adc60484a53847",
            area: `${cities[random92].city}, ${cities[random92].region}`,
            trail: `${sample(descriptors)} ${sample(places)}`,
            grade: gradeF(),
            distance: distanceF(),
            isGuided: isGuidedF(),
            geometry: { type: 'Point', coordinates: [cities[random92].lng, cities[random92].lat] },
            images: [
                {
                    url: 'https://res.cloudinary.com/dbdhx6jfm/image/upload/v1613681030/HikeTrail/stephanie-grubenmann-MSncg3GKd4E-unsplash_wpmba3.jpg',
                    filename: 'HikeTrail/stephanie-grubenmann-MSncg3GKd4E-unsplash_wpmba3'
                },
                {
                    url: 'https://res.cloudinary.com/dbdhx6jfm/image/upload/v1613681067/HikeTrail/clay-banks-yoqfCYkeJHw-unsplash_syg5m0.jpg',
                    filename: 'HikeTrail/clay-banks-yoqfCYkeJHw-unsplash_syg5m0'
                }
            ]
        });
        await hike.save();
    }
};

seedDb().then(() => {
    mongoose.connection.close();
})