import './style.scss';
import { jsPDF } from 'jspdf';
import autoTable, { UserOptions } from 'jspdf-autotable';

import icdfIcon from '../static/icdf.jpeg?base64';
import NotoSansTCThin from '../static/fonts/NotoSansTC-Thin.ttf?base64';
import NotoSansTCLight from '../static/fonts/NotoSansTC-Light.ttf?base64';
import NotoSansTCRegular from '../static/fonts/NotoSansTC-Regular.ttf?base64';
import NotoSansTCBold from '../static/fonts/NotoSansTC-Bold.ttf?base64';
import NotoSansTCBlack from '../static/fonts/NotoSansTC-Black.ttf?base64';

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
    height: 13.24,
  },
  titleText: '財團法人國際合作發展基金會 2024 年 07 月 薪資明細',
  titleFontSize: 16,
  titleFontStyle: 'bold',
  bodyFontSize: 12,
  bodyFontStyle: 'normal'
};

type Currency = "新臺幣" | "美金";

type Employee = {
  id: string; // 員工編號
  name: string; // 員工姓名
  title: string; // 職稱
  departmentId: string; // 管理部門編號
  departmentName: string; // 管理部門
};

type SalaryDetailItem = {
  category: '月支薪俸' | '艱苦加給' | '勞保費' | '健保費' | '稅額 - 月支薪俸' | '稅額 - 艱苦加給' | '合計';
  currency: Currency;
  exchangeRate: number;
  amount: number;
};

type SalaryDetail = {
  payable: SalaryDetailItem[]; // 工資加項/應發金額
  deductible: SalaryDetailItem[]; // 工資扣項/應扣金額
  total: SalaryDetailItem;
};

type InsuranceDetail = {
  laborInsuranceInsured: number; // 勞保投保
  laborInsuranceEmployerCoverage: number; // 勞保雇主
  laborInsuranceEmployeeCoverage: number; // 勞保員工
  laborInsuranceEmployerAdvance: number; // 工資墊償

  twInsuranceInsured: number; // 健保投保
  twInsuranceEmployerCoverage: number; // 健保雇主
  twInsuranceEmployeeCoverage: number; // 健保員工

  laborRetirementInsured: number; // 勞退提繳
  laborRetirementEmployerCoveragePercent: number; // 雇主%
  laborRetirementEmployeeCoveragePercent: number; // 自提%
  laborRetirementEmployerCoverage: number; // 勞退雇主
  laborRetirementEmployeeCoverage: number; // 勞退員工
};

type PaySplit = {
  monthYear: string;
  employee: Employee;
  salaryDetail: SalaryDetail;
  insuranceDetail: InsuranceDetail;
};

const fetchPaySplitData: () => PaySplit = () => {
  return {
    monthYear: '202407',
    employee: {
      id: '9527',
      name: '周星星',
      title: '警佐',
      departmentId: 'A010',
      departmentName: '飛虎隊',
    },
    salaryDetail: {
      payable: [
        {
          category: '月支薪俸',
          currency: '新臺幣',
          exchangeRate: 1,
          amount: 49999,
        },
        {
          category: '艱苦加給',
          currency: '美金',
          exchangeRate: 30,
          amount: 999,
        },
      ],
      deductible: [
        {
          category: '勞保費',
          currency: '新臺幣',
          exchangeRate: 1,
          amount: 1100,
        },
        {
          category: '健保費',
          currency: '新臺幣',
          exchangeRate: 1,
          amount: 1800,
        },
        {
          category: '稅額 - 月支薪俸',
          currency: '新臺幣',
          exchangeRate: 1,
          amount: 888,
        },
        {
          category: '稅額 - 艱苦加給',
          currency: '美金',
          exchangeRate: 30,
          amount: 98,
        },
      ],
      total: {
        category: '合計',
        currency: '新臺幣',
        exchangeRate: 1,
        amount: 73241,
      }
    },
    insuranceDetail: {
      laborInsuranceInsured: 45000,
      laborInsuranceEmployerCoverage: 2500,
      laborInsuranceEmployeeCoverage: 1100,
      laborInsuranceEmployerAdvance: 11,
      twInsuranceInsured: 87000,
      twInsuranceEmployerCoverage: 2500,
      twInsuranceEmployeeCoverage: 1800,
      laborRetirementInsured: 99999,
      laborRetirementEmployerCoveragePercent: 6,
      laborRetirementEmployeeCoveragePercent: 0,
      laborRetirementEmployerCoverage: 5999,
      laborRetirementEmployeeCoverage: 0,
    },
  };
};

//const validatePaySplitData = (paysplit: PaySplit) => {};

const newJsPdf = () => {
  const doc = new jsPDF({
    orientation: paySplitPdfConfig.orientation,
    unit: paySplitPdfConfig.unit,
    format: paySplitPdfConfig.pageSize
  });

  // Add Fonts
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

const generatePaySplit = () => {
  const paysplit = fetchPaySplitData();

  // Start making the PDF
  const line = (ln: number) => ln * paySplitPdfConfig.lineHeight;
  const doc = newJsPdf();

  doc.setFontSize(paySplitPdfConfig.titleFontSize);
  doc.text(
    paySplitPdfConfig.titleText,
    paySplitPdfConfig.marginLeft,
    paySplitPdfConfig.marginTop,
  );

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
    showHead: 'never',
  };

  // Add Employee Info
  autoTable(doc, {
    theme: 'plain',
    tableWidth: tableMaxWidth / 1.5,
    styles: {
      font: paySplitPdfConfig.font,
      fontSize: paySplitPdfConfig.bodyFontSize,
      cellWidth: 'auto',
    },
    margin: {
      left: paySplitPdfConfig.marginLeft
    },
    startY: line(3),
    body: [
      ['管理部門:', paysplit.employee.departmentName, '管理部門編號', paysplit.employee.departmentId, '職稱:', paysplit.employee.title],
      ['員工姓名:', paysplit.employee.name, '員工編號:', paysplit.employee.id],
    ]
  });
  doc.line(paySplitPdfConfig.marginLeft, line(5), paySplitPdfConfig.pageSize[1] - paySplitPdfConfig.marginLeft, line(5), 'F')

  // Add Salary Detail Table
  doc.setFont(paySplitPdfConfig.font, paySplitPdfConfig.bodyFontStyle);
  doc.setFontSize(paySplitPdfConfig.bodyFontSize - 1);
  doc.text(
    '薪資明細',
    paySplitPdfConfig.marginLeft,
    line(6)
  );
  autoTable(doc, {
    ...tableConfig,
    startY: line(6.5),
    body: [
      ['', '項目', '幣別', '匯率', '金額'],
      [
        {
          content: '工資加項',
          colSpan: 1,
          rowSpan: 2,
          styles: {
            valign: 'middle'
          }
        },
        '月支薪俸',
        '新臺幣',
        '1',
        '999,000'
      ],
      ['艱苦加給', '美金', '30', '1,999'],
      [{ content: [''], colSpan: 5 }],
      [
        {
          content: '工資扣項',
          colSpan: 1,
          rowSpan: 4,
          styles: {
            valign: 'middle'
          }
        },
        '勞保費',
        '新臺幣',
        '1',
        '1,100'
      ],
      ['健保費', '新臺幣', '1', '9,999'],
      ['稅額 - 月支薪俸', '新臺幣', '1', '9,999'],
      ['稅額 - 艱苦加給', '美金', '30', '999'],
      [{ content: [''], colSpan: 5 }],
      [{ content: '合計', colSpan: 2 }, '新臺幣', '1', '999,999']
    ]
  });

  // Add Insurance Detail Table
  doc.setFont(paySplitPdfConfig.font, paySplitPdfConfig.bodyFontStyle);
  doc.setFontSize(paySplitPdfConfig.bodyFontSize - 1);
  doc.text(
    '保費明細',
    paySplitPdfConfig.marginLeft,
    line(15.5)
  );
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
        paysplit.insuranceDetail.laborInsuranceInsured,
        paysplit.insuranceDetail.laborInsuranceEmployerCoverage,
        paysplit.insuranceDetail.laborInsuranceEmployeeCoverage,
        paysplit.insuranceDetail.laborInsuranceEmployerAdvance,
        paysplit.insuranceDetail.twInsuranceInsured,
        paysplit.insuranceDetail.twInsuranceEmployerCoverage,
        paysplit.insuranceDetail.twInsuranceEmployeeCoverage,
        paysplit.insuranceDetail.laborRetirementInsured,
        paysplit.insuranceDetail.laborRetirementEmployerCoveragePercent,
        paysplit.insuranceDetail.laborRetirementEmployeeCoveragePercent,
        paysplit.insuranceDetail.laborRetirementEmployerCoverage,
        paysplit.insuranceDetail.laborRetirementEmployeeCoverage,
      ]
    ]
  });

  // Add Background Image
  const titleIcon = paySplitPdfConfig.titleIcon;
  doc.saveGraphicsState();
  doc.setGState(doc.GState({opacity: 0.16}));
  doc.addImage(
    titleIcon.base64Str,
    titleIcon.imageFormat,
    (paySplitPdfConfig.pageSize[1] - titleIcon.width) / 2,
    (paySplitPdfConfig.pageSize[0] - titleIcon.height) / 2,
    titleIcon.width,
    titleIcon.height
  );
  doc.restoreGraphicsState();

  doc.save('paysplit.pdf');
};

const addPrintBtn = () => {
  const btn = document.createElement('button');
  btn.innerText = 'Generate Paysplit';
  btn.className += 'generate-paysplit';
  btn.onclick = generatePaySplit;
  document.body.appendChild(btn);
};

addPrintBtn();
