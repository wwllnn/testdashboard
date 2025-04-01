// components/PDFDownloadButton.tsx
import { PDFDownloadLink } from '@react-pdf/renderer';
import ScoreReportPDF from './ScoreReportPDF';
import { TestScore } from '@/lib/store';


interface PDFDownloadButtonProps {
  selectedTest: TestScore,
  testDate: string,
  readingMap: [string, [number, number]][];
  mathMap: [string, [number, number]][];
}


const PDFDownloadButton = ({
  selectedTest,
  testDate,
  readingMap,
  mathMap
}: PDFDownloadButtonProps) => {

  return (
    <PDFDownloadLink
      document={
        <ScoreReportPDF
          studentName={selectedTest.name}
          scores={selectedTest.scores}
          testDate={testDate}
          readingMap={readingMap}
          mathMap={mathMap}
        />
      }
      fileName="SAT_Score_Report.pdf"
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      
      {({ loading }) => (
        loading ? 'Preparing PDF...' : 'Download PDF Summary')}
    </PDFDownloadLink>
  );
};
export default PDFDownloadButton;