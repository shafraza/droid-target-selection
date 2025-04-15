import { Router } from 'express';
import { processRadarData, getAuditList, getAuditDetail, deleteAudit } from '../controllers/radarController';

const router = Router();

router.get('/', (_, res) => {
    res.send('🛰️ YVH Targeting API is live. Ready to receive scan data at /radar.');
  });
router.post('/radar', processRadarData);
router.get('/audit', getAuditList);
router.get('/audit/:id', getAuditDetail);
router.delete('/audit/:id', deleteAudit);

export default router;