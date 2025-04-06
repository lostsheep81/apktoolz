const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');
const logger = require('../../config/logger');

console.log('Using xml2js:', xml2js);

class ApkAnalysisService {
  async extractManifestData(decompiledDir) {
    const manifestPath = path.join(decompiledDir, 'AndroidManifest.xml');
    const manifestXml = fs.readFileSync(manifestPath, 'utf-8');
    
    // Use xml2js.parseString with a Promise wrapper
    const parser = new xml2js.Parser();
    const result = await new Promise((resolve, reject) => {
      parser.parseString(manifestXml, (err, parsedResult) => {
        if (err) {
          logger.error('Failed to parse AndroidManifest.xml:', err);
          return reject(new Error('Failed to parse AndroidManifest.xml'));
        }
        resolve(parsedResult);
      });
    });

    if (!result || !result.manifest) {
      throw new Error('Invalid manifest structure after parsing.');
    }

    const manifest = result.manifest;
    const packageName = manifest.$?.package;
    
    return {
      packageInfo: {
        packageName,
        versionCode: manifest.$?.['android:versionCode'],
        versionName: manifest.$?.['android:versionName'],
      },
      permissions: this._extractPermissions(manifest),
      components: {
        activities: this._extractComponents(manifest, 'activity'),
        services: this._extractComponents(manifest, 'service'),
        receivers: this._extractComponents(manifest, 'receiver'),
        providers: this._extractComponents(manifest, 'provider'),
      }
    };
  }

  _extractPermissions(manifest) {
    const permissions = manifest['uses-permission'] || [];
    return permissions.map(perm => perm.$?.['android:name']).filter(Boolean);
  }

  _extractComponents(manifest, componentType) {
    const application = manifest.application?.[0] || {};
    const components = application[componentType] || [];
    return components.map(comp => ({
      name: comp.$?.['android:name'],
      exported: comp.$?.['android:exported'] === 'true',
      permission: comp.$?.['android:permission']
    })).filter(comp => comp.name);
  }

  async analyzeResources(decompiledDir) {
    const resDir = path.join(decompiledDir, 'res');
    const assets = [];
    
    if (fs.existsSync(resDir)) {
      const resourceTypes = fs.readdirSync(resDir);
      for (const type of resourceTypes) {
        const typePath = path.join(resDir, type);
        if (fs.statSync(typePath).isDirectory()) {
          const files = fs.readdirSync(typePath);
          assets.push({
            type,
            count: files.length,
            items: files.slice(0, 10) // List first 10 items as sample
          });
        }
      }
    }

    return { assets };
  }

  generateRiskAssessment(manifest, resources) {
    const riskFactors = [];
    let riskScore = 0;

    // Check dangerous permissions
    const dangerousPermissions = [
      'android.permission.READ_CONTACTS',
      'android.permission.WRITE_CONTACTS',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.RECORD_AUDIO',
      'android.permission.CAMERA',
      'android.permission.READ_SMS',
      'android.permission.SEND_SMS'
    ];

    const suspiciousPermissions = manifest.permissions.filter(
      perm => dangerousPermissions.includes(perm)
    );

    if (suspiciousPermissions.length > 0) {
      riskFactors.push({
        type: 'dangerous_permissions',
        details: suspiciousPermissions
      });
      riskScore += suspiciousPermissions.length * 10;
    }

    // Check for exposed components
    const exposedComponents = Object.entries(manifest.components)
      .flatMap(([type, components]) => 
        components.filter(c => c.exported && !c.permission)
          .map(c => ({ type, name: c.name }))
      );

    if (exposedComponents.length > 0) {
      riskFactors.push({
        type: 'exposed_components',
        details: exposedComponents
      });
      riskScore += exposedComponents.length * 5;
    }

    return {
      riskScore: Math.min(100, riskScore),
      riskFactors
    };
  }
}

module.exports = new ApkAnalysisService();
