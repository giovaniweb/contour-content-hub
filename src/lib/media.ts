
import { MediaItem } from "@/components/media-library/mockData";

export interface GetMediaItemsParams {
  type?: string;
  search?: string;
}

/**
 * Mock getMediaItems function — you should replace with your real data fetching
 */
export async function getMediaItems(params: GetMediaItemsParams): Promise<MediaItem[]> {
  // This mimics a backend call, filter mock data accordingly
  const { type, search } = params;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { mockMediaItems } = await import("@/components/media-library/mockData");
  let items: MediaItem[] = mockMediaItems;

  if (type && type !== "all") {
    items = items.filter((item) => item.type === type);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }
  // artificial delay
  await new Promise((res) => setTimeout(res, 250));
  return items;
}
