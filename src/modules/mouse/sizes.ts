/** Nishon o'lchami: sinf kichik bo'lsa — nishon katta. Ekran balandligiga moslashadi. */
export const targetSize = (grade: number) => `clamp(84px, ${[21, 19, 17, 15, 14][grade] ?? 16}vh, 200px)`

export const COLORS = ['#FF7A6B', '#6CB8F0', '#FFC94A', '#9B8AE6', '#5CC98B', '#F58FB7']
