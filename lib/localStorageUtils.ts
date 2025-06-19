export interface ShippingOrder {
  id: string;
  orderId: string;
  productName: string;
  customerName: string;
  status: '배송 대기' | '운송장 생성됨' | '배송 준비중' | '배송 중' | '배송 완료' | '배송 취소';
  trackingNumber: string | null;
  shippingDate: string | null;
  trackingHistory: { timestamp: string; status: string; location: string }[];
}

const SHIPPING_ORDERS_KEY = 'shippingOrders';

export const getShippingOrders = (): ShippingOrder[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SHIPPING_ORDERS_KEY);
  if (data) {
    return JSON.parse(data);
  }
  const initialData: ShippingOrder[] = [
    {
      id: 'shp001',
      orderId: 'ORD001',
      productName: '명품 가방 A',
      customerName: '김철수',
      status: '배송 대기',
      trackingNumber: null,
      shippingDate: null,
      trackingHistory: [],
    },
    {
      id: 'shp002',
      orderId: 'ORD002',
      productName: '명품 시계 B',
      customerName: '이영희',
      status: '배송 대기',
      trackingNumber: null,
      shippingDate: null,
      trackingHistory: [],
    },
    {
      id: 'shp003',
      orderId: 'ORD003',
      productName: '명품 신발 C',
      customerName: '박민수',
      status: '운송장 생성됨',
      trackingNumber: 'TRK123456789',
      shippingDate: '2024-07-20',
      trackingHistory: [
        { timestamp: '2024-07-20T10:00:00Z', status: '상품인수', location: '서울' },
      ],
    },
    {
      id: 'shp004',
      orderId: 'ORD004',
      productName: '명품 지갑 D',
      customerName: '최수진',
      status: '배송 중',
      trackingNumber: 'TRK987654321',
      shippingDate: '2024-07-19',
      trackingHistory: [
        { timestamp: '2024-07-19T14:00:00Z', status: '상품인수', location: '부산' },
        { timestamp: '2024-07-20T09:00:00Z', status: '이동중', location: '대전' },
      ],
    },
  ];
  localStorage.setItem(SHIPPING_ORDERS_KEY, JSON.stringify(initialData));
  return initialData;
};

export const saveShippingOrders = (orders: ShippingOrder[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SHIPPING_ORDERS_KEY, JSON.stringify(orders));
  }
};

export const updateShippingOrder = (updatedOrder: ShippingOrder) => {
  const orders = getShippingOrders();
  const index = orders.findIndex(order => order.id === updatedOrder.id);
  if (index !== -1) {
    orders[index] = updatedOrder;
    saveShippingOrders(orders);
  }
};

export const getShippingOrderById = (id: string): ShippingOrder | undefined => {
  const orders = getShippingOrders();
  return orders.find(order => order.id === id);
};

export const getShippingOrderByTrackingNumber = (trackingNumber: string): ShippingOrder | undefined => {
  const orders = getShippingOrders();
  return orders.find(order => order.trackingNumber === trackingNumber);
};
