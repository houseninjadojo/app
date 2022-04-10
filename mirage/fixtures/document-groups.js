// import faker from '@faker-js/faker';
import { documentIds, documentGroupIds } from './document';

export const insurance = {
  id: documentGroupIds.insurance,
  name: 'Insurance',
  description: 'Home insurance documents',
  iconUri: '',
  owner: '',
  documentIds: [documentIds.homeInsurance],
};

export const warranty = {
  id: documentGroupIds.warranty,
  name: 'Home Warranty',
  description: 'Home warranty documents',
  iconUri: '',
  owner: '',
  documentIds: [documentIds.homeWarranty],
};

export const inspection = {
  id: documentGroupIds.inspection,
  name: 'Home Inspection Reports',
  description: 'Home inspections',
  iconUri: '',
  owner: '',
  documentIds: [documentIds.homeInspection],
};

export const manual = {
  id: documentGroupIds.manual,
  name: 'Manuals',
  description: 'Appliance manuals',
  iconUri: '',
  owner: '',
  documentIds: [documentIds.majorHomeAppliancesManual],
};

export const unnamed = {
  id: documentGroupIds.unnamed,
  name: 'Unnamed Category',
  // description: '',
  iconUri: '',
  owner: '',
  documentIds: [],
};

export default [insurance, warranty, inspection, manual, unnamed];
