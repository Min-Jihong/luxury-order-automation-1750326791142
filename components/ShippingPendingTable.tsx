'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ShippingOrder, getShippingOrders } from '@/lib/localStorageUtils';

interface ShippingPendingTableProps {
  onSelectionChange: (selectedOrders: ShippingOrder[]) => void;
  refreshTrigger: number;
}

export function ShippingPendingTable({ onSelectionChange, refreshTrigger }: ShippingPendingTableProps) {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchedOrders = getShippingOrders();
    setOrders(fetchedOrders);
    setSelectedOrderIds(new Set());
  }, [refreshTrigger]);

  useEffect(() => {
    const selected = orders.filter(order => selectedOrderIds.has(order.id));
    onSelectionChange(selected);
  }, [selectedOrderIds, orders, onSelectionChange]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allOrderIds = new Set(orders.map(order => order.id));
      setSelectedOrderIds(allOrderIds);
    } else {
      setSelectedOrderIds(new Set());
    }
  };

  const handleSelectRow = (orderId: string, checked: boolean) => {
    setSelectedOrderIds(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(orderId);
      } else {
        newSet.delete(orderId);
      }
      return newSet;
    });
  };

  const isAllSelected = orders.length > 0 && selectedOrderIds.size === orders.length;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={(checked: boolean) => handleSelectAll(checked)}
                aria-label="모두 선택"
              />
            </TableHead>
            <TableHead>주문ID</TableHead>
            <TableHead>상품명</TableHead>
            <TableHead>고객명</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>운송장번호</TableHead>
            <TableHead>배송일</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length > 0 ? (
            orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedOrderIds.has(order.id)}
                    onCheckedChange={(checked: boolean) => handleSelectRow(order.id, checked)}
                    aria-label={`주문 ${order.orderId} 선택`}
                  />
                </TableCell>
                <TableCell className="font-medium">{order.orderId}</TableCell>
                <TableCell>{order.productName}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.trackingNumber || '-'}</TableCell>
                <TableCell>{order.shippingDate || '-'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                배송 대기 중인 주문이 없습니다.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
