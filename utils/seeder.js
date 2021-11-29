const Room = require('../models/room');
const mongoose = require('mongoose');

const rooms = require('../data/rooms')

mongoose.connect('mongodb+srv://rivo:Lasolution.3352@nodeexpress.uogl0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    //useFindAndModify: false,
   // useCreateIndex: true
})

const seedRooms = async () => {
    try {

        await Room.deleteMany();
        console.log('Rooms are deleted');

        await Room.insertMany(rooms);
        console.log('All Rooms are added.');

        process.exit()


    } catch (error) {
        console.log(error.message);
        process.exit()
    }
}

seedRooms()

