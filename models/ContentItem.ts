import mongoose from "mongoose";
// `collection` is a reserved Mongoose schema pathname. The field name is load-bearing
// here — it's the discriminator every query, route param and admin page keys off — so
// suppressing the warning is preferable to renaming it across ~79 call sites.
const contentItemSchema=new mongoose.Schema({collection:{type:String,required:true,index:true},title:{type:String,required:true,trim:true},description:{type:String,default:""},status:{type:String,default:"published"},meta:{type:mongoose.Schema.Types.Mixed,default:{}}},{timestamps:true,suppressReservedKeysWarning:true});
export default mongoose.models.ContentItem || mongoose.model("ContentItem",contentItemSchema);
