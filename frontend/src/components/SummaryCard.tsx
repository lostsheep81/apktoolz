import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAnalysisStore } from '../store/analysisStore';

interface InfoCardProps {
  icon: string;
  iconColor: string;
  title: string;
  items: { label: string; value: string | number }[];
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, iconColor, title, items }) => (
  <View style={styles.infoCard}>
    <View style={styles.cardHeader}>
      <Icon name={icon} size={16} color={iconColor} style={styles.cardIcon} />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    {items.map((item, index) => (
      <Text key={index} style={styles.infoText}>
        {item.label}: <Text style={styles.infoValue}>{item.value}</Text>
      </Text>
    ))}
  </View>
);

const formatNumberWithCommas = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const SummaryCard: React.FC = () => {
  const { currentAnalysis } = useAnalysisStore();

  if (!currentAnalysis?.aiAnalysis) {
    return null;
  }

  const getStatusStyle = () => {
    switch (currentAnalysis.status) {
      case 'Analyzed':
        return { backgroundColor: '#E6FFE6', color: '#006600' };
      case 'Failed':
        return { backgroundColor: '#FFE6E6', color: '#CC0000' };
      case 'Processing':
      case 'Queued':
        return { backgroundColor: '#E6F3FF', color: '#0066CC' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const { aiAnalysis } = currentAnalysis;
  const statusStyles = getStatusStyle();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Analysis Summary</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusStyles.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyles.color }]}>
            {currentAnalysis.status}
          </Text>
          {['Processing', 'Queued'].includes(currentAnalysis.status) && (
            <View style={[styles.spinner, { borderColor: statusStyles.color }]} />
          )}
        </View>
      </View>

      <View style={styles.grid}>
        <InfoCard
          icon="shield"
          iconColor="#3B82F6"
          title="Security"
          items={[
            { label: 'Risk Score', value: `${aiAnalysis.riskScore}/10` },
            { label: 'Vulnerabilities', value: aiAnalysis.vulnerabilities.length },
            { label: 'Suspicious Permissions', value: aiAnalysis.suspiciousPermissions.length },
          ]}
        />

        <InfoCard
          icon="code"
          iconColor="#10B981"
          title="Code Analysis"
          items={[
            { label: 'Patterns Detected', value: aiAnalysis.detectedPatterns.length },
            { label: 'Manifest Analyzed', value: aiAnalysis.manifestAnalyzed ? 'Yes' : 'No' },
            { label: 'Analysis Complete', value: aiAnalysis.analysisComplete ? 'Yes' : 'No' },
          ]}
        />

        <InfoCard
          icon="clock-o"
          iconColor="#F59E0B"
          title="Timing"
          items={[
            { label: 'Created', value: new Date(currentAnalysis.createdAt).toLocaleString() },
            { label: 'Updated', value: new Date(currentAnalysis.updatedAt).toLocaleString() },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderTopColor: 'transparent',
    marginLeft: 8,
    transform: [{ rotate: '45deg' }],
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoCard: {
    flex: 1,
    minWidth: 250,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    margin: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 4,
  },
  infoValue: {
    color: '#1F2937',
    fontWeight: '500',
  },
});

export default SummaryCard;