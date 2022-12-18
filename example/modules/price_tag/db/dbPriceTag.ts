
const price_tags: { id: number; name: string; product_ids: number[] }[] = [];

export default {
  create(price_tag: { name: string; product_ids: number[] }) {
    const id = Date.now();
    price_tags.push({ ...price_tag, id });
    return id;
  },
  getByIds(ids: number[]) {
    const set_ids = new Set(ids);

    return price_tags.filter(el => set_ids.has(el.id));
  }
}