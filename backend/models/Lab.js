import mongoose from 'mongoose';

const labSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Lab name is required'],
            trim: true,
            unique: true,
        },
        location: {
            type: String,
            trim: true,
            default: '',
        },
        department: {
            type: String,
            trim: true,
            default: '',
        },
        capacity: {
            type: Number,
            required: [true, 'Capacity is required'],
            min: [1, 'Capacity must be at least 1'],
            default: 30,
        },
        status: {
            type: String,
            enum: ['Available', 'Occupied', 'Maintenance'],
            default: 'Available',
        },
        // Phase 16 addition: admin responsible for this lab
        assignedAdmin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
        // Optional maintenance window stored on the document itself
        maintenance: {
            startDate: { type: String, default: null },
            endDate: { type: String, default: null },
            reason: { type: String, default: '' },
        },
    },
    { timestamps: true },
);

labSchema.index({ status: 1 });
labSchema.index({ assignedAdmin: 1 }, { sparse: true });

export const Lab = mongoose.model('Lab', labSchema);
export default Lab;
