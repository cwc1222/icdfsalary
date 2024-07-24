import './style.scss';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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

const title = '財團法人國際合作發展基金會 薪資明細';

const fetchPaySplitData = () => {};

const generatePaySplit = () => {
    console.log('Generate PaySplit');
    const paysplit = fetchPaySplitData();
    pdfMake.createPdf({
        content: [
            {
                text: title,
                fontSize: 15,
            }
        ],
    }).download();
};

const addPrintBtn = () => {
    console.log('addPrintBtn');
    const btn = document.createElement('button');
    btn.innerHTML = 'Generate Paysplit';
    btn.className += "generate-paysplit";
    btn.onclick = generatePaySplit;
    document.body.appendChild(btn);
}

addPrintBtn();
