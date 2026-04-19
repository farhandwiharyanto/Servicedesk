export const APPLICATION_ITEMS: Record<string, string[]> = {
  "ACR": [
    "Data Accrue", "Data Reversal", "AP - Invoice", "Project ID - CRM", 
    "Realisasi", "Bank Guarantee Customer", "Transfer Fund", "AP - Payment Request", 
    "Permintaan Data", "Bank Account", "Internal Form (IR)", "Delegasi Approval", 
    "Reimbursement", "Data Jurnal", "Collection"
  ],
  "AFIS (ERFINA)": [
    "Not Assigned", "Petty Cash", "Business Trip", "CRM - Sales", 
    "Tableau - SIMOLA", "WFM - Flasma", "CRM - Case", "AFIS (ERFINA)", 
    "E-Proc", "INTAN", "Sales Master", "BCL", "Starla", "MyLintasarta", 
    "PSA-PCA", "Cafein", "EPM", "Leonia", "WFM - Prisma", "BSS", "WOM"
  ],
  "Akses": ["Anaplan", "Data"],
  "Anaplan": ["Not Assigned"],
  "Audit": ["ITGC"],
  "BCL": [
    "Adjustments", "Not Assigned", "Transfer Ownership", "Billing Process", 
    "Bill Date Information", "Account", "Payment", "Invoice Consolidation", 
    "Milestone", "Softcopy Invoice", "Update Invoice", "Bundling", 
    "Bill Formatting", "Get Invoice Lama", "Tunda Tagih"
  ],
  "BSS": ["Infra Tools", "Transfer Ownership"],
  "Cafein": ["Data", "Integrasi", "Maintenance"],
  "CRM - Case": ["Data", "Error", "Close Ticket / Task", "Stop clock", "SLA"],
  "CRM - Sales": [
    "Not Assigned", "Data Order", "Contract Management", "Purchase Request", 
    "Inbox", "PO", "Service Acceptance", "Akses", "Backdoor", "Approval Eproc", 
    "Good Receipt", "Gangguan Eproc", "Privy", "Auction", "Strategic Sourcing", 
    "Vendor Registration", "Master Anggaran", "Invoice Vendor", "BAST", 
    "Working Instruction", "SPK", "Notifikasi Email", "Tagging Quote", 
    "Change Status AI", "Adjustment", "Solution Design", "Unlink BA", 
    "SLA", "Billing Type"
  ],
  "E-Proc": ["Not Assigned", "Mapping PR", "Error"],
  "EPM": [
    "Cancel FMS Internal", "Business Trip", "Error", "Kontrol OYOT", 
    "Absen", "Lembur", "Cancel FMS PR", "Cancel PR", "PPA / PMS", 
    "Trigger Supplier Termination", "Data"
  ],
  "Humanis (HCMS)": ["Akses/Role", "Movement Request", "Close MR", "Data"],
  "Intan": ["Force Closed", "Perbedaan Status Dashboard"],
  "Leonia": [
    "Error Login", "Document Tracking", "Gagal Login - User Inactive", "Data", 
    "Error Cuti", "Akses / Role", "Error Absen", "Notifikasi Document Tracking"
  ],
  "MyLintasarta": ["Data", "Access / Role", "Data Project Charter"],
  "MyPMOIS": ["Gangguan Aplikasi"],
  "NMS - FM/PM": ["Data", "Send Candidate / Final POP"],
  "NMS - IM": ["Pengecekan ETL / Job"],
  "Pentaho": ["Request Data"],
  "PLM": ["Data", "Backlog Approval", "Backlog Staging", "Access / Role"],
  "PSA - PCA": ["Data", "Access"],
  "Sales Master": ["Error"],
  "Starla": ["Not Assigned"],
  "Tableau - SIMOLA": [
    "Not Assigned", "Data Tidak Tampil", "Pembuatan Dashboard", 
    "Permintaan Data", "Data Tidak Sesuai", "Update Scheduler Extract"
  ],
  "Tableau Management - Dadali": ["Upload Dokumen", "Update Scheduler Extract"],
  "Talita": [
    "Status", "Detail Service Instance", "Get FAQ List (ULTIMA)", 
    "Trouble Ticket", "Traffic Detail", "PRTG Monitor (API PRTG)"
  ],
  "Ultima": ["Data", "Force Find"],
  "WFM - Flasma": ["Force Find"],
  "WFM - Prisma": [
    "Force Find", "Error", "Activation", "Trigger Cafein", "Re-Open Task", 
    "Bypass Form", "Integrasi SDP-PRISMA", "Info Task", "Service Termination", 
    "Prisma Down", "Access / Role", "Error Integrasi", "Re-Assign"
  ],
  "WOM": ["Activation", "Data"]
};

export const INFRASTRUCTURE_ITEMS: Record<string, string[]> = {
  "Database": ["Cek Session & SGA", "Database Error - Schema Unlock", "Tambah Tablespace"],
  "Domain": [
    "Disable User Account", "Unjoin Domain", "CR", "Reset Password - Tidak Bisa Login Aplikasi", 
    "Join Domain", "Reset Password - Tidak Bisa Login AD Domain", "Reset Password - Password Expired", 
    "Penambahan User Login Domain", "Penambahan User Domain Karyawan Baru", "Edit User Domain", "Disable/Enable User"
  ],
  "Email": [
    "Account Email", "CR", "Maintenance Group", "Email Offline", "Email Full", 
    "Tambah Member Group Email", "Setting Email Outlook", "Tidak Bisa Search Email", 
    "Update PST Email", "Email Blast", "Setting Email External", "Create Pengumuman dan Email Blast", 
    "Delete Member Group Email", "Upgrade Quota Email", "Tidak Bisa Terima/Mengirim Email", 
    "Block Email Address External", "Email Praduga Tak Error", "Hapus Group Email", "Kirim Email Eksternal"
  ],
  "Field Service": ["Pengecekan Datacenter", "Stock Opname"],
  "Microsoft365": ["One Drive - Restore File"],
  "Network & Internet": [
    "Akses VPN", "Setting Wifi", "VPN ZTNA Error", "Tambah Akses Wifi", 
    "Reserve Ip Address", "Gangguan Akses Wifi", "Setting VPN ZTNA", "Tambah DNS", "Cabut Jaringan Internet"
  ],
  "Operating System": ["Instalasi OS - Windows 11", "Instalasi OS - Mac OS X"],
  "PC & Notebook": ["Penggantian Rusak PC", "Peminjaman Monitor"],
  "Printer & Scanner": ["Penggantian Tinta Printer"],
  "Ruang Meeting": ["Pengecekan All Perangkat"],
  "Security": ["Email Dikarantina Antispam", "Whitelist / Open Port", "Blacklist Port", "Agent Not Connected", "Insiden Respon"],
  "Server": [
    "Setting Ip Server", "Penambahan Server", "Consolidate Server", "Restore Server Veeam", 
    "Remote Desktop", "Server Down", "Hardening", "Report NetBackup"
  ],
  "Software": [
    "CR", "Ms Teams Error", "Setting Software Browser Error", "Setting MFA", 
    "Instalasi Software IE 10", "MS Teams Akses MS Teams", "Instalasi Software Java", 
    "Uninstall Software Anti Virus", "Instalasi Software Google Chrome", "Instalasi Software Adobe Reader", 
    "Instalasi Software Microsoft Teams", "Instalasi Software VPN Global Protect", 
    "Instalasi Software Microsoft .Net Framework", "Uninstall Software Microsoft .Net Framework", "Instalasi Software MS visio"
  ],
  "Storage": ["Disk Failure", "Penambahan Volume / Lun"],
  "Support PC & Notebook": ["Display Error", "Fresh Install", "Blue Screen/Hang", "Update Daftar Extension", "Backup Data", "Setting Ulang Printer"],
  "Support Printer & Scanner": [
    "Printer Error", "Setting Printer Baru", "Setting Ulang Printer", "Setting Scanner Baru", "Setting Ulang Scanner"
  ],
  "Support Telephone & Gadget": ["Tidak Bisa Panggilan Keluar-Masuk", "Direct Line Telkom"],
  "Support Vicon": ["Setting Vicon"]
};
