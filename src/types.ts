
export type Currency = '新臺幣' | '美金';

export type SalaryDetailCategory =
  | '月支薪俸'
  | '艱苦加給'
  | '勞保費'
  | '健保費'
  | '稅額 - 新臺幣'
  | '稅額 - 美金'
  | '合計';

type Employee = {
  id: string; // 員工編號
  name: string; // 員工姓名
  title: string; // 職稱
  departmentId: string; // 管理部門編號
  departmentName: string; // 管理部門
};

export type SalaryDetailItem = {
  category: SalaryDetailCategory;
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

export type PaySplit = {
  monthYear: string;
  employee: Employee;
  salaryDetail: SalaryDetail;
  insuranceDetail: InsuranceDetail;
};