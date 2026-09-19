import mongoose from "mongoose"

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    content: {
      type: String,
      required: true
    },

    summary: {
      type: String,
      trim: true
    },

    coverImage: {
      type: String,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft"
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    views: {
      type: Number,
      default: 0
    },

    publishedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Article = mongoose.model("Article", articleSchema)
export default Article