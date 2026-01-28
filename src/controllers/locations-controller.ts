import { Request, Response } from 'express';
import { fetchLocations } from '../repositories/user-preferences-repository';

export const getLocations = async (req: Request, res: Response) => {
  try {
    const locations = await fetchLocations();
    return res.status(200).json({ locations: locations });
  } catch (error: any) {
    throw new Error(`Failed to get Locations: ${error.message}`);
  }
};
