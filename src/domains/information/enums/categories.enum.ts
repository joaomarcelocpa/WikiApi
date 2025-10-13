export enum WikiMainCategory {
  PAINEL_SMS = 'DUVIDAS_GERAIS_SMS',
  BACKOFFICE = 'BACKOFFICE',
}

export enum WikiSubCategory {
  SMS_CAMPANHAS = 'SMS_CAMPANHAS',
  SMS_BLACKLIST = 'SMS_BLACKLIST',
  SMS_FINANCEIRO = 'SMS_FINANCEIRO',
  SMS_EMPRESAS = 'SMS_EMPRESAS',
  SMS_SERVICOS = 'SMS_SERVICOS',
  SMS_RELATORIOS = 'SMS_RELATORIOS',
  SMS_API_EXTERNA = 'SMS_API_EXTERNA',
  SMS_FAQ = 'SMS_FAQ',

  BO_OPERACIONAL = 'BO_OPERACIONAL',
  BO_FINANCEIRO = 'BO_FINANCEIRO',
  BO_EMPRESAS = 'BO_EMPRESAS',
  BO_FORNECEDORES = 'BO_FORNECEDORES',
  BO_MENSAGERIA = 'BO_MENSAGERIA',
  BO_MONITORAMENTO = 'BO_MONITORAMENTO',
  BO_USUARIOS = 'BO_USUARIOS',
  BO_FAQ = 'BO_FAQ',
}

export const CATEGORY_HIERARCHY: Record<WikiMainCategory, WikiSubCategory[]> = {
  [WikiMainCategory.PAINEL_SMS]: [
    WikiSubCategory.SMS_CAMPANHAS,
    WikiSubCategory.SMS_BLACKLIST,
    WikiSubCategory.SMS_FINANCEIRO,
    WikiSubCategory.SMS_EMPRESAS,
    WikiSubCategory.SMS_SERVICOS,
    WikiSubCategory.SMS_RELATORIOS,
    WikiSubCategory.SMS_API_EXTERNA,
    WikiSubCategory.SMS_FAQ,
  ],
  [WikiMainCategory.BACKOFFICE]: [
    WikiSubCategory.BO_OPERACIONAL,
    WikiSubCategory.BO_FINANCEIRO,
    WikiSubCategory.BO_EMPRESAS,
    WikiSubCategory.BO_FORNECEDORES,
    WikiSubCategory.BO_MENSAGERIA,
    WikiSubCategory.BO_MONITORAMENTO,
    WikiSubCategory.BO_USUARIOS,
    WikiSubCategory.BO_FAQ,
  ],
};

// export const CATEGORY_LABELS: Record<
//   WikiMainCategory | WikiSubCategory,
//   string
// > = {
//   [WikiMainCategory.PAINEL_SMS]: 'Dúvidas Gerais SMS',
//   [WikiMainCategory.BACKOFFICE]: 'Backoffice',
//
//   [WikiSubCategory.SMS_CAMPANHAS]: 'Campanhas',
//   [WikiSubCategory.SMS_BLACKLIST]: 'Blacklist',
//   [WikiSubCategory.SMS_FINANCEIRO]: 'Financeiro',
//   [WikiSubCategory.SMS_EMPRESAS]: 'Empresas',
//   [WikiSubCategory.SMS_SERVICOS]: 'Serviços',
//   [WikiSubCategory.SMS_RELATORIOS]: 'Relatórios',
//   [WikiSubCategory.SMS_API_EXTERNA]: 'API Externa',
//   [WikiSubCategory.SMS_FAQ]: 'FAQ',
//
//   [WikiSubCategory.BO_OPERACIONAL]: 'Operacional',
//   [WikiSubCategory.BO_FINANCEIRO]: 'Financeiro',
//   [WikiSubCategory.BO_EMPRESAS]: 'Empresas',
//   [WikiSubCategory.BO_FORNECEDORES]: 'Fornecedores',
//   [WikiSubCategory.BO_MENSAGERIA]: 'Mensageria',
//   [WikiSubCategory.BO_MONITORAMENTO]: 'Monitoramento',
//   [WikiSubCategory.BO_USUARIOS]: 'Usuários Backoffice',
//   [WikiSubCategory.BO_FAQ]: 'FAQ',
// };
