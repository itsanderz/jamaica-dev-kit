# Education

Build education platforms, school directories, and student management systems for Jamaica.

## Packages You'll Use

| Package | Purpose |
|---------|---------|
| `jamaica-schools` | 1,650+ schools & universities |
| `jamaica-parishes` | Parish data for geographic filtering |
| `jamaica-holidays` | School calendar & holiday planning |
| `jamaica-trn` | Student/teacher TRN validation |
| `jamaica-phone` | Contact number validation |

## School Directory

```typescript
import {
  getSchools,
  getSchoolsByParish,
  getSchoolsByType,
  getSchoolsByLevel,
  getUniversities,
  searchSchools,
  getSchoolCount,
} from 'jamaica-schools';

// All schools
const schools = getSchools();
console.log(`Total: ${getSchoolCount()} schools`);

// Filter by parish
const kgnSchools = getSchoolsByParish('Kingston');

// Filter by type
const secondary = getSchoolsByType('secondary');
const primary = getSchoolsByType('primary');

// Filter by level
const tertiary = getSchoolsByLevel('tertiary');

// Universities
const universities = getUniversities();
// UWI, UTech, NCU, CMU, Mico, etc.

// Search
const results = searchSchools('Kingston College');
```

## School Finder by Parish

```typescript
import { getSchoolsByParish, getSchoolCountByParish } from 'jamaica-schools';
import { getAllParishes } from 'jamaica-parishes';

function getSchoolReport() {
  const parishes = getAllParishes();
  return parishes.map(parish => {
    const counts = getSchoolCountByParish(parish.name);
    return {
      parish: parish.name,
      population: parish.population,
      schools: counts,
      ratio: parish.population ? Math.round(parish.population / counts) : null,
    };
  });
}
```

## Academic Calendar

```typescript
import { getHolidays, isPublicHoliday, getWorkingDays } from 'jamaica-holidays';

// Get holidays for the school year
const holidays2025 = getHolidays(2025);

// Calculate teaching days in a term
const term1Start = '2025-09-01';
const term1End = '2025-12-12';
const teachingDays = getWorkingDays(term1Start, term1End);
console.log(`Term 1: ${teachingDays} teaching days`);

// Check if school is in session
function isSchoolDay(date: string): boolean {
  const d = new Date(date);
  const dayOfWeek = d.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return false;
  if (isPublicHoliday(date)) return false;
  return true;
}
```

## Student Registration

```typescript
import { isValidTRN, formatTRN } from 'jamaica-trn';
import { isValidJamaicanNumber } from 'jamaica-phone';
import { getSchool } from 'jamaica-schools';

interface StudentRegistration {
  name: string;
  trn: string;
  guardianPhone: string;
  school: string;
  parish: string;
}

function validateRegistration(data: StudentRegistration) {
  const errors: string[] = [];

  if (!isValidTRN(data.trn)) {
    errors.push('Invalid student TRN');
  }

  if (!isValidJamaicanNumber(data.guardianPhone)) {
    errors.push('Invalid guardian phone number');
  }

  const school = getSchool(data.school);
  if (!school) {
    errors.push('School not found in registry');
  }

  return { valid: errors.length === 0, errors };
}
```
