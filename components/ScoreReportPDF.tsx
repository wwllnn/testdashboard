// components/ScoreReportPDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
import { TestScore } from '@/lib/store';

const styles = StyleSheet.create({
  page: { padding: 28, fontSize: 9, fontFamily: 'Helvetica' },
  heading: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  subheading: { fontSize: 10, fontWeight: 'bold', marginBottom: 4, color: '#1f4e79' },
  scoreBox: { fontSize: 22, fontWeight: 'bold', color: '#1a1a1a' },
  rangeText: { fontSize: 8, color: '#666' },
  section: { marginBottom: 12 },
  smallBox: { fontSize: 9, marginBottom: 2 },
  tableContainer: { border: '1 solid #ccc', borderRadius: 4, padding: 4, marginBottom: 6 },
  tableHeader: { flexDirection: 'row', borderBottom: '1 solid #ccc', marginBottom: 3, paddingBottom: 1 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1 },
  cell: { width: '33%' },
  scoreSummaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  scoreSummaryBox: { flex: 1, border: '1 solid #ccc', borderRadius: 4, padding: 6 },
  sideBySide: { flexDirection: 'row', gap: 6 },
  sideBox: { flex: 1, border: '1 solid #ccc', borderRadius: 4, padding: 6 },
});

const TopicBreakdown = ({ label, topics }: { label: string; topics: [string, [number, number]][] }) => (
  <View style={styles.section}>
    <Text style={styles.subheading}>{label}</Text>
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Topic</Text>
        <Text style={styles.cell}>Correct</Text>
        <Text style={styles.cell}>%</Text>
      </View>
      {topics.map(([topic, [total, correct]]) => {
        const safeTotal = total || 0;
        const safeCorrect = correct || 0;
        const percent = safeTotal === 0 ? 0 : Math.round((safeCorrect / safeTotal) * 100);
        return (
          <View key={topic} style={styles.tableRow}>
            <Text style={styles.cell}>{topic}</Text>
            <Text style={styles.cell}>{safeCorrect} / {safeTotal}</Text>
            <Text style={styles.cell}>{percent}%</Text>
          </View>
        );
      })}
    </View>
  </View>
);

const ScoreReportPDF = ({
  studentName,
  scores,
  testDate,
  readingMap,
  mathMap,
}: {
  studentName: string;
  scores: number[];
  testDate: string;
  readingMap: [string, [number, number]][];
  mathMap: [string, [number, number]][];
}) => {
  const totalCorrect = [...readingMap, ...mathMap].reduce((sum, [_, [, correct]]) => sum + correct, 0);
  const totalQuestions = [...readingMap, ...mathMap].reduce((sum, [_, [total]]) => sum + total, 0);

  const readingCorrect = readingMap.reduce((sum, [_, [, correct]]) => sum + correct, 0);
  const readingTotal = readingMap.reduce((sum, [_, [total]]) => sum + total, 0);
  const mathCorrect = mathMap.reduce((sum, [_, [, correct]]) => sum + correct, 0);
  const mathTotal = mathMap.reduce((sum, [_, [total]]) => sum + total, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Your Practice Score Report</Text>

        <View style={styles.section}>
          <Text>Name: {studentName}</Text>
          <Text style={{ marginTop: 2 }}>Date: {testDate}</Text>
        </View>

        {/* Combined Score Summary Row */}
        <View style={[styles.section, styles.scoreSummaryRow]}>
          <View style={styles.scoreSummaryBox}>
            <Text style={styles.subheading}>TOTAL SCORE</Text>
            <Text style={styles.scoreBox}>{scores[5]}</Text>
            <Text style={styles.rangeText}>400–1600</Text>
          </View>
          <View style={styles.scoreSummaryBox}>
            <Text style={styles.subheading}>SECTION SCORES</Text>
            <Text style={styles.smallBox}>Reading & Writing: {scores[3]}</Text>
            <Text style={styles.smallBox}>Math: {scores[4]}</Text>
          </View>
          <View style={styles.scoreSummaryBox}>
            <Text style={styles.subheading}>SCORE DETAILS</Text>
            <Text style={styles.smallBox}>Correct: {totalCorrect}</Text>
            <Text style={styles.smallBox}>Total: {totalQuestions}</Text>
            <Text style={styles.smallBox}>Incorrect: {totalQuestions - totalCorrect}</Text>
          </View>
        </View>

        {/* Side-by-side Section Details */}
        <View style={[styles.section, styles.sideBySide]}>
          <View style={styles.sideBox}>
            <Text style={styles.subheading}>Reading and Writing</Text>
            <Text style={styles.smallBox}>Correct: {readingCorrect}</Text>
            <Text style={styles.smallBox}>Total: {readingTotal}</Text>
            <Text style={styles.smallBox}>Incorrect: {readingTotal - readingCorrect}</Text>
          </View>

          <View style={styles.sideBox}>
            <Text style={styles.subheading}>Math</Text>
            <Text style={styles.smallBox}>Correct: {mathCorrect}</Text>
            <Text style={styles.smallBox}>Total: {mathTotal}</Text>
            <Text style={styles.smallBox}>Incorrect: {mathTotal - mathCorrect}</Text>
          </View>
        </View>

        <TopicBreakdown label="Reading and Writing Skills" topics={readingMap} />
        <TopicBreakdown label="Math Skills" topics={mathMap} />
      </Page>
    </Document>
  );
};

export default ScoreReportPDF;
