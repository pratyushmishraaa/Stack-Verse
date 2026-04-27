import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    tags: [{ type: String, trim: true }],
    category: {
      type: String,
      enum: ['frontend', 'backend', 'fullstack', 'database', 'devops'],
      required: true,
    },
    requirements: [{ type: String }],
    resources: [
      {
        label: String,
        url: String,
      },
    ],
    starterCode: {
      html: { type: String, default: '' },
      css: { type: String, default: '' },
      javascript: { type: String, default: '' },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    solvedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Problem = mongoose.model('Problem', problemSchema);
export default Problem;
