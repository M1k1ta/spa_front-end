export const createPagesArr = (maxPage: number) => {
  const pagesArray: number[] = [];
  for (let i = 1; i <= maxPage; i++) {
    pagesArray.push(i);
  }

  return pagesArray;
};
