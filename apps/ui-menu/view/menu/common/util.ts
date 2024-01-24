export const submitDataMapper = (data: any) => {
  const mapperObj: any = {
    subcategories: {},
  };
  const dataToSend: any = [];
  Object.keys(data.addedItems).forEach((categoryId: any) => {
    mapperObj.subcategories = {
      ...mapperObj.subcategories,
      ...data.addedItems[categoryId].subcategories
    }
    Object.keys(data.addedItems[categoryId].subcategories).forEach((subId: string) => {
      Object.keys(data.addedItems[categoryId].subcategories[subId].items).forEach((itemKey: any) => {
        const item = data.addedItems[categoryId].subcategories[subId].items[itemKey];
        dataToSend.push({
          product_id: item.id,
          price: item.price,
          category_id: +subId,
          is_popular: item.is_popular,
          is_favorite: item.is_favorite,
          suggested_items: item.suggested_items,
          sort_order: data.addedItems[categoryId].subcategories[subId].sort_order,
        });
      });
    })
    if (Object.keys(data.addedItems[categoryId].subcategories).length === 0) {
      delete mapperObj.subcategories[categoryId];
    }
  });
  return dataToSend;
}

export const mutateMapSortOrder = (menuCategories: any, categories: any) => {
  // map subcategories order from menu subcategories and mutate categories
  Object.keys(menuCategories).forEach((categoryId: string) => {
    const category = categories[categoryId];
    const subcategories = menuCategories[categoryId]?.subcategories;
    if (!subcategories) return;
    Object.keys(category.subcategories).forEach((subcategoryId: string) => {
      const subcategory = categories[categoryId].subcategories[subcategoryId];
      if (!subcategories[subcategoryId]) return;
      subcategory.sort_order = subcategories[subcategoryId].sort_order;
    });
  });
}
