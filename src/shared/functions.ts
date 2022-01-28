export const generateRandomName = (): string => {
  const brand = [
    'Alfa Romeo',
    'Audi',
    'BMW',
    'Chevrolet',
    'Chrysler',
    'Citroen',
    'Dodge',
    'Volkswagen',
    'Toyota',
    'Honda',
  ];
  const model = ['Giulietta', 'A6', 'M3', 'Cruze', 'Neon', 'Nemo', 'Challenger', 'Acord', 'Tiguan', 'Camry'];
  return `${brand[Math.floor(Math.random() * brand.length)]} ${model[Math.floor(Math.random() * brand.length)]}`;
};

export const generateRandomColor = (): string => {
  const values: string = '0123456789abcdef';
  const result: Array<string> = Array.from(new Array(6), () => {
    return values[Math.floor(Math.random() * values.length)];
  });
  return `#${result.join('')}`;
};
