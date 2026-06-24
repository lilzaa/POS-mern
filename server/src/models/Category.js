import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
{
  name:{
    type:String,
    required:true,
    unique:true,
    trim:true
  },

  description:{
    type:String,
    default:""
  },

  color:{
    type:String,
    default:"from-primary/20 to-secondary"
  }

},
{
  timestamps:true
});


export default mongoose.model("Category", categorySchema);