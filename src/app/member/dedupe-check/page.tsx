// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import Cookies from 'js-cookie';
// import Papa from 'papaparse';
// import * as XLSX from 'xlsx'; // Import the xlsx library

// type ExcelRow = (string | number | null | undefined)[];
// type ApiResponseItem = {
//   phone: string | number;
//   status: 'Duplicate' | 'Not Duplicate' | string;
// };
// type ApiResponse = {
//   data: ApiResponseItem[];
// };

// export default function PartnerDashboard() {
//   const router = useRouter();
//   const [file, setFile] = useState<File | null>(null);
//   const [uploadMessage, setUploadMessage] = useState<string>('');
//   const [processing, setProcessing] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number>(0);
//   const [headers, setHeaders] = useState<string[]>([]);
//   const [phoneColumnIndex, setPhoneColumnIndex] = useState<number | null>(null);
//   const [duplicates, setDuplicates] = useState<ExcelRow[]>([]);
//   const [notDuplicates, setNotDuplicates] = useState<ExcelRow[]>([]);
//   const [totalRowsEstimate, setTotalRowsEstimate] = useState<number>(0); // New state for better progress estimation

//   useEffect(() => {
//     const isLoggedIn = Cookies.get('partner_login');
//     if (!isLoggedIn) {
//       router.push('/partnerlogin');
//     }
//   }, [router]);

//   const handleLogout = () => {
//     Cookies.remove('partner_login');
//     router.push('/partnerlogin');
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0] || null;
//     setFile(selectedFile);
//     setUploadMessage('');
//     setProgress(0);
//     setDuplicates([]);
//     setNotDuplicates([]);
//     setHeaders([]); // Clear headers when new file is selected
//     setPhoneColumnIndex(null); // Clear phone column index
//     setTotalRowsEstimate(0); // Reset total rows estimate
//   };

//   const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

//   const processBatch = useCallback(
//     async (
//       rows: ExcelRow[],
//       index: number,
//       tempDup: ExcelRow[],
//       tempNonDup: ExcelRow[]
//     ) => {
//       const phones = rows
//         .map((r) => r[index])
//         .filter((num) => /^\d{10}$/.test(String(num).replace(/\D/g, '').slice(-10)))
//         .map((num) => Number(String(num).replace(/\D/g, '').slice(-10)));

//       if (!phones.length) return;

//       const MAX_RETRIES = 3;
//       const RETRY_DELAY = 1000;
//       let attempt = 0;
//       let success = false;
//       let resultData: ApiResponseItem[] = [];

//       while (attempt < MAX_RETRIES && !success) {
//         try {
//           const res = await fetch('https://keshvacredit.com/api/v1/getAll/check-data', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ phone: phones }),
//           });

//           if (!res.ok) throw new Error(`Status ${res.status}`);
//           const json: ApiResponse = await res.json();
//           resultData = json.data;
//           success = true;
//         } catch (err) {
//           console.warn(`Attempt ${attempt + 1} failed`, err);
//           attempt++;
//           if (attempt < MAX_RETRIES) await sleep(RETRY_DELAY * attempt);
//         }
//       }

//       if (success) {
//         const statusMap = new Map(resultData.map((d) => [String(d.phone), d.status]));
//         rows.forEach((row) => {
//           const phone = String(row[index]).replace(/\D/g, '').slice(-10);
//           const status = statusMap.get(phone);
//           if (status === 'Duplicate') tempDup.push(row);
//           else if (status === 'Not Duplicate') tempNonDup.push(row);
//         });
//       }

//       const BETWEEN_BATCH_DELAY = 10;
//       await sleep(BETWEEN_BATCH_DELAY);
//     },
//     []
//   );

//   const processData = async (allRows: ExcelRow[], discoveredPhoneColIndex: number) => {
//     setProcessing(true);
//     setUploadMessage('Processing data...');
//     setProgress(0);

//     const BATCH_SIZE = 7000;
//     const tempDuplicates: ExcelRow[] = [];
//     const tempNonDuplicates: ExcelRow[] = [];
//     let processedCount = 0;

//     // Use the actual total rows for accurate progress
//     const totalRowsForProgress = allRows.length; // allRows here are already just data rows
//     if (totalRowsForProgress <= 0) {
//       setUploadMessage('✅ No data rows found to process.');
//       setProcessing(false);
//       return;
//     }

//     for (let i = 0; i < allRows.length; i += BATCH_SIZE) {
//       const batch = allRows.slice(i, i + BATCH_SIZE);
//       if (batch.length > 0) {
//         await processBatch(batch, discoveredPhoneColIndex, tempDuplicates, tempNonDuplicates);
//         processedCount += batch.length;
//         // Calculate progress based on actual processed rows against total data rows
//         setProgress(Math.floor((processedCount / totalRowsForProgress) * 100));
//       }
//     }

//     setDuplicates(tempDuplicates);
//     setNotDuplicates(tempNonDuplicates);
//     setUploadMessage('✅ Processing complete!');
//     setProgress(100); // Ensure progress is 100% on completion
//     setProcessing(false);
//   };


//   const handleUpload = () => {
//     if (!file) {
//       setUploadMessage('Please select a file to upload.');
//       return;
//     }

//     setProcessing(true);
//     setUploadMessage('Reading file...');
//     setProgress(0);
//     setDuplicates([]);
//     setNotDuplicates([]);
//     setHeaders([]);
//     setPhoneColumnIndex(null);

//     const fileName = file.name.toLowerCase();

//     if (fileName.endsWith('.csv')) {
//       // For CSV, we parse it entirely first, then process it in batches.
//       Papa.parse(file, {
//         skipEmptyLines: true,
//         header: false,
//         complete: (fullResults) => {
//           const allCsvRows = fullResults.data as ExcelRow[];
//           if (allCsvRows.length === 0) {
//             setUploadMessage('❌ CSV file is empty.');
//             setProcessing(false);
//             return;
//           }
//           const headerRow = allCsvRows[0];
//           const dataRows = allCsvRows.slice(1);

//           const keywords = ['phone', 'mobile', 'number', 'contact',
//             'phonenumber', 'phone_number', 'mobile_number',
//             'contact_number', 'contactnumber', 'mobilenumber'];
//           const foundIndex = headerRow.findIndex((h) =>
//             keywords.some((k) =>
//               String(h).toLowerCase().replace(/[^a-z]/g, '').includes(k)
//             )
//           );
//           if (foundIndex === -1) {
//             setUploadMessage('❌ No phone-related column found in CSV.');
//             setProcessing(false);
//             return;
//           }
//           setHeaders(headerRow as string[]);
//           setPhoneColumnIndex(foundIndex);
//           setTotalRowsEstimate(dataRows.length); // Set total rows for progress

//           // Now, process the collected data rows
//           processData(dataRows, foundIndex);
//         },
//         error: (err) => {
//           console.error('CSV parsing error:', err);
//           setUploadMessage('❌ Failed to parse CSV file.');
//           setProcessing(false);
//         }
//       });
//     } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         // Safely access e.target.result by checking if e.target is not null
//         const readerResult = e.target?.result;

//         if (!readerResult) {
//           setUploadMessage('❌ Error: Could not read file content.');
//           setProcessing(false);
//           return;
//         }

//         try {
//           const data = new Uint8Array(readerResult as ArrayBuffer);
//           const workbook = XLSX.read(data, { type: 'array' });
//           const sheetName = workbook.SheetNames[0]; // Get the first sheet
//           const worksheet = workbook.Sheets[sheetName];

//           // Convert sheet to array of arrays, excluding empty rows
//           const allExcelRows: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: null });

//           if (allExcelRows.length === 0) {
//             setUploadMessage('❌ Excel file is empty or contains no data.');
//             setProcessing(false);
//             return;
//           }

//           const headerRow = allExcelRows[0];
//           const dataRows = allExcelRows.slice(1);

//           const keywords = ['phone', 'mobile', 'number', 'contact',
//             'phonenumber', 'phone_number', 'mobile_number',
//             'contact_number', 'contactnumber', 'mobilenumber'];
//           const foundIndex = headerRow.findIndex((h) =>
//             keywords.some((k) =>
//               String(h).toLowerCase().replace(/[^a-z]/g, '').includes(k)
//             )
//           );

//           if (foundIndex === -1) {
//             setUploadMessage('❌ No phone-related column found in Excel file.');
//             setProcessing(false);
//             return;
//           }

//           setHeaders(headerRow as string[]);
//           setPhoneColumnIndex(foundIndex);
//           setTotalRowsEstimate(dataRows.length); // Set total rows for progress

//           // Now, process the collected data rows
//           await processData(dataRows, foundIndex);

//         } catch (error) {
//           console.error('Excel file processing error:', error);
//           setUploadMessage('❌ Failed to process Excel file.');
//           setProcessing(false);
//         }
//       };
//       reader.onerror = (error) => {
//         console.error('FileReader error:', error);
//         setUploadMessage('❌ Error reading Excel file.');
//         setProcessing(false);
//       };
//       reader.readAsArrayBuffer(file);
//     } else {
//       setUploadMessage('❌ Unsupported file type. Please upload a CSV or Excel (.xlsx, .xls) file.');
//       setProcessing(false);
//     }
//   };

//   const downloadCSV = (rows: ExcelRow[], filename: string) => {
//     // Ensure headers are correctly added when downloading
//     const dataToUnparse = headers.length > 0 ? [headers, ...rows] : rows;
//     const csv = Papa.unparse(dataToUnparse);
//     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', `${filename}.csv`);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="rounded-2xl mt-18 flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
//       <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
//         <div className="p-6 space-y-6 text-center">
//           <p className="text-xl text-gray-600">
//             Welcome to Keshvacredit{' '}
//             <span className="font-semibold text-blue-600">Partner Dashboard</span>.
//           </p>
//           <button
//             onClick={handleLogout}
//             className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-md shadow-md hover:bg-red-600 transition"
//           >
//             Logout
//           </button>

//           <div className="bg-gradient-to-r from-white via-gray-50 to-white rounded-xl p-4 border border-dashed border-purple-300 shadow-inner text-left space-y-3 text-gray-700">
//             <h2 className="text-lg font-bold text-purple-600">📂 Upload Excel/CSV File</h2>
//             <input
//               type="file"
//               accept=".xlsx, .xls, .csv"
//               onChange={handleFileChange}
//               className="block w-full p-1 border rounded-md text-sm"
//             />
//             {processing && progress > 0 && (
//               <div className="w-full bg-gray-200 rounded-full h-2.5">
//                 <div
//                   className="bg-blue-600 h-2.5 rounded-full"
//                   style={{ width: `${progress}%` }}
//                 />
//               </div>
//             )}
//             <button
//               onClick={handleUpload}
//               className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-md shadow-md hover:bg-blue-700 transition"
//               disabled={processing || !file}
//             >
//               {processing ? `Processing (${Math.round(progress)}%)` : 'Upload File'}
//             </button>
//             {uploadMessage && (
//               <p
//                 className={`text-xs mt-2 text-center ${uploadMessage.startsWith('✅')
//                     ? 'text-green-600'
//                     : uploadMessage.startsWith('❌')
//                       ? 'text-red-600'
//                       : 'text-blue-600'
//                   }`}
//               >
//                 {uploadMessage}
//               </p>
//             )}
//           </div>

//           {!processing &&
//             phoneColumnIndex !== null &&
//             (duplicates.length > 0 || notDuplicates.length > 0) && (
//               <div className="flex justify-center gap-4 mt-6 flex-wrap">
//                 <div className="flex flex-col items-center p-4 bg-red-100 text-red-800 rounded-lg shadow w-60">
//                   <h3 className="text-base font-semibold">Status: Duplicate</h3>
//                   <p className="text-xl font-bold">{duplicates.length}</p>
//                   <button
//                     onClick={() => downloadCSV(duplicates, 'Duplicates')}
//                     className="mt-2 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs transition"
//                   >
//                     Download Duplicates
//                   </button>
//                 </div>

//                 <div className="flex flex-col items-center p-4 bg-green-100 text-green-800 rounded-lg shadow w-60">
//                   <h3 className="text-base font-semibold">Status: Not Duplicate</h3>
//                   <p className="text-xl font-bold">{notDuplicates.length}</p>
//                   <button
//                     onClick={() => downloadCSV(notDuplicates, 'Not_Duplicates')}
//                     className="mt-2 px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-xs transition"
//                   >
//                     Download Not Duplicates
//                   </button>
//                 </div>
//               </div>
//             )}

//           <div className="mt-4 bg-gray-100 p-3 rounded text-sm text-gray-600">
//             <p>Track duplicates, and download filtered results.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client"
import React from 'react'

function page() {
  return (
    <div>
      <h1>wecome to dedupe check page</h1>
    </div>
  )
}

export default page
