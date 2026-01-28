import { fetchLocations } from '../repositories/user-preferences-repository';

export const getLocations = async () => {
  try {
    const locations = fetchLocations();
    return JSON.stringify({ locations: locations });
  } catch (error: any) {
    throw new Error(`Failed to get Locations: ${error.message}`);
  }
};
