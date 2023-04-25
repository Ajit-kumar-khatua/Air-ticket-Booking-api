const mongoose=require("mongoose")

const bookingSchema=mongoose.Schema({
    user : { type: Object, ref: 'User' },
	flight : { type: Object, ref: 'Flight' }
})

const BookingModel=mongoose.model("booking",bookingSchema)

module.exports={
    BookingModel
}