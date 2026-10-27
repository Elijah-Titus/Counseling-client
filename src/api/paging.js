// Some lists may not be paged by the server any more. If a reply holds more rows than
// we asked for, we show only the slice that belongs to the requested page.
export const normalizePage = (data, page, limit) => {
  const items = Array.isArray(data?.items) ? data.items : [];
  const total = typeof data?.total === "number" ? data.total : items.length;

  if (items.length > limit) {
    const start = (page - 1) * limit;
    return {
      items: items.slice(start, start + limit),
      total: Math.max(total, items.length),
    };
  }

  return { items, total };
};