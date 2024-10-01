import { Link } from "@remix-run/react";
import type { HeaderQuery } from 'storefrontapi.generated';

type CategoryClassProps = {
  menuCollection: any;
  collectionId: string;
}

// Điều chỉnh MenuItemType để cho phép items có thể là undefined
type MenuItemType = (Pick<HeaderQuery['menu']['items'][number], "id" | "resourceId" | "tags" | "title" | "type" | "url"> & {
  items?: MenuItemType[]; // items có thể là undefined hoặc mảng các MenuItemType
});

export function CategoryClass({ menuCollection, collectionId }: CategoryClassProps) {

  const publicStoreDomain = '';
  const primaryDomainUrl = '';

  // Hàm tìm tất cả items có resourceId bằng collectionId và trả về mảng các items đồng cấp
  const findItemsByResourceId = (items: MenuItemType[]): MenuItemType[] => {
    for (const item of items) {
      // Kiểm tra xem item có resourceId trùng với collectionId không
      if (item.resourceId === collectionId) {
        // Trả về các items đồng cấp (có thể là mảng rỗng)
        return item.items || [];
      }
      // Nếu có items con thì kiểm tra tiếp trong items con
      if (item.items && item.items.length > 0) {
        const found = findItemsByResourceId(item.items);
        if (found.length > 0) return found;
      }
    }
    // Nếu không tìm thấy resourceId nào khớp, trả về mảng rỗng
    return [];
  };

  const renderItems = (items: MenuItemType[]) => {
    return items.map((item) => {
      if (!item.url) return null;

      const url =
        item.type === "COLLECTION"
          ? `/c${new URL(item.url).pathname.replace('/collections', '')}`
          : item.type === "PRODUCT"
            ? `/p${new URL(item.url).pathname.replace('/products', '')}`
            : item.url.includes('myshopify.com') ||
              item.url.includes(publicStoreDomain) ||
              item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;

      return (
        <div className="categories-nav-item" key={item.id}> {/* Đổi tên class cho item cha */}
          <Link
            prefetch="intent"
            to={url}
            className="btn btn-primary"
          >
            <span>{item.title}</span>
            
          </Link>
        </div>
      );
    });
  };

  // Tìm tất cả items đồng cấp với resourceId khớp với collectionId
  const matchedItems = findItemsByResourceId(menuCollection);

  // console.log('menuCollection', JSON.stringify(menuCollection, null, 2));
  // console.log('matchedItems', JSON.stringify(matchedItems, null, 2));

  return (
    <div className="dependent-categories">
      {renderItems(matchedItems)} {/* Hiển thị các items khớp */}
    </div>
  );
}
