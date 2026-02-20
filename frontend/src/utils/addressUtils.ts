// Utility functions for Nepal administrative divisions
import { nepalAdministrativeDivisions } from './nepalAdministrativeDivisions';

/**
 * Get all provinces
 */
export const getProvinces = (): string[] => {
  return nepalAdministrativeDivisions.map(province => province.name);
};

/**
 * Get districts for a specific province
 */
export const getDistrictsByProvince = (provinceName: string): string[] => {
  const province = nepalAdministrativeDivisions.find(
    p => p.name === provinceName
  );
  
  if (!province) return [];
  
  return province.districts.map(district => district.name);
};

/**
 * Get local bodies for a specific district
 */
export const getLocalBodiesByDistrict = (
  provinceName: string, 
  districtName: string
): { name: string; type: string }[] => {
  const province = nepalAdministrativeDivisions.find(
    p => p.name === provinceName
  );
  
  if (!province) return [];
  
  const district = province.districts.find(
    d => d.name === districtName
  );
  
  if (!district) return [];
  
  return district.localBodies.map(lb => ({
    name: lb.name,
    type: lb.type
  }));
};

/**
 * Get number of wards for a specific local body
 */
export const getWardsByLocalBody = (
  provinceName: string,
  districtName: string,
  localBodyName: string
): number => {
  const province = nepalAdministrativeDivisions.find(
    p => p.name === provinceName
  );
  
  if (!province) return 0;
  
  const district = province.districts.find(
    d => d.name === districtName
  );
  
  if (!district) return 0;
  
  const localBody = district.localBodies.find(
    lb => lb.name === localBodyName
  );
  
  return localBody?.wards || 0;
};

/**
 * Generate ward options (1 to numberOfWards)
 */
export const generateWardOptions = (numberOfWards: number): number[] => {
  return Array.from({ length: numberOfWards }, (_, i) => i + 1);
};

/**
 * Get formatted select options for provinces
 */
export const getProvinceOptions = () => {
  return [
    { value: '', label: 'Select Province' },
    ...getProvinces().map(province => ({
      value: province,
      label: province
    }))
  ];
};

/**
 * Get formatted select options for districts
 */
export const getDistrictOptions = (provinceName: string) => {
  if (!provinceName) {
    return [{ value: '', label: 'Select District' }];
  }
  
  return [
    { value: '', label: 'Select District' },
    ...getDistrictsByProvince(provinceName).map(district => ({
      value: district,
      label: district
    }))
  ];
};

/**
 * Get formatted select options for local bodies
 */
export const getLocalBodyOptions = (provinceName: string, districtName: string) => {
  if (!provinceName || !districtName) {
    return [{ value: '', label: 'Select Local Body' }];
  }
  
  const localBodies = getLocalBodiesByDistrict(provinceName, districtName);
  
  return [
    { value: '', label: 'Select Local Body' },
    ...localBodies.map(lb => ({
      value: lb.name,
      label: `${lb.name} (${lb.type})`
    }))
  ];
};

/**
 * Get formatted select options for wards
 */
export const getWardOptions = (
  provinceName: string,
  districtName: string,
  localBodyName: string
) => {
  if (!provinceName || !districtName || !localBodyName) {
    return [{ value: '', label: 'Select Ward' }];
  }
  
  const numberOfWards = getWardsByLocalBody(provinceName, districtName, localBodyName);
  const wards = generateWardOptions(numberOfWards);
  
  return [
    { value: '', label: 'Select Ward' },
    ...wards.map(ward => ({
      value: ward.toString(),
      label: `Ward ${ward}`
    }))
  ];
};

/**
 * Validate address selection
 */
export const isValidAddressSelection = (
  province: string,
  district: string,
  localBody: string,
  ward: string
): boolean => {
  if (!province || !district || !localBody || !ward) {
    return false;
  }
  
  // Check if province exists
  const provinceData = nepalAdministrativeDivisions.find(p => p.name === province);
  if (!provinceData) return false;
  
  // Check if district exists in province
  const districtData = provinceData.districts.find(d => d.name === district);
  if (!districtData) return false;
  
  // Check if local body exists in district
  const localBodyData = districtData.localBodies.find(lb => lb.name === localBody);
  if (!localBodyData) return false;
  
  // Check if ward is within range
  const wardNumber = parseInt(ward);
  if (isNaN(wardNumber) || wardNumber < 1 || wardNumber > localBodyData.wards) {
    return false;
  }
  
  return true;
};
