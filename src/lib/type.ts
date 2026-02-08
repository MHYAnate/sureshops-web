export interface OperatingHours {
  openingTime?: string;
  closingTime?: string;
  operatingDays?: string[];
  is24Hours?: boolean;
}

export interface ContactDetails {
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  alternatePhone?: string;
}

export interface BankDetails {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  bankCode?: string;
}

export interface VendorFormData {
  businessName: string;
  vendorType: string;
  businessDescription?: string;
  stateId: string;
  areaId: string;
  marketId?: string;
  shopNumber?: string;
  shopFloor?: string;
  shopBlock?: string;
  shopAddress?: string;
  landmark?: string;
  contactDetails: ContactDetails;
  bankDetails?: BankDetails;
  operatingHours?: OperatingHours;
  categories?: string[];
  tags?: string[];
}