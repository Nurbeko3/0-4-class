// Jadval va diagrammadagi mevalar (rangi bilan farqlanadi).
export const FRUITS = ['apple', 'orange', 'plum', 'lime', 'berry'] as const
export type FruitId = (typeof FRUITS)[number]

export const FRUIT_COLOR: Record<FruitId, string> = {
  apple: '#F2594B',
  orange: '#F58A2A',
  plum: '#9B8AE6',
  lime: '#5CC98B',
  berry: '#F58FB7',
}
