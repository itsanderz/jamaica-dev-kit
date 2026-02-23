# Healthcare

Build health information systems, facility directories, and patient management platforms.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-health` | Hospitals, health centres, RHAs |
| `jamaica-emergency` | Emergency services & shelters |
| `jamaica-parishes` | Parish-based health zones |
| `jamaica-open-data` | Live health datasets |
| `jamaica-phone` | Patient contact validation |
| `jamaica-trn` | Patient TRN validation |

## Health Facility Directory

```typescript
import {
  getHealthFacilities,
  getHospitals,
  getHealthCentresByParish,
  getRegionalAuthority,
  searchHealthFacilities,
  getNearestFacility,
} from 'jamaica-health';

// All facilities
const facilities = getHealthFacilities();

// Hospitals only
const hospitals = getHospitals();

// Health centres in a parish
const kgnCentres = getHealthCentresByParish('Kingston');

// Regional Health Authority
const rha = getRegionalAuthority('Kingston');
// { id: "serha", name: "South East Regional Health Authority", ... }

// Search
const results = searchHealthFacilities('university hospital');

// Find nearest facility to coordinates
const nearest = getNearestFacility(18.0179, -76.8099);
```

## Emergency Services

```typescript
import {
  getEmergencyNumbers,
  getPoliceStationsByParish,
  getFireStationsByParish,
  getDisasterShelters,
  getSheltersByParish,
} from 'jamaica-emergency';

// Emergency contacts
const numbers = getEmergencyNumbers();
// { police: "119", fire: "110", ambulance: "110", ... }

// Police stations in a parish
const stations = getPoliceStationsByParish('St. Andrew');

// Disaster shelters
const shelters = getSheltersByParish('Portland');
```

## Health Dashboard by Parish

```typescript
import { getAllParishes } from 'jamaica-parishes';
import { getHealthFacilitiesByParish, getHospitalsByParish } from 'jamaica-health';
import { getPoliceStationsByParish } from 'jamaica-emergency';

function getParishHealthProfile(parishName: string) {
  return {
    parish: parishName,
    facilities: getHealthFacilitiesByParish(parishName).length,
    hospitals: getHospitalsByParish(parishName).length,
    policeStations: getPoliceStationsByParish(parishName).length,
  };
}

// Generate report for all parishes
const report = getAllParishes().map(p => getParishHealthProfile(p.name));
```

## Live Health Data from Open Data Portal

```typescript
import { getHealthCentres } from 'jamaica-open-data';

// Fetch live health centre data with geospatial info
const centres = await getHealthCentres({ parish: 'Kingston' });

for (const centre of centres) {
  console.log(`${centre.CEN_NAME}`);
  console.log(`  Address: ${centre.ADDRESS}`);
  console.log(`  Phone: ${centre.TELEPHONE}`);
  console.log(`  Location: ${centre.Latitude}, ${centre.Longitude}`);
}
```

## Patient Registration

```typescript
import { isValidTRN } from 'jamaica-trn';
import { isValidJamaicanNumber, formatE164 } from 'jamaica-phone';

function registerPatient(data: {
  trn: string;
  phone: string;
  parish: string;
  emergencyContact: string;
}) {
  // Validate TRN
  if (!isValidTRN(data.trn)) {
    throw new Error('Invalid patient TRN');
  }

  // Validate phone numbers
  if (!isValidJamaicanNumber(data.phone)) {
    throw new Error('Invalid patient phone');
  }
  if (!isValidJamaicanNumber(data.emergencyContact)) {
    throw new Error('Invalid emergency contact phone');
  }

  return {
    ...data,
    phone: formatE164(data.phone),
    emergencyContact: formatE164(data.emergencyContact),
  };
}
```
