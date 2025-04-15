import { Request, Response } from 'express';
import { RadarData, Coordinates, ScanPoint } from '../types';
import { processProtocols } from '../protocols';
import Audit from '../models/audit';

export const processRadarData = async (req: Request, res: Response): Promise<void> => {
  try {
    const radarData: RadarData = req.body;
    
    // Validate radar data
    if (!radarData.protocols || !Array.isArray(radarData.protocols) || !radarData.scan || !Array.isArray(radarData.scan)) {
      res.status(400).json({ error: 'Invalid radar data format' });
      return;
    }

    // Process protocols
    const processedPoints = processProtocols(radarData.scan, radarData.protocols);
    
    // Determine target
    let targetCoordinates: Coordinates | null = null;
if (processedPoints.length > 0) {
  // Create coordinates object with explicit property order
  targetCoordinates = {
    x: processedPoints[0].coordinates.x,
    y: processedPoints[0].coordinates.y
  };
}

    

    // Store audit record
    const audit = new Audit({
      request: radarData,
      response: targetCoordinates
    });
    await audit.save();

    // Response
    if (targetCoordinates) {
      // Force specific property order in JSON response
      const orderedResponse = JSON.stringify({
        x: targetCoordinates.x,
        y: targetCoordinates.y
      });
      
      // Send pre-serialized JSON with correct content type
      res.status(200).type('json').send(orderedResponse);
    } else {
      res.status(404).json({ error: 'No valid targets found' });
    }
  } catch (error) {
    console.error('Error processing radar data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAuditList = async (_req: Request, res: Response): Promise<void> => {
  try {
    const audits = await Audit.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json(audits);
  } catch (error) {
    console.error('Error fetching audit list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAuditDetail = async (req: Request, res: Response): Promise<void> => {
  try {
    const audit = await Audit.findById(req.params.id);
    if (!audit) {
      res.status(404).json({ error: 'Audit record not found' });
      return;
    }
    res.status(200).json(audit);
  } catch (error) {
    console.error('Error fetching audit detail:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAudit = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await Audit.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ error: 'Audit record not found' });
      return;
    }
    res.status(200).json({ message: 'Audit record deleted successfully' });
  } catch (error) {
    console.error('Error deleting audit record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};