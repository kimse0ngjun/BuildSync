export interface Company {
  companyId: number;
  companyType: string;
  companyName: string;
  ceoName: string;
  phone: string;
  address: string;
  createdAt: string;
}


export interface CompanyDetail {
  companyId: number;
  companyType: string;
  companyName: string;
  ceoName: string;
  businessNumber?: string;
  phone: string;
  address: string;
  homepageUrl?: string;
  createdAt: string;
}


export interface CompanyListResponse {
  list: Company[];
  totalElements: number;
  totalPages: number;
  pageNum: number;
  pageSize: number;
}