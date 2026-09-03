export function getPersianAlphabet (): string[] {
  return [
    'الف',
    'ب',
    'پ',
    'ت',
    'ث',
    'ج',
    'چ',
    'ح',
    'خ',
    'د',
    'ذ',
    'ر',
    'ز',
    'ژ',
    'س',
    'ش',
    'ص',
    'ض',
    'ط',
    'ظ',
    'ع',
    'غ',
    'ف',
    'ق',
    'ک',
    'گ',
    'ل',
    'م',
    'ن',
    'و',
    'ه',
    'ی'
  ]
}

export function normalizeToEnglishNumbers (input: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  let result = input
  for (let i = 0; i < 10; i++) {
    result = result
      .replace(new RegExp(persianNumbers[i], 'g'), englishNumbers[i])
      .replace(new RegExp(arabicNumbers[i], 'g'), englishNumbers[i])
  }
  return result
}

export function normalizeToPersianNumbers (input: string): string {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩']
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

  let result = input
  for (let i = 0; i < 10; i++) {
    result = result
      .replace(new RegExp(englishNumbers[i], 'g'), persianNumbers[i])
      .replace(new RegExp(arabicNumbers[i], 'g'), persianNumbers[i])
  }
  return result
}

export function normalizePersianLetters (value: string): string {
  if (!value) return ''

  const map: Record<string, string> = {
    'ي': 'ی',
    'ى': 'ی',
    'ك': 'ک',
    '‍': '' // حذف ZWJ
  }

  // حذف حرکات عربی (کسره، فتحه، ضمه و ...)
  value = value.replace(/[\u064B-\u065F]/g, '')

  // تبدیل حروف
  return value.replace(/[يىك‍]/g, (ch) => map[ch] || ch)
}

export function switchKey (value: string): string {
  if (!value) {
    return ''
  }
  const persianChars = [
      'ض',
      'ص',
      'ث',
      'ق',
      'ف',
      'غ',
      'ع',
      'ه',
      'خ',
      'ح',
      'ج',
      'چ',
      'ش',
      'س',
      'ی',
      'ب',
      'ل',
      'ا',
      'ت',
      'ن',
      'م',
      'ک',
      'گ',
      'ظ',
      'ط',
      'ز',
      'ر',
      'ذ',
      'د',
      'پ',
      'و',
      '؟'
    ],
    englishChar = [
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
      '[',
      ']',
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      ';',
      "'",
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      ',',
      '?'
    ]

  for (let i = 0, charsLen = persianChars.length; i < charsLen; i++) {
    value = value.replace(new RegExp(persianChars[i], 'g'), englishChar[i])
  }
  return value
}