import mongoose, { Schema, Document } from 'mongoose';
import { RadarData, Coordinates } from '../types';

export interface IAudit extends Document {
  request: RadarData;
  response: Coordinates | null;
  timestamp: Date;
}

const AuditSchema: Schema = new Schema({
  request: {
    type: Schema.Types.Mixed,
    required: true
  },
  response: {
    type: Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IAudit>('Audit', AuditSchema);