import './style.scss';
import { jsPDF } from 'jspdf';
import autoTable, { CellInput, UserOptions } from 'jspdf-autotable';

import icdfIcon from '../static/icdf.jpeg?base64';
import type { Currency, PaySplit, SalaryDetailCategory, SalaryDetailItem } from './types';

type FontStyle = 'thin' | 'light' | 'normal' | 'bold' | 'black';

type JsPdfImg = {
  base64Str: string;
  imageFormat: 'PNG' | 'JPEG';
  width: number;
  height: number;
};

type PdfConfig = {
  pageSize: number[];
  orientation: 'portrait' | 'landscape';
  unit: 'pt' | 'px' | 'in' | 'mm' | 'cm' | 'ex' | 'em' | 'pc';
  language: 'zh-TW' | 'en-US';
  font: 'NotoSansTC';
  lineHeight: number;
  marginTop: number;
  marginLeft: number;

  titleIcon: JsPdfImg;
  titleText: string;
  titleFontSize: number;
  titleFontStyle: FontStyle;

  bodyFontSize: number;
  bodyFontStyle: FontStyle;
};

const PAGE_SIZE_CM = {
  A4: [21, 29.7]
};

const paySplitPdfConfig: PdfConfig = {
  pageSize: PAGE_SIZE_CM.A4,
  orientation: 'landscape',
  unit: 'cm',
  language: 'zh-TW',
  font: 'NotoSansTC',
  lineHeight: 1,
  marginTop: 2,
  marginLeft: 2,
  titleIcon: {
    base64Str: icdfIcon,
    imageFormat: 'JPEG',
    width: 25.6,
    height: 13.24
  },
  titleText: '財團法人國際合作發展基金會 2024 年 07 月 薪資明細',
  titleFontSize: 16,
  titleFontStyle: 'bold',
  bodyFontSize: 12,
  bodyFontStyle: 'normal'
};
const cleanCommaFromNumber = new RegExp(/,/, 'g');
const clearLineBreak = new RegExp(/(\r\n|\n|\r)/, 'gm');



const fetchPaySplitData: () => PaySplit = () => {
  const iframe = document.querySelector(
    'iframe[src="/EZ9/WAG/WAG101/WAG101_01"]'
  ) as HTMLIFrameElement;
  const doc = iframe.contentDocument || iframe?.contentWindow?.document;
  if (!doc) {
    throw new Error('Cannot locat the data iframe');
  }
  const [salaryAdd, salaryDeduct, salaryTotal, insuranceDetail] = Array.from(
    doc.querySelectorAll('#tabs #tbDataList') as NodeListOf<HTMLTableElement>
  );
  if (!salaryAdd || !salaryDeduct || !salaryTotal || !insuranceDetail) {
    throw new Error('Cannot fetch the data tab');
  }

  const payable: SalaryDetailItem[] = Array.from(
    salaryAdd.querySelectorAll('tr.DBGridItem') as NodeListOf<HTMLTableRowElement>
  ).map((tr) => {
    const values = tr.querySelectorAll(
      'td:not([style*="display: none"]):not([style*="display:none"])'
    ) as NodeListOf<HTMLTableCellElement>;
    const [category, currency, _, amount] = Array.from(values)
      .map((td) => td?.textContent?.replace(clearLineBreak, ' ')?.trim())
      .filter((v) => v)
      .slice(1);
    return {
      category: category as SalaryDetailCategory,
      currency: currency as Currency,
      exchangeRate: currency === '新臺幣' ? 1 : 30,
      amount: Number(amount?.replace(cleanCommaFromNumber, ''))
    };
  });
  const deductible: SalaryDetailItem[] = Array.from(
    salaryDeduct.querySelectorAll('tr.DBGridItem') as NodeListOf<HTMLTableRowElement>
  ).map((tr) => {
    const values = tr.querySelectorAll(
      'td:not([style*="display: none"]):not([style*="display:none"])'
    ) as NodeListOf<HTMLTableCellElement>;
    const [category, currency, amount] = Array.from(values)
      .map((td) => td?.textContent?.replace(clearLineBreak, ' ')?.trim())
      .filter((v) => v)
      .slice(1);
    return {
      category: category as SalaryDetailCategory,
      currency: currency as Currency,
      exchangeRate: currency === '新臺幣' ? 1 : 30,
      amount: Number(amount?.replace(cleanCommaFromNumber, ''))
    };
  });

  const totalTab = Array.from(
    salaryTotal.querySelectorAll('tr.DBGridItem') as NodeListOf<HTMLTableRowElement>
  );
  const tax: SalaryDetailItem[] = totalTab
    .map((tr) => {
      const values = tr.querySelectorAll(
        'td:not([style*="display: none"]):not([style*="display:none"])'
      ) as NodeListOf<HTMLTableCellElement>;
      const valuesArr = Array.from(values)
        .map((td) => td?.textContent?.replace(clearLineBreak, ' ')?.trim())
        .filter((v) => v);
      const currency = valuesArr[1] as Currency;
      const amount = Number(valuesArr[10]?.replace(cleanCommaFromNumber, ''));
      const category: SalaryDetailCategory =
        currency === '新臺幣' ? '稅額 - 新臺幣' : '稅額 - 美金';
      const exchangeRate = currency === '新臺幣' ? 1 : 30;
      return { category, currency, exchangeRate, amount };
    })
    .filter((tax) => ['新臺幣', '美金'].includes(tax.currency));

  const total = Array.from(
    totalTab[totalTab.length - 1].querySelectorAll(
      'td:not([style*="display: none"]):not([style*="display:none"])'
    ) as NodeListOf<HTMLTableCellElement>
  );

  const [
    monthYear,
    employeeId,
    employeeName,
    departmentId,
    departmentName,
    laborInsuranceInsured,
    laborInsuranceEmployerCoverage,
    laborInsuranceEmployeeCoverage,
    laborInsuranceEmployerAdvance,
    twInsuranceInsured,
    twInsuranceEmployerCoverage,
    twInsuranceEmployeeCoverage,
    laborRetirementInsured,
    laborRetirementEmployerCoveragePercent,
    laborRetirementEmployeeCoveragePercent,
    laborRetirementEmployerCoverage,
    laborRetirementEmployeeCoverage
  ] = Array.from(insuranceDetail.querySelectorAll('tr.DBGridItem td')).map(
    (td) => td?.textContent?.replace(clearLineBreak, ' ')?.trim() || ''
  );
  const employee = {
    id: employeeId,
    name: employeeName,
    title: (doc.querySelector('#txtTheTitle') as HTMLInputElement)?.value || '',
    departmentId: departmentId,
    departmentName: departmentName
  };

  return {
    monthYear: monthYear,
    employee: employee,
    salaryDetail: {
      payable,
      deductible: [...deductible, ...tax],
      total: {
        category: '合計',
        currency: '新臺幣',
        exchangeRate: 1,
        amount: Number(total[12]?.textContent?.replace(cleanCommaFromNumber, ''))
      }
    },
    insuranceDetail: {
      laborInsuranceInsured: Number(laborInsuranceInsured.replace(cleanCommaFromNumber, '')),
      laborInsuranceEmployerCoverage: Number(
        laborInsuranceEmployerCoverage.replace(cleanCommaFromNumber, '')
      ),
      laborInsuranceEmployeeCoverage: Number(
        laborInsuranceEmployeeCoverage.replace(cleanCommaFromNumber, '')
      ),
      laborInsuranceEmployerAdvance: Number(
        laborInsuranceEmployerAdvance.replace(cleanCommaFromNumber, '')
      ),
      twInsuranceInsured: Number(twInsuranceInsured.replace(cleanCommaFromNumber, '')),
      twInsuranceEmployerCoverage: Number(
        twInsuranceEmployerCoverage.replace(cleanCommaFromNumber, '')
      ),
      twInsuranceEmployeeCoverage: Number(
        twInsuranceEmployeeCoverage.replace(cleanCommaFromNumber, '')
      ),
      laborRetirementInsured: Number(laborRetirementInsured.replace(cleanCommaFromNumber, '')),
      laborRetirementEmployerCoveragePercent: Number(
        laborRetirementEmployerCoveragePercent.replace(cleanCommaFromNumber, '')
      ),
      laborRetirementEmployeeCoveragePercent: Number(
        laborRetirementEmployeeCoveragePercent.replace(cleanCommaFromNumber, '')
      ),
      laborRetirementEmployerCoverage: Number(
        laborRetirementEmployerCoverage.replace(cleanCommaFromNumber, '')
      ),
      laborRetirementEmployeeCoverage: Number(
        laborRetirementEmployeeCoverage.replace(cleanCommaFromNumber, '')
      )
    }
  };
};

//const validatePaySplitData = (paysplit: PaySplit) => {};

const newJsPdf = async () => {
  const doc = new jsPDF({
    orientation: paySplitPdfConfig.orientation,
    unit: paySplitPdfConfig.unit,
    format: paySplitPdfConfig.pageSize
  });

  // Add Fonts
  const NotoSansTCThin = await import('../static/fonts/NotoSansTC-Thin.ttf?base64').then(
    (font) => font.default
  );
  const NotoSansTCLight = await import('../static/fonts/NotoSansTC-Light.ttf?base64').then(
    (font) => font.default
  );
  const NotoSansTCRegular = await import('../static/fonts/NotoSansTC-Regular.ttf?base64').then(
    (font) => font.default
  );
  const NotoSansTCBold = await import('../static/fonts/NotoSansTC-Bold.ttf?base64').then(
    (font) => font.default
  );
  const NotoSansTCBlack = await import('../static/fonts/NotoSansTC-Black.ttf?base64').then(
    (font) => font.default
  );

  doc.addFileToVFS('NotoSansTCThin.ttf', NotoSansTCThin);
  doc.addFileToVFS('NotoSansTCLight.ttf', NotoSansTCLight);
  doc.addFileToVFS('NotoSansTCRegular.ttf', NotoSansTCRegular);
  doc.addFileToVFS('NotoSansTCBold.ttf', NotoSansTCBold);
  doc.addFileToVFS('NotoSansTCBlack.ttf', NotoSansTCBlack);
  doc.addFont('NotoSansTCThin.ttf', 'NotoSansTC', 'thin');
  doc.addFont('NotoSansTCLight.ttf', 'NotoSansTC', 'light');
  doc.addFont('NotoSansTCRegular.ttf', 'NotoSansTC', 'normal');
  doc.addFont('NotoSansTCBold.ttf', 'NotoSansTC', 'bold');
  doc.addFont('NotoSansTCBlack.ttf', 'NotoSansTC', 'black');

  // Configure PDF
  doc.setLanguage(paySplitPdfConfig.language);
  doc.setFont(paySplitPdfConfig.font, paySplitPdfConfig.titleFontStyle);

  return doc;
};

const generatePaySplit = async () => {
  const paysplit = fetchPaySplitData();

  // Start making the PDF
  const line = (ln: number) => ln * paySplitPdfConfig.lineHeight;
  const doc = await newJsPdf();

  doc.setFontSize(paySplitPdfConfig.titleFontSize);
  doc.text(paySplitPdfConfig.titleText, paySplitPdfConfig.marginLeft, paySplitPdfConfig.marginTop);

  // Table Config
  const tableMaxWidth = paySplitPdfConfig.pageSize[1] - paySplitPdfConfig.marginLeft * 2;
  const tableLineWidth = 0.02;
  const tableTextColor = '#15181c';
  const tableConfig: UserOptions = {
    theme: 'grid',
    tableWidth: tableMaxWidth,
    styles: {
      font: paySplitPdfConfig.font,
      textColor: tableTextColor,
      lineWidth: tableLineWidth,
      lineColor: tableTextColor
    },
    margin: {
      left: paySplitPdfConfig.marginLeft
    },
    showHead: 'never'
  };

  // Add Employee Info
  autoTable(doc, {
    theme: 'plain',
    tableWidth: tableMaxWidth / 1.5,
    styles: {
      font: paySplitPdfConfig.font,
      fontSize: paySplitPdfConfig.bodyFontSize,
      cellWidth: 'auto'
    },
    margin: {
      left: paySplitPdfConfig.marginLeft
    },
    startY: line(3),
    body: [
      [
        '管理部門:',
        paysplit.employee.departmentName,
        '管理部門編號:',
        paysplit.employee.departmentId,
        '職稱:',
        paysplit.employee.title
      ],
      ['員工姓名:', paysplit.employee.name, '員工編號:', paysplit.employee.id]
    ]
  });
  doc.line(
    paySplitPdfConfig.marginLeft,
    line(5),
    paySplitPdfConfig.pageSize[1] - paySplitPdfConfig.marginLeft,
    line(5),
    'F'
  );

  // Add Salary Detail Table
  doc.setFont(paySplitPdfConfig.font, paySplitPdfConfig.bodyFontStyle);
  doc.setFontSize(paySplitPdfConfig.bodyFontSize - 1);
  doc.text('薪資明細', paySplitPdfConfig.marginLeft, line(6));
  autoTable(doc, {
    ...tableConfig,
    startY: line(6.5),
    body: [
      ['', '項目', '幣別', '匯率', '金額'],
      ...paysplit.salaryDetail.payable.map((v, i) => {
        const item: CellInput[] = [
          v.category,
          v.currency,
          v.exchangeRate,
          v.amount.toLocaleString()
        ];
        if (i === 0) {
          return [
            {
              content: '工資加項',
              colSpan: 1,
              rowSpan: paysplit.salaryDetail.payable.length,
              styles: {
                valign: 'middle'
              }
            },
            ...item
          ];
        }
        return item;
      }),
      [{ content: [''], colSpan: 5 }],
      ...paysplit.salaryDetail.deductible.map((v, i) => {
        const item: any[] = [v.category, v.currency, v.exchangeRate, v.amount.toLocaleString()];
        if (i === 0) {
          return [
            {
              content: '工資扣項',
              colSpan: 1,
              rowSpan: paysplit.salaryDetail.deductible.length,
              styles: {
                valign: 'middle'
              }
            },
            ...item
          ];
        }
        return item;
      }),
      [{ content: [''], colSpan: 5 }],
      [
        { content: paysplit.salaryDetail.total.category, colSpan: 2 },
        paysplit.salaryDetail.total.currency,
        paysplit.salaryDetail.total.exchangeRate,
        paysplit.salaryDetail.total.amount.toLocaleString()
      ]
    ]
  });

  // Add Insurance Detail Table
  doc.setFont(paySplitPdfConfig.font, paySplitPdfConfig.bodyFontStyle);
  doc.setFontSize(paySplitPdfConfig.bodyFontSize - 1);
  doc.text('保費明細', paySplitPdfConfig.marginLeft, line(15.5));
  autoTable(doc, {
    ...tableConfig,
    startY: line(16),
    body: [
      [
        '勞保投保',
        '勞保雇主',
        '勞保員工',
        '工資墊償',
        '健保投保',
        '健保雇主',
        '健保員工',
        '勞退提繳',
        '雇主%',
        '自提%',
        '勞退雇主',
        '勞退員工'
      ],
      [
        paysplit.insuranceDetail.laborInsuranceInsured.toLocaleString(),
        paysplit.insuranceDetail.laborInsuranceEmployerCoverage.toLocaleString(),
        paysplit.insuranceDetail.laborInsuranceEmployeeCoverage.toLocaleString(),
        paysplit.insuranceDetail.laborInsuranceEmployerAdvance.toLocaleString(),
        paysplit.insuranceDetail.twInsuranceInsured.toLocaleString(),
        paysplit.insuranceDetail.twInsuranceEmployerCoverage.toLocaleString(),
        paysplit.insuranceDetail.twInsuranceEmployeeCoverage.toLocaleString(),
        paysplit.insuranceDetail.laborRetirementInsured.toLocaleString(),
        paysplit.insuranceDetail.laborRetirementEmployerCoveragePercent.toLocaleString(),
        paysplit.insuranceDetail.laborRetirementEmployeeCoveragePercent.toLocaleString(),
        paysplit.insuranceDetail.laborRetirementEmployerCoverage.toLocaleString(),
        paysplit.insuranceDetail.laborRetirementEmployeeCoverage.toLocaleString()
      ]
    ]
  });

  // Add Background Image
  const titleIcon = paySplitPdfConfig.titleIcon;
  doc.saveGraphicsState();
  doc.setGState(doc.GState({ opacity: 0.16 }));
  doc.addImage(
    titleIcon.base64Str,
    titleIcon.imageFormat,
    (paySplitPdfConfig.pageSize[1] - titleIcon.width) / 2,
    (paySplitPdfConfig.pageSize[0] - titleIcon.height) / 2,
    titleIcon.width,
    titleIcon.height
  );
  doc.restoreGraphicsState();

  doc.save(`${paysplit.monthYear}-${paysplit.employee.name}-paysplit.pdf`);
};

//const addPrintBtn = () => {
//  const btn = document.createElement('button');
//  btn.innerText = 'Generate Paysplit';
//  btn.className += 'generate-paysplit';
//  btn.onclick = generatePaySplit;
//  document.body.appendChild(btn);
//};

//addPrintBtn();

type ChromeExtRequest = {
  action: 'GEN_PAYSPLIT' | 'PARSE_PAYSPLIT';
}

chrome.runtime.onMessage.addListener(function (request: ChromeExtRequest, sender, sendResponse) {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  if (request.action === 'GEN_PAYSPLIT') {
    generatePaySplit();
  }
  if (request.action === 'PARSE_PAYSPLIT') {
    const data = fetchPaySplitData();
    sendResponse(data);
  }
});
