import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAnalysisStore } from '../store/analysisStore';
import CollapsibleSection from './CollapsibleSection';

interface DetailRowProps {
  label: string;
  value: string | number;
  icon?: string;
  iconColor?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ label, value, icon, iconColor = '#3B82F6' }) => (
  <View style={styles.detailRow}>
    {icon && <Icon name={icon} size={16} color={iconColor} style={styles.detailIcon} />}
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const AISuggestion: React.FC<{ suggestion: string }> = ({ suggestion }) => (
  <View style={styles.aiSuggestion}>
    <Icon name="lightbulb-o" size={20} color="#3B82F6" style={styles.suggestionIcon} />
    <View style={styles.suggestionContent}>
      <Text style={styles.suggestionTitle}>AI Suggestion</Text>
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </View>
  </View>
);

const AnalysisDetails: React.FC = () => {
  const { currentAnalysis } = useAnalysisStore();

  if (!currentAnalysis?.aiAnalysis) {
    return null;
  }

  const { aiAnalysis } = currentAnalysis;

  return (
    <ScrollView style={styles.container}>
      <CollapsibleSection
        icon="shield"
        iconColor="#3B82F6"
        title="Security Analysis"
      >
        <View>
          <Text style={styles.sectionTitle}>Vulnerabilities</Text>
          {aiAnalysis.vulnerabilities.length > 0 ? (
            aiAnalysis.vulnerabilities.map((vulnerability, index) => (
              <View key={index} style={styles.vulnerabilityItem}>
                <Icon name="exclamation-triangle" size={16} color="#EF4444" style={styles.vulnerabilityIcon} />
                <Text style={styles.vulnerabilityText}>{vulnerability}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyState}>No vulnerabilities detected</Text>
          )}

          <Text style={styles.sectionTitle}>Suspicious Permissions</Text>
          {aiAnalysis.suspiciousPermissions.length > 0 ? (
            aiAnalysis.suspiciousPermissions.map((permission, index) => (
              <DetailRow
                key={index}
                label={permission}
                value="High Risk"
                icon="warning"
                iconColor="#F59E0B"
              />
            ))
          ) : (
            <Text style={styles.emptyState}>No suspicious permissions found</Text>
          )}

          <AISuggestion suggestion="Consider reviewing and potentially removing high-risk permissions that aren't essential for core functionality." />
        </View>
      </CollapsibleSection>

      <CollapsibleSection
        icon="code"
        iconColor="#10B981"
        title="Code Patterns"
      >
        <View>
          <Text style={styles.sectionTitle}>Detected Patterns</Text>
          {aiAnalysis.detectedPatterns.length > 0 ? (
            aiAnalysis.detectedPatterns.map((pattern, index) => (
              <DetailRow
                key={index}
                label={`Pattern ${index + 1}`}
                value={pattern}
                icon="code"
                iconColor="#10B981"
              />
            ))
          ) : (
            <Text style={styles.emptyState}>No patterns detected</Text>
          )}

          <AISuggestion suggestion="Review detected code patterns for potential security or performance improvements." />
        </View>
      </CollapsibleSection>

      <CollapsibleSection
        icon="clock-o"
        iconColor="#F59E0B"
        title="Analysis Timeline"
      >
        <View>
          <DetailRow
            label="Analysis Started"
            value={new Date(currentAnalysis.createdAt).toLocaleString()}
            icon="calendar"
          />
          <DetailRow
            label="Last Updated"
            value={new Date(currentAnalysis.updatedAt).toLocaleString()}
            icon="clock-o"
          />
          <DetailRow
            label="Status"
            value={currentAnalysis.status}
            icon="info-circle"
          />
          {currentAnalysis.errorDetails && (
            <View style={styles.errorDetails}>
              <Icon name="exclamation-circle" size={16} color="#EF4444" style={styles.errorIcon} />
              <Text style={styles.errorText}>{currentAnalysis.errorDetails}</Text>
            </View>
          )}
        </View>
      </CollapsibleSection>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailIcon: {
    marginRight: 8,
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  vulnerabilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  vulnerabilityIcon: {
    marginRight: 8,
  },
  vulnerabilityText: {
    flex: 1,
    fontSize: 14,
    color: '#991B1B',
  },
  emptyState: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginVertical: 8,
  },
  aiSuggestion: {
    flexDirection: 'row',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  suggestionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  suggestionText: {
    fontSize: 14,
    color: '#4B5563',
  },
  errorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  errorIcon: {
    marginRight: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: '#991B1B',
  },
});

export default AnalysisDetails;