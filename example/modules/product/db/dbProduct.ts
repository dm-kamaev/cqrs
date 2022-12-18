const products: { id: number; name: string; price_tag_ids: number[] }[] = [];
export default {
  create(product: { name: string; price_tag_ids: number[] }) {
    const id = Date.now();
    products.push({...product, id });
    return id;
  },
  getById(id: number) {
    return products.find(el => el.id === id)!;
  },
  getByName(name: string) {
    return products.find(el => el.name === name)!;
  }
}