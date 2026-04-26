import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    problem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Problem',
      required: true,
    },
    code: {
      html: { type: String, default: '' },
      css: { type: String, default: '' },
      javascript: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['submitted', 'reviewed'],
      default: 'submitted',
    },
    note: {
      type: String,
      default: '', // user can add a note about their solution
    },
  },
  { timestamps: true }
);

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
