const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getExampleProduct = async () => {
  try {
    await delay(1000);
    let res = await fetch('https://fakestoreapi.com/products/1');
    let data = await res.json();
    return data;
  } catch (e) {
    console.error('Could not get product:', e);
  }
};
