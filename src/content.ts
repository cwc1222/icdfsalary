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

/*
type Currency = "新臺幣" | "美金";

type Employee = {
    id: string; // 員工代碼
    name: string; // 員工姓名
    title: string; // 職稱
    departmentId: string; // 管理部門編號
    departmentName: string; // 管理部門名稱
}

type InsuranceDetail = {
    laborInsuranceInsured: string; // 勞保投保
    laborInsuranceEmployerCoverage: string; // 勞保雇主
    laborInsuranceEmployeeCoverage: string; // 勞保員工
    laborInsuranceEmployerAdvance: string; // 工資墊償

    twInsuranceInsured: string; // 健保投保
    twInsuranceEmployerCoverage: string; // 健保雇主
    twInsuranceEmployeeCoverage: string; // 健保員工

    laborRetirementInsured: string; // 勞退提繳
    laborRetirementEmployerCoveragePercent: string; // 雇主%
    laborRetirementEmployeeCoveragePercent: string; // 自提%
    laborRetirementEmployerCoverage: string; // 勞退雇主
    laborRetirementEmployeeCoverage: string; // 勞退員工
}

type PaySplit = {
    employee: Employee;
    payType: string; // 發薪種類
    payMonthYear: string; // 薪資月份
    exceedTwInsuranceAmount: string; // 逾健保倍數金額
    twInsuranceAmount: string; // 扣費當月保額
    accumulatedBonus: string; // 當年累計獎金

    salary: string; // 月支薪俸
    salaryCurrency: Currency; // 月支薪俸幣別
    salaryTaxExempt: string; // 月支薪俸免稅加項
    salaryTax: string; // 月支薪俸稅額
    expatBonus: string; // 艱苦加給
    expatBonusCurrency: Currency; // 艱苦加給幣別
    expatBonusTaxExempt: string; // 艱苦加給免稅加項
    expatBonusTax: string; // 艱苦加給稅額
    laborInsurance: string; // 勞保費
    twInsurance: string; // 健保費

    insuranceDetail: InsuranceDetail;
}
*/

//const fetchPaySplitData = () => {};

//const validatePaySplitData = () => {};

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
  //const paysplit = fetchPaySplitData();

  // Start making the PDF
  const line = (ln: number) => ln * paySplitPdfConfig.lineHeight;
  const doc = newJsPdf();
  //const titleIcon = paySplitPdfConfig.titleIcon;

  doc.setFontSize(paySplitPdfConfig.titleFontSize);
  //doc.text(
  //  paySplitPdfConfig.titleText,
  //  paySplitPdfConfig.marginLeft + titleIcon.width + titleIcon.marginRight,
  //  paySplitPdfConfig.marginTop + titleIcon.height * 0.7
  //);
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
      ['管理部門:', '駐瓜地馬拉技術團', '管理部門編號', 'SAP01', '職稱:', '技師'],
      ['員工姓名:', '王大名', '員工編號:', '109xxx'],
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
        '45,800',
        '3,921',
        '1,100',
        '11.00',
        '999,500',
        '9,999',
        '2,999',
        '999,000',
        '6',
        '0',
        '9,999',
        '0'
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
