import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Complaint } from '../models/Complaint.js';

dotenv.config();

const APPLY_FLAG = '--apply';
const isApplyMode = process.argv.includes(APPLY_FLAG);
const defaultCanteen = process.env.COMPLAINT_DEFAULT_CANTEEN || 'Main Canteen';

const toCanonicalCanteen = (value) => {
  const name = (value || '').trim().toLowerCase();

  if (!name) {
    return '';
  }

  if (name.includes('hostel') || name.includes('basement')) {
    return 'Hostel Canteen';
  }

  if (name.includes('mini') || name.includes('anohana') || name.includes('faculty')) {
    return 'Mini Canteen';
  }

  if (name.includes('main') || name.includes('new')) {
    return 'Main Canteen';
  }

  return '';
};

const inferCanteenFromComplaint = (complaint) => {
  const directMatch = toCanonicalCanteen(complaint.canteen);
  if (directMatch) {
    return directMatch;
  }

  const text = [
    complaint.subject,
    complaint.description,
    complaint.category,
    complaint.adminReply
  ]
    .filter(Boolean)
    .join(' ');

  const textMatch = toCanonicalCanteen(text);
  if (textMatch) {
    return textMatch;
  }

  return defaultCanteen;
};

const run = async () => {
  try {
    await connectDB();

    const complaints = await Complaint.find({}).select('_id complaintId canteen subject description category');
    const updates = [];

    complaints.forEach((complaint) => {
      const nextCanteen = inferCanteenFromComplaint(complaint);
      const currentCanteen = (complaint.canteen || '').trim();

      if (currentCanteen !== nextCanteen) {
        updates.push({
          _id: complaint._id,
          complaintId: complaint.complaintId,
          from: currentCanteen || '(empty)',
          to: nextCanteen
        });
      }
    });

    console.log(`Total complaints scanned: ${complaints.length}`);
    console.log(`Complaints needing update: ${updates.length}`);

    if (updates.length > 0) {
      console.log('Sample updates:');
      updates.slice(0, 10).forEach((item) => {
        console.log(`- ${item.complaintId || item._id}: ${item.from} -> ${item.to}`);
      });
    }

    if (!isApplyMode) {
      console.log(`Dry run complete. Re-run with ${APPLY_FLAG} to apply updates.`);
      return;
    }

    if (updates.length === 0) {
      console.log('No updates to apply.');
      return;
    }

    const bulkOps = updates.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { canteen: item.to } }
      }
    }));

    const result = await Complaint.bulkWrite(bulkOps, { ordered: false });
    console.log(`Applied updates: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Backfill failed:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

run();
