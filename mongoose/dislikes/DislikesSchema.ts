import mongoose, { Schema } from "mongoose";
import {Dislike} from "../../models/dislikes/dislike";

const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: { type: Schema.Types.ObjectId, ref: "TuitModel" },
    dislikedBy: { type: Schema.Types.ObjectId, ref: "UserModel" },
}, { collection: "dislikes" });
export default DislikeSchema;