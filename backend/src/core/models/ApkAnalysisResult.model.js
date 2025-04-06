const mongoose = require('mongoose');
const { Schema } = mongoose;

const ApkAnalysisResultSchema = new Schema({
  userId: { type: String, required: true },
  apkName: { type: String, required: true },
  apkHash: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Queued', 'Processing', 'Analyzed', 'Failed'], required: true },
  outputPath: { type: String },
  errorDetails: { type: String },
  aiAnalysis: {
    timestamp: Date,
    progress: String,
    manifestData: {
      packageInfo: {
        packageName: String,
        versionCode: String,
        versionName: String
      },
      permissions: [String],
      components: {
        activities: [{
          name: String,
          exported: Boolean,
          permission: String
        }],
        services: [{
          name: String,
          exported: Boolean,
          permission: String
        }],
        receivers: [{
          name: String,
          exported: Boolean,
          permission: String
        }],
        providers: [{
          name: String,
          exported: Boolean,
          permission: String
        }]
      }
    },
    resourceData: {
      assets: [{
        type: String,
        count: Number,
        items: [String]
      }]
    },
    riskAssessment: {
      riskScore: Number,
      riskFactors: [{
        type: String,
        details: mongoose.Schema.Types.Mixed
      }]
    },
    analysisComplete: Boolean
  }
}, { timestamps: true });

module.exports = mongoose.model('ApkAnalysisResult', ApkAnalysisResultSchema);