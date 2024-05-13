// generate random id using date and some random number

export const genId = () => {
  const date = new Date();
  const random = Math.floor(Math.random() * 1000);
  return date.getTime() + random;
}