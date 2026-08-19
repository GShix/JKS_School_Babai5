
import React from 'react';
import type { SchoolProfile } from '../../api/types';

interface FeeItem {
  categoryName: string;
  amount: number;
}

interface ReceiptData {
  receiptNumber: string;
  date: string;
  student: {
    fullName: string;
    currentClass: string;
    section: string;
    rollNumber: string;
    emisId?: string;
  };
  feeItems: FeeItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  scholar?: number;
  penal?: number;
  tax?: number;
  paymentMethod: string;
  bankName?: string;
  referenceNumber?: string;
  collectedBy?: string;
  remarks?: string;
  month?: string;
  session?: string;
}

interface FeeReceiptProps {
  schoolProfile: SchoolProfile | null;
  receiptData: ReceiptData;
}

export const FeeReceipt: React.FC<FeeReceiptProps> = ({ schoolProfile, receiptData }) => {
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB').replace(/\//g, '/');
  };

  const numberToWords = (num: number): string => {
    if (num === 0) return 'zero only';

    const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    const convertLessThanThousand = (n: number): string => {
      if (n === 0) return '';
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
      return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
    };

    const integer = Math.floor(num);
    const decimal = Math.round((num - integer) * 100);

    let result = '';

    if (integer >= 10000000) {
      const crores = Math.floor(integer / 10000000);
      const remainder = integer % 10000000;
      result = convertLessThanThousand(crores) + ' crore';
      if (remainder > 0) {
        const lakhs = Math.floor(remainder / 100000);
        const rest = remainder % 100000;
        if (lakhs > 0) result += ' ' + convertLessThanThousand(lakhs) + ' lakh';
        if (rest >= 1000) {
          const thousands = Math.floor(rest / 1000);
          const lastPart = rest % 1000;
          result += ' ' + convertLessThanThousand(thousands) + ' thousand';
          if (lastPart > 0) result += ' ' + convertLessThanThousand(lastPart);
        } else if (rest > 0) {
          result += ' ' + convertLessThanThousand(rest);
        }
      }
    } else if (integer >= 100000) {
      const lakhs = Math.floor(integer / 100000);
      const remainder = integer % 100000;
      result = convertLessThanThousand(lakhs) + ' lakh';
      if (remainder >= 1000) {
        const thousands = Math.floor(remainder / 1000);
        const rest = remainder % 1000;
        result += ' ' + convertLessThanThousand(thousands) + ' thousand';
        if (rest > 0) result += ' ' + convertLessThanThousand(rest);
      } else if (remainder > 0) {
        result += ' ' + convertLessThanThousand(remainder);
      }
    } else if (integer >= 1000) {
      const thousands = Math.floor(integer / 1000);
      const remainder = integer % 1000;
      result = convertLessThanThousand(thousands) + ' thousand';
      if (remainder > 0) result += ' ' + convertLessThanThousand(remainder);
    } else {
      result = convertLessThanThousand(integer);
    }

    // Add decimal part
    if (decimal > 0) {
      result += ' and ' + decimal + ' paisa';
    }

    return result.trim() + ' only.';
  };

  return (
    <div id="receipt-content" className="receipt-container bg-white text-black" style={{ width: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* Header Section */}
      <div className="receipt-header border-2 border-gray-800 p-3">
        <div className="flex items-start justify-between gap-4 mb-2">
          {/* School Logo */}
          <div className="shrink-0">
            {schoolProfile?.logoUrl ? (
              <img
                src={schoolProfile.logoUrl}
                alt="School Logo"
                className="w-16 h-16 object-contain"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded-full">
                <span className="text-gray-600 text-xs">Logo</span>
              </div>
            )}
          </div>

          {/* School Details */}
          <div className="flex-1 text-center">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              {schoolProfile?.schoolName || 'School Name'}
            </h1>
            {schoolProfile?.schoolNameNepali && (
              <p className="text-base text-gray-700">{schoolProfile.schoolNameNepali}</p>
            )}
            <p className="text-xs text-gray-600 mt-1">
              {schoolProfile?.address || 'School Address'}
              {/* {schoolProfile?.ward && ` - ${schoolProfile.ward}`}
              {schoolProfile?.municipality && `, ${schoolProfile.municipality}`}
              {schoolProfile?.district && `, ${schoolProfile.district}`} */}
            </p>
            <p className="text-xs text-gray-600">
              Tel: {schoolProfile?.phone || 'N/A'}
            </p>
            <p className="text-xs text-gray-600">
              Email: {schoolProfile?.email || 'N/A'}
            </p>
            {schoolProfile?.website && (
              <p className="text-xs text-gray-600">Website: {schoolProfile.website}</p>
            )}
          </div>

          {/* Registration Details */}
          <div className="shrink-0 text-right text-xs">
            {schoolProfile?.panNumber && (
              <p className="text-gray-700">
                <span className="font-semibold">PAN:</span> {schoolProfile.panNumber}
              </p>
            )}
            {schoolProfile?.registrationNumber && (
              <p className="text-gray-700">
                <span className="font-semibold">Regd:</span> {schoolProfile.registrationNumber}
              </p>
            )}
          </div>
        </div>

        {/* Receipt Title and Number - Single Line */}
        <div className="border-t-2 border-gray-800 mt-2 pt-2 flex justify-between items-center">
          <h2 className="text-lg font-bold">Receipt</h2>
          <div className="text-xs flex gap-6">
            <span><span className="font-semibold">Bill No:</span> {receiptData.receiptNumber}</span>
            <span><span className="font-semibold">Date:</span> {formatDate(receiptData.date)}</span>
          </div>
        </div>
      </div>

      {/* Student Details - Horizontal Line */}
      <div className="border-x-2 border-b-2 border-gray-800 px-3 py-2">
        <div className="flex items-center gap-6 text-xs">
          <div>
            <span className="font-semibold">Name:</span> <span className="uppercase">{receiptData.student.fullName}</span>
          </div>
          <div>
            <span className="font-semibold">Class:</span> <span className="uppercase">{receiptData.student.currentClass}</span>
          </div>
          <div>
            <span className="font-semibold">Roll No:</span> {receiptData.student.rollNumber}
          </div>
          <div>
            <span className="font-semibold">Sec:</span> {receiptData.student.section}
          </div>
          {receiptData.month && (
            <div>
              <span className="font-semibold">Month:</span> {receiptData.month}
            </div>
          )}
        </div>
      </div>

      {/* Fee Details Table */}
      <table className="w-full border-x-2 border-b-2 border-gray-800 text-xs">
        <thead>
          <tr className="border-b-2 border-gray-800 bg-gray-50">
            <th className="border-r-2 border-gray-800 py-2 px-2 text-left w-12">SN</th>
            <th className="border-r-2 border-gray-800 py-2 px-3 text-left">Fee Descriptions</th>
            <th className="py-2 px-3 text-right w-28">Amount Rs</th>
          </tr>
        </thead>
        <tbody>
          {receiptData.feeItems.map((item, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center">{index + 1}</td>
              <td className="border-r-2 border-gray-800 py-1.5 px-3">{item.categoryName}</td>
              <td className="py-1.5 px-3 text-right">{formatCurrency(item.amount)}</td>
            </tr>
          ))}

          {/* Empty rows for spacing */}
          {[...Array(Math.max(0, 5 - receiptData.feeItems.length))].map((_, i) => (
            <tr key={`empty-${i}`} className="border-b border-gray-300">
              <td className="border-r-2 border-gray-800 py-1.5 px-2">&nbsp;</td>
              <td className="border-r-2 border-gray-800 py-1.5 px-3">&nbsp;</td>
              <td className="py-1.5 px-3">&nbsp;</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals Section */}
      <div className="border-x-2 border-b-2 border-gray-800">
        <table className="w-full text-xs">
          <tbody>
            <tr className="border-b-2 border-gray-800 bg-gray-50">
              <td className="border-r-2 border-gray-800 py-2 px-3 font-bold w-1/2">
                Total Bill: {formatCurrency(receiptData.totalAmount)}
              </td>
              <td className="border-r-2 border-gray-800 py-2 px-3 font-bold text-center">Total</td>
              <td className="py-2 px-3 text-right font-bold w-28">{formatCurrency(receiptData.totalAmount)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="p-0">
                <table className="w-full text-xs">
                  <tbody>
                    <tr className="border-b border-gray-300">
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center w-1/5">Scholarship</td>
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center w-1/5">Penalties</td>
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center w-1/5">Tax</td>
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center w-1/5">Paid</td>
                      <td className="py-1.5 px-2 text-center w-1/5">Balance Due</td>
                    </tr>
                    <tr className="font-bold">
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center">{formatCurrency(receiptData.scholar || 0)}</td>
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center">{formatCurrency(receiptData.penal || 0)}</td>
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center">{formatCurrency(receiptData.tax || 0)}</td>
                      <td className="border-r-2 border-gray-800 py-1.5 px-2 text-center">{formatCurrency(receiptData.paidAmount)}</td>
                      <td className="py-1.5 px-2 text-center text-red-600">{formatCurrency(receiptData.dueAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Amount in Words */}
      <div className="border-x-2 border-b-2 border-gray-800 px-3 py-2 text-xs">
        <span className="capitalize italic">
          {numberToWords(parseFloat(receiptData.paidAmount?.toString() || '0'))}
        </span>
      </div>

      {/* Payment Details */}
      {(receiptData.paymentMethod || receiptData.bankName || receiptData.referenceNumber) && (
        <div className="border-x-2 border-b-2 border-gray-800 px-3 py-1.5 text-xs">
          <span className="font-semibold">Payment Method:</span> {(receiptData.paymentMethod || 'CASH').replace('_', ' ').toUpperCase()}
          {receiptData.bankName && ` | Bank: ${receiptData.bankName}`}
          {receiptData.referenceNumber && ` | Ref: ${receiptData.referenceNumber}`}
        </div>
      )}

      {/* Remarks */}
      {receiptData.remarks && receiptData.remarks.trim() && (
        <div className="border-x-2 border-b-2 border-gray-800 px-3 py-1.5 text-xs">
          <span className="font-semibold">Remarks:</span> {receiptData.remarks}
        </div>
      )}

      {/* Footer */}
      <div className="border-x-2 border-b-2 border-gray-800 bg-sky-100 px-3 py-2.5">
        <div className="flex justify-between items-center text-xs">
          <div className="w-1/3">
            <p className="font-bold">E & O E</p>
            {receiptData.collectedBy && (
              <p className="text-[10px] mt-1">Collected by: {receiptData.collectedBy}</p>
            )}
          </div>
          <div className="w-1/3 text-center">
            <p className="font-bold">Thanks of your kind cooperation.</p>
          </div>
          <div className="w-1/3 text-right">
            <p className="font-bold mb-1">Received by</p>
            <div className="border-t-2 border-gray-800 mt-6 pt-0.5 text-center">
              <span className="text-[10px]">Signature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          /* Ensure single page */
          html, body {
            height: auto !important;
            overflow: visible !important;
          }
          
          /* Receipt sizing */
          #receipt-content {
            width: 100% !important;
            max-width: 210mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            page-break-after: avoid !important;
            page-break-before: avoid !important;
          }
          
          /* Prevent page breaks within receipt */
          .receipt-header,
          table,
          tbody,
          tr,
          .receipt-container {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          
          /* Force border colors */
          table, th, td, div {
            border-color: #000 !important;
          }
          
          /* Force background colors to print */
          .bg-sky-100 {
            background-color: #e0f2fe !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .bg-gray-50 {
            background-color: #f9fafb !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          .text-red-600 {
            color: #dc2626 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          /* Page settings - single page */
          @page {
            margin: 5mm;
            size: A4 portrait;
          }
          
          /* Scale to fit on single page */
          .receipt-container {
            transform-origin: top center;
            max-height: 277mm;
            font-size: 11px;
          }
          
          /* Compact tables for print */
          table {
            width: 100%;
          }
          
          th, td {
            padding: 2px 4px !important;
          }
        }
        
        /* Screen preview styles */
        @media screen {
          .receipt-container {
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </div>
  );
};

export default FeeReceipt;