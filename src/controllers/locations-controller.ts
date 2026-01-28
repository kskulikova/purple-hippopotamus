import { Request, Response } from 'express';
import { LatLonRequestParams } from '../models';
import { fetchLocations } from '../repositories/user-preferences-repository';

export const getLocations = async (
  // Types: Request<Params, ResBody, ReqBody, ReqQuery>
  req: Request<LatLonRequestParams, any, any, LatLonRequestParams>,
  res: Response
) => {
  try {
    const locations = fetchLocations();
    return JSON.stringify({ locations: locations });
  } catch (error: any) {
    throw new Error(`Failed to get Locations: ${error.message}`);
  }
};
