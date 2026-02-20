// Script to parse SQL file and generate TypeScript data structure for Nepal administrative divisions
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the SQL file
const sqlFilePath = 'd:\\epalika\\app\\Utils\\Sql\\address.sql';
const outputPath = path.join(__dirname, '../src/utils/nepalAdministrativeDivisions.ts');

console.log('Reading SQL file from:', sqlFilePath);

const sqlContent = fs.readFileSync(sqlFilePath, 'utf-8');

// Extract provinces data
const provincesMatch = sqlContent.match(/INSERT INTO `provinces`[^V]+VALUES\s+([\s\S]+?);/);
const provinces = [];

if (provincesMatch) {
  const provincesData = provincesMatch[1];
  const provinceRows = provincesData.match(/\((\d+),\s*'([^']+)',\s*'([^']+)',\s*'[^']+',\s*'[^']+',\s*NULL\)/g);
  
  if (provinceRows) {
    provinceRows.forEach(row => {
      const match = row.match(/\((\d+),\s*'([^']+)',\s*'([^']+)'/);
      if (match) {
        provinces.push({
          id: parseInt(match[1]),
          title: match[2],
          title_en: match[3],
          districts: []
        });
      }
    });
  }
}

console.log(`Found ${provinces.length} provinces`);

// Extract districts data
const districtsMatch = sqlContent.match(/INSERT INTO `districts`[^V]+VALUES\s+([\s\S]+?);/);
const districts = [];

if (districtsMatch) {
  const districtsData = districtsMatch[1];
  const districtRows = districtsData.match(/\((\d+),\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*'[^']+',\s*'[^']+',\s*NULL\)/g);
  
  if (districtRows) {
    districtRows.forEach(row => {
      const match = row.match(/\((\d+),\s*(\d+),\s*'([^']+)',\s*'([^']+)'/);
      if (match) {
        districts.push({
          id: parseInt(match[1]),
          province_id: parseInt(match[2]),
          title: match[3],
          title_en: match[4],
          localBodies: []
        });
      }
    });
  }
}

console.log(`Found ${districts.length} districts`);

// Extract local bodies data
const localBodiesMatch = sqlContent.matchAll(/INSERT INTO `local_bodies`[^V]+VALUES\s+([\s\S]+?);/g);
const localBodies = [];

for (const match of localBodiesMatch) {
  if (match && match[1]) {
    const localBodiesData = match[1];
    const localBodyRows = localBodiesData.match(/\(\d+,\s*\d+,\s*'[^']+',\s*'[^']+',\s*\d+,\s*'[^']+',\s*'[^']+',\s*NULL\)/g);
    
    if (localBodyRows) {
      localBodyRows.forEach(row => {
        const rowMatch = row.match(/\((\d+),\s*(\d+),\s*'([^']+)',\s*'([^']+)',\s*(\d+)/);
        if (rowMatch) {
          localBodies.push({
            id: parseInt(rowMatch[1]),
            district_id: parseInt(rowMatch[2]),
            title: rowMatch[3],
            title_en: rowMatch[4],
            wards: parseInt(rowMatch[5])
          });
        }
      });
    }
  }
}

console.log(`Found ${localBodies.length} local bodies`);

// Build hierarchical structure
localBodies.forEach(lb => {
  const district = districts.find(d => d.id === lb.district_id);
  if (district) {
    // Determine local body type
    let type = 'Rural Municipality';
    const titleEn = lb.title_en.toLowerCase();
    
    if (titleEn.includes('metropolitan')) {
      type = 'Metropolitan';
    } else if (titleEn.includes('sub-metropolitan')) {
      type = 'Sub-Metropolitan';
    } else if (titleEn.includes('municipality') && !titleEn.includes('rural')) {
      type = 'Municipality';
    }
    
    district.localBodies.push({
      name: lb.title_en,
      nameNepali: lb.title,
      type: type,
      wards: lb.wards
    });
  }
});

districts.forEach(district => {
  const province = provinces.find(p => p.id === district.province_id);
  if (province) {
    province.districts.push({
      name: district.title_en,
      nameNepali: district.title,
      localBodies: district.localBodies
    });
  }
});

// Generate TypeScript file content
let tsContent = `// Nepal Administrative Divisions Data - Complete Dataset
// Province → District → Local Body → Ward
// Data source: Official Nepal Government Administrative Structure

export interface LocalBody {
  name: string;
  nameNepali: string;
  type: 'Metropolitan' | 'Sub-Metropolitan' | 'Municipality' | 'Rural Municipality';
  wards: number; // Number of wards
}

export interface District {
  name: string;
  nameNepali: string;
  localBodies: LocalBody[];
}

export interface Province {
  name: string;
  nameNepali: string;
  districts: District[];
}

export const nepalAdministrativeDivisions: Province[] = [\n`;

provinces.forEach((province, pIdx) => {
  tsContent += `  {\n`;
  tsContent += `    name: '${province.title_en}',\n`;
  tsContent += `    nameNepali: '${province.title}',\n`;
  tsContent += `    districts: [\n`;
  
  province.districts.forEach((district, dIdx) => {
    tsContent += `      {\n`;
    tsContent += `        name: '${district.name}',\n`;
    tsContent += `        nameNepali: '${district.nameNepali}',\n`;
    tsContent += `        localBodies: [\n`;
    
    district.localBodies.forEach((lb, lbIdx) => {
      tsContent += `          { name: '${lb.name}', nameNepali: '${lb.nameNepali}', type: '${lb.type}', wards: ${lb.wards} }`;
      if (lbIdx < district.localBodies.length - 1) {
        tsContent += ',\n';
      } else {
        tsContent += '\n';
      }
    });
    
    tsContent += `        ]\n`;
    tsContent += `      }`;
    if (dIdx < province.districts.length - 1) {
      tsContent += ',\n';
    } else {
      tsContent += '\n';
    }
  });
  
  tsContent += `    ]\n`;
  tsContent += `  }`;
  if (pIdx < provinces.length - 1) {
    tsContent += ',\n';
  } else {
    tsContent += '\n';
  }
});

tsContent += `];\n`;

// Write to file
fs.writeFileSync(outputPath, tsContent, 'utf-8');

console.log(`\n✅ Successfully generated TypeScript data file!`);
console.log(`Output: ${outputPath}`);
console.log(`\nStatistics:`);
console.log(`- Provinces: ${provinces.length}`);
console.log(`- Districts: ${districts.length}`);
console.log(`- Local Bodies: ${localBodies.length}`);

// Print summary by province
console.log(`\nBreakdown by Province:`);
provinces.forEach(province => {
  const districtCount = province.districts.length;
  const localBodyCount = province.districts.reduce((sum, d) => sum + d.localBodies.length, 0);
  console.log(`  ${province.title_en}: ${districtCount} districts, ${localBodyCount} local bodies`);
});
