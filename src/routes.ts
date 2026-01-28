import { Router } from 'express';
import { getActivityScore } from './controllers/weather-controller';
import { getLocations } from './controllers/locations-controller';

const router = Router();

// Endpoint: GET /api/v1/activity-score
router.get('/activity-score', getActivityScore);

// Endpoint: GET /api/v1/locations
router.get('/locations', getLocations);

export default router;
