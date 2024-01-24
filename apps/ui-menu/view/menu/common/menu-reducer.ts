function reducer(state: any, action: any) {
  switch (action.type) {
    case 'add-item': {
      return {
        ...state,
        addedItems: {
          ...state.addedItems,
          [action.payload.category]: {
            ...state.addedItems[action.payload.category],
            subcategories: {
              ...state.addedItems[action.payload.category]?.subcategories,
              [action.payload.subcategory]: {
                ...state.addedItems[action.payload.category]?.subcategories[action.payload.subcategory],
                items: {
                  ...state.addedItems[action.payload.category]?.subcategories[action.payload.subcategory]?.items,
                  [action.payload.id]: action.payload,
                }
              }
            }
          },
        }
      };
    }
    case 'remove-item': {
      delete state.addedItems[action.payload.category]?.subcategories[action.payload.subcategory]?.items[action.payload.id];
      if (Object.keys(state.addedItems[action.payload.category]?.subcategories[action.payload.subcategory]?.items || {}).length === 0) {
        delete state.addedItems[action.payload.category]?.subcategories[action.payload.subcategory];
      }

      Object.keys(state.addedItems).forEach(categoryId => {
        const subcategories = state.addedItems[categoryId].subcategories;

        Object.keys(subcategories).forEach(subcategoryId => {
          const items = subcategories[subcategoryId].items;

          Object.keys(items).forEach(itemId => {
            if (items[itemId].suggested_items) {
              items[itemId].suggested_items = items[itemId].suggested_items?.filter((id: string) => id !== action.payload.id);

              if (!items[itemId].suggested_items.length) {
                delete items[itemId].suggested_items;
              }
            }

          });
        });
      });

      return { ...state };
    }
    case 'add-update-item': {
      return {
        ...state,
        addedItems: {
          ...state.addedItems,
          [action.payload.category]: {
            ...state.addedItems[action.payload.category],
            subcategories: {
              ...state.addedItems[action.payload.category]?.subcategories,
              [action.payload.subcategory]: {
                ...state.addedItems[action.payload.category]?.subcategories[action.payload.subcategory],
                items: {
                  ...state.addedItems[action.payload.category]?.subcategories[action.payload.subcategory]?.items,
                  [action.payload.id]: action.payload,
                }
              }
            }
          },
        }
      };
    }
    case 'reorder-subcategory': {
      action.payload.subcategories.forEach((subKey: any, index: number) => {
        state.categories[action.payload.category].subcategories[subKey].sort_order = index + 1;
        if (state.addedItems[action.payload.category]?.subcategories[subKey]) {
          state.addedItems[action.payload.category].subcategories[subKey].sort_order = index + 1;
        }
      });
      return { ...state };
    }
    case 'set-menu':
      return action.payload;
    default:
      throw new Error();
  }
}

export default reducer;
