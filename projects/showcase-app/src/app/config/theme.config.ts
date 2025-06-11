import { IDwThemesConfig } from '@webdpt/framework/themes';

export const themeConfig: IDwThemesConfig = {
  'theme': {
    'enable': true,
    'defaultThemeId': 'dark'
  },
  'color': {
    'enable': true,
    'defaultColorHex': '#1890FF',
    'colorHexOptions': [
      '#E91E63',
      '#F5222D',
      '#FA541C',
      '#FAAD14',
      '#52C41A',
      '#32C5D2',
      '#1890FF',
      '#2F54EB',
      '#722ED1',
    ]
  },
  'logo': {
    'enable': true,
    'logoList': [
      {
        'language': 'en_US',
        'logoUrl': './assets/img/i18n/en_US/logo/dwLogo.svg'
      },
      {
        'language': 'zh_CN',
        'logoUrl': './assets/img/i18n/zh_CN/logo/dwLogo.svg'
      },
      {
        'language': 'zh_TW',
        'logoUrl': './assets/img/i18n/zh_TW/logo/dwLogo.svg'
      }
    ]
  }
};
