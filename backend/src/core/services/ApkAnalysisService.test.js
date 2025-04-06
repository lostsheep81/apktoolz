jest.mock('xml2js', () => {
  return {
    Parser: function() {
      this.parseString = (xml, callback) => {
        callback(null, {
          manifest: {
            $: {
              package: 'com.example.app',
              'android:versionCode': '1',
              'android:versionName': '1.0'
            },
            'uses-permission': [
              { $: { 'android:name': 'android.permission.INTERNET' } },
              { $: { 'android:name': 'android.permission.CAMERA' } }
            ],
            application: [{
              activity: [
                { 
                  $: { 
                    'android:name': 'com.example.MainActivity',
                    'android:exported': 'true'
                  }
                }
              ],
              service: [
                {
                  $: {
                    'android:name': 'com.example.BackgroundService',
                    'android:exported': 'false'
                  }
                }
              ]
            }]
          }
        });
      };
    }
  };
});

console.log('Updated xml2js mock applied.');

const fs = require('fs');
const path = require('path');
const ApkAnalysisService = require('./ApkAnalysisService');

jest.mock('fs');

describe('ApkAnalysisService', () => {
  const mockDecompiledDir = '/path/to/decompiled';
  
  beforeEach(() => {
    jest.clearAllMocks();
    fs.readFileSync.mockReturnValue('mock manifest content');
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValueOnce(['drawable', 'layout'])
      .mockReturnValueOnce(['icon.png', 'logo.png'])
      .mockReturnValueOnce(['main.xml']);
    fs.statSync.mockReturnValue({ isDirectory: () => true });
  });

  describe('extractManifestData', () => {
    it('should extract package info and components from manifest', async () => {
      const result = await ApkAnalysisService.extractManifestData(mockDecompiledDir);
      
      expect(result.packageInfo).toEqual({
        packageName: 'com.example.app',
        versionCode: '1',
        versionName: '1.0'
      });
      
      expect(result.permissions).toContain('android.permission.INTERNET');
      expect(result.permissions).toContain('android.permission.CAMERA');
      
      expect(result.components.activities[0]).toEqual({
        name: 'com.example.MainActivity',
        exported: true,
        permission: undefined
      });
      
      expect(result.components.services[0]).toEqual({
        name: 'com.example.BackgroundService',
        exported: false,
        permission: undefined
      });
    });
  });

  describe('analyzeResources', () => {
    it('should analyze resource directories and files', async () => {
      const result = await ApkAnalysisService.analyzeResources(mockDecompiledDir);
      
      expect(result.assets).toEqual([
        {
          type: 'drawable',
          count: 2,
          items: ['icon.png', 'logo.png']
        },
        {
          type: 'layout',
          count: 1,
          items: ['main.xml']
        }
      ]);
    });
  });

  describe('generateRiskAssessment', () => {
    it('should identify dangerous permissions and exposed components', () => {
      const manifestData = {
        permissions: ['android.permission.CAMERA', 'android.permission.INTERNET'],
        components: {
          activities: [{ name: 'MainActivity', exported: true }],
          services: [{ name: 'Service', exported: false }]
        }
      };
      
      const result = ApkAnalysisService.generateRiskAssessment(manifestData, {});
      
      expect(result.riskScore).toBeGreaterThan(0);
      expect(result.riskFactors).toEqual(expect.arrayContaining([
        expect.objectContaining({
          type: 'dangerous_permissions',
          details: expect.arrayContaining(['android.permission.CAMERA'])
        }),
        expect.objectContaining({
          type: 'exposed_components',
          details: expect.arrayContaining([
            expect.objectContaining({
              type: 'activities',
              name: 'MainActivity'
            })
          ])
        })
      ]));
    });
  });
});

describe('xml2js Parser mock', () => {
  it('should have a parseString method', () => {
    const parser = new (require('xml2js').Parser)();
    console.log('Parser instance:', parser);
    expect(typeof parser.parseString).toBe('function');
  });
});